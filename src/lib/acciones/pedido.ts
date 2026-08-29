"use server";

import { Resend } from "resend";
import { z } from "zod";

import { correoParaCliente, correoParaTaller, type ItemCorreo } from "@/lib/correos/plantillas";
import { obtenerAjustes } from "@/lib/contenido";
import { crearClienteAdministrador } from "@/lib/supabase/administrador";
import { aplanarErrores, type ErroresCampo } from "@/lib/validacion";

const esquemaCliente = z.object({
  nombre: z.string().trim().min(2, "Escribe tu nombre."),
  email: z.email("Revisa el correo: parece que falta algo."),
  telefono: z
    .string()
    .trim()
    .transform((v) => (v === "" ? null : v))
    .nullable()
    .refine((v) => v === null || v.replace(/\D/g, "").length >= 8, {
      message: "El teléfono parece incompleto.",
    }),
  comuna: z.string().trim().transform((v) => (v === "" ? null : v)).nullable(),
  region: z.string().trim().transform((v) => (v === "" ? null : v)).nullable(),
  notas: z
    .string()
    .trim()
    .max(2000)
    .transform((v) => (v === "" ? null : v))
    .nullable(),
});

const esquemaItems = z
  .array(
    z.object({
      productoId: z.uuid(),
      cantidad: z.number().int().min(1).max(99),
      personalizacion: z.record(z.string(), z.string().max(500)),
    }),
  )
  .min(1, "Tu pedido está vacío.")
  .max(50);

export type EstadoPedido = {
  errores?: ErroresCampo;
  mensaje?: string;
  numero?: string;
  valores?: Record<string, string>;
};

export async function crearPedido(
  _previo: EstadoPedido,
  datos: FormData,
): Promise<EstadoPedido> {
  // Trampa para robots: es un campo invisible que una persona nunca llena.
  if (String(datos.get("sitio_web") ?? "") !== "") {
    return { mensaje: "No pudimos procesar el pedido." };
  }

  const crudos = {
    nombre: String(datos.get("nombre") ?? ""),
    email: String(datos.get("email") ?? ""),
    telefono: String(datos.get("telefono") ?? ""),
    comuna: String(datos.get("comuna") ?? ""),
    region: String(datos.get("region") ?? ""),
    notas: String(datos.get("notas") ?? ""),
  };

  const analisis = esquemaCliente.safeParse(crudos);
  if (!analisis.success) {
    return { errores: aplanarErrores(analisis.error), valores: crudos };
  }

  let itemsCrudos: unknown;
  try {
    itemsCrudos = JSON.parse(String(datos.get("items") ?? "[]"));
  } catch {
    return { mensaje: "No pudimos leer tu pedido. Recarga la página e inténtalo otra vez." };
  }

  const itemsAnalisis = esquemaItems.safeParse(itemsCrudos);
  if (!itemsAnalisis.success) {
    return { mensaje: "Tu pedido está vacío o tiene datos que no entendimos." };
  }

  const supabase = crearClienteAdministrador();

  /**
   * Los precios se releen de la base. Lo que manda el navegador solo sirve
   * para saber QUÉ pidió y CUÁNTOS; el cuánto cuesta lo decide el servidor.
   * Sin esto, cualquiera podría encargar un libro a un peso.
   */
  const ids = [...new Set(itemsAnalisis.data.map((i) => i.productoId))];
  const { data: productos, error: errorProductos } = await supabase
    .from("productos")
    .select("id, slug, nombre, precio, estado, stock")
    .in("id", ids);

  if (errorProductos || !productos) {
    return { mensaje: "No pudimos verificar los productos. Inténtalo de nuevo." };
  }

  const porId = new Map(productos.map((p) => [p.id, p]));
  const lineas = [];

  for (const item of itemsAnalisis.data) {
    const producto = porId.get(item.productoId);

    if (!producto || producto.estado !== "activo") {
      return {
        mensaje:
          "Uno de los productos ya no está disponible. Revisa tu pedido y vuelve a intentarlo.",
      };
    }
    if (producto.stock === "agotado") {
      return {
        mensaje: `«${producto.nombre}» quedó agotado mientras armabas el pedido. Quítalo para continuar.`,
      };
    }

    lineas.push({
      producto_id: producto.id,
      nombre: producto.nombre,
      slug: producto.slug,
      precio_unitario: producto.precio,
      cantidad: item.cantidad,
      personalizacion: item.personalizacion,
    });
  }

  const total = lineas.reduce((s, l) => s + l.precio_unitario * l.cantidad, 0);

  // El pedido se guarda ANTES de intentar el correo: si el envío falla, la
  // venta no se pierde y queda visible en el panel marcada como pendiente.
  const { data: pedido, error: errorPedido } = await supabase
    .from("pedidos")
    .insert({
      cliente_nombre: analisis.data.nombre,
      cliente_email: analisis.data.email,
      cliente_telefono: analisis.data.telefono,
      comuna: analisis.data.comuna,
      region: analisis.data.region,
      notas: analisis.data.notas,
      total,
      numero: "",
    })
    .select("id, numero")
    .single();

  if (errorPedido || !pedido) {
    return { mensaje: "No pudimos registrar tu pedido. Inténtalo de nuevo en un momento." };
  }

  const { error: errorItems } = await supabase
    .from("pedido_items")
    .insert(lineas.map((l) => ({ ...l, pedido_id: pedido.id })));

  if (errorItems) {
    await supabase.from("pedidos").delete().eq("id", pedido.id);
    return { mensaje: "No pudimos guardar el detalle del pedido. Inténtalo otra vez." };
  }

  const ajustes = await obtenerAjustes();

  await enviarCorreos({
    promesaDePago: ajustes.pago_promesa,
    numero: pedido.numero,
    nombre: analisis.data.nombre,
    email: analisis.data.email,
    telefono: analisis.data.telefono,
    comuna: analisis.data.comuna,
    region: analisis.data.region,
    notas: analisis.data.notas,
    items: lineas as ItemCorreo[],
    total,
    pedidoId: pedido.id,
  });

  return { numero: pedido.numero };
}

async function enviarCorreos(
  d: Parameters<typeof correoParaTaller>[0] & { pedidoId: string },
) {
  const supabase = crearClienteAdministrador();
  const clave = process.env.RESEND_API_KEY;
  const destino = process.env.CORREO_PEDIDOS;
  const remitente = process.env.CORREO_REMITENTE ?? "onboarding@resend.dev";

  if (!clave || !destino) {
    await supabase
      .from("pedidos")
      .update({ correo_error: "Falta configurar RESEND_API_KEY o CORREO_PEDIDOS." })
      .eq("id", d.pedidoId);
    return;
  }

  const resend = new Resend(clave);
  const taller = correoParaTaller(d);
  const cliente = correoParaCliente(d);

  try {
    const alTaller = await resend.emails.send({
      from: `Fieltromanía <${remitente}>`,
      to: destino,
      replyTo: d.email,
      subject: taller.asunto,
      html: taller.html,
    });

    // El correo al taller es el que no puede fallar: sin él no hay venta.
    if (alTaller.error) throw new Error(alTaller.error.message);

    // El del cliente es deseable pero no crítico. Con el remitente de pruebas
    // de Resend solo llega a la casilla de la cuenta, así que un fallo aquí
    // no debe marcar el pedido como problemático.
    await resend.emails
      .send({
        from: `Fieltromanía <${remitente}>`,
        to: d.email,
        subject: cliente.asunto,
        html: cliente.html,
      })
      .catch(() => undefined);

    await supabase
      .from("pedidos")
      .update({ correo_enviado: true, correo_error: null })
      .eq("id", d.pedidoId);
  } catch (error) {
    await supabase
      .from("pedidos")
      .update({
        correo_enviado: false,
        correo_error: error instanceof Error ? error.message.slice(0, 500) : "Error desconocido",
      })
      .eq("id", d.pedidoId);
  }
}

"use server";

import { revalidatePath } from "next/cache";

import { crearClienteServidor } from "@/lib/supabase/servidor";

/**
 * Qué productos vienen dentro de otro.
 *
 * Las reglas duras —no anidar, no incluirse a sí mismo, no repetir, cantidad
 * positiva— las impone la base. Aquí solo se traduce el fallo a algo que se
 * pueda leer sin saber qué es un disparador.
 */

function revalidar(productoId: string, slug?: string) {
  revalidatePath(`/admin/productos/${productoId}`);
  revalidatePath("/productos");
  if (slug) revalidatePath(`/productos/${slug}`);
}

export type EstadoIncluye = { error?: string };

export async function agregarIncluido(
  _previo: EstadoIncluye,
  datos: FormData,
): Promise<EstadoIncluye> {
  const productoId = String(datos.get("producto_id") ?? "");
  const incluidoId = String(datos.get("incluido_id") ?? "");
  const cantidad = Number(datos.get("cantidad") ?? 1);
  const slug = String(datos.get("slug") ?? "");
  const orden = Number(datos.get("orden") ?? 0);

  if (!productoId || !incluidoId)
    return { error: "Elige un producto de la lista." };
  if (!Number.isInteger(cantidad) || cantidad < 1)
    return { error: "La cantidad tiene que ser 1 o más." };

  const supabase = await crearClienteServidor();
  const { error } = await supabase.from("producto_incluye").insert({
    producto_id: productoId,
    incluido_id: incluidoId,
    cantidad,
    orden: Number.isFinite(orden) ? orden : 0,
  });

  if (error) {
    // 23505 es clave duplicada; el resto de las reglas llegan del disparador
    // con un mensaje ya escrito para una persona.
    if (error.code === "23505")
      return { error: "Ese producto ya está en el pack." };
    return { error: error.message };
  }

  revalidar(productoId, slug);
  return {};
}

export async function cambiarCantidadIncluida(datos: FormData) {
  const productoId = String(datos.get("producto_id") ?? "");
  const incluidoId = String(datos.get("incluido_id") ?? "");
  const cantidad = Number(datos.get("cantidad") ?? 1);
  const slug = String(datos.get("slug") ?? "");
  if (!productoId || !incluidoId || !Number.isInteger(cantidad) || cantidad < 1) return;

  const supabase = await crearClienteServidor();
  await supabase
    .from("producto_incluye")
    .update({ cantidad })
    .eq("producto_id", productoId)
    .eq("incluido_id", incluidoId);

  revalidar(productoId, slug);
}

export async function quitarIncluido(datos: FormData) {
  const productoId = String(datos.get("producto_id") ?? "");
  const incluidoId = String(datos.get("incluido_id") ?? "");
  const slug = String(datos.get("slug") ?? "");
  if (!productoId || !incluidoId) return;

  const supabase = await crearClienteServidor();
  await supabase
    .from("producto_incluye")
    .delete()
    .eq("producto_id", productoId)
    .eq("incluido_id", incluidoId);

  revalidar(productoId, slug);
}

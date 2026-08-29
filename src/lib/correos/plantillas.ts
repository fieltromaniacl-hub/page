import { formatearPrecio } from "@/lib/utils";

export type ItemCorreo = {
  nombre: string;
  cantidad: number;
  precio_unitario: number;
  personalizacion: Record<string, string>;
};

export type DatosCorreo = {
  numero: string;
  nombre: string;
  email: string;
  telefono: string | null;
  comuna: string | null;
  region: string | null;
  notas: string | null;
  items: ItemCorreo[];
  total: number;
};

/** Escapa el texto que viene del cliente: llega directo a un correo HTML. */
function esc(texto: string) {
  return texto
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

const ESTILO_BASE = `font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,Arial,sans-serif;color:#221f2c;line-height:1.6`;

function filasDeItems(items: ItemCorreo[]) {
  return items
    .map((item) => {
      const personalizacion = Object.entries(item.personalizacion);
      const detalle = personalizacion.length
        ? `<table role="presentation" style="margin-top:8px;background:#efeafc;border-radius:8px;width:100%">
             ${personalizacion
               .map(
                 ([pregunta, respuesta]) =>
                   `<tr><td style="padding:4px 12px;font-size:14px;color:#5a5470">${esc(pregunta)}</td>
                        <td style="padding:4px 12px;font-size:14px;font-weight:700;text-align:right">${esc(respuesta)}</td></tr>`,
               )
               .join("")}
           </table>`
        : "";

      return `<tr><td style="padding:14px 0;border-bottom:1px solid #e6e2ee">
        <table role="presentation" style="width:100%">
          <tr>
            <td style="font-weight:700;font-size:16px">${item.cantidad} &times; ${esc(item.nombre)}</td>
            <td style="text-align:right;font-weight:700;font-size:16px;white-space:nowrap">${formatearPrecio(item.precio_unitario * item.cantidad)}</td>
          </tr>
        </table>
        ${detalle}
      </td></tr>`;
    })
    .join("");
}

/** Correo para el taller: trae todo lo necesario para empezar a fabricar. */
export function correoParaTaller(d: DatosCorreo) {
  const contacto = [
    `<strong>${esc(d.nombre)}</strong>`,
    `<a href="mailto:${esc(d.email)}" style="color:#5b3fbf">${esc(d.email)}</a>`,
    d.telefono ? esc(d.telefono) : null,
    [d.comuna, d.region].filter((v): v is string => Boolean(v)).map(esc).join(", ") || null,
  ]
    .filter(Boolean)
    .join("<br>");

  return {
    asunto: `Pedido nuevo ${d.numero} \u00b7 ${d.nombre}`,
    html: `<div style="${ESTILO_BASE};max-width:560px;margin:0 auto;padding:24px">
      <p style="font-size:13px;color:#5a5470;margin:0 0 4px">Pedido ${esc(d.numero)}</p>
      <h1 style="font-size:22px;margin:0 0 16px">Lleg&oacute; un pedido nuevo</h1>

      <div style="background:#f6f4fb;border-radius:12px;padding:16px;margin-bottom:20px">
        ${contacto}
      </div>

      <table role="presentation" style="width:100%">${filasDeItems(d.items)}</table>

      <table role="presentation" style="width:100%;margin-top:16px">
        <tr>
          <td style="font-size:18px;font-weight:700">Total</td>
          <td style="text-align:right;font-size:18px;font-weight:700">${formatearPrecio(d.total)}</td>
        </tr>
      </table>

      ${
        d.notas
          ? `<div style="margin-top:20px;padding:14px;background:#fdf1e3;border-radius:12px">
               <p style="margin:0 0 4px;font-size:13px;color:#5a5470">Notas del cliente</p>
               <p style="margin:0">${esc(d.notas)}</p>
             </div>`
          : ""
      }

      <p style="margin-top:24px;font-size:14px;color:#5a5470">
        Cont&aacute;ctala para acordar el pago y la entrega.
      </p>
    </div>`,
  };
}

/** Correo para el cliente: confirma y explica qué pasa ahora. */
export function correoParaCliente(d: DatosCorreo) {
  return {
    asunto: `Recibimos tu pedido ${d.numero} \u00b7 Fieltroman\u00eda`,
    html: `<div style="${ESTILO_BASE};max-width:560px;margin:0 auto;padding:24px">
      <h1 style="font-size:22px;margin:0 0 12px">Recibimos tu pedido, ${esc(d.nombre)}</h1>

      <p style="margin:0 0 20px">
        Gracias por encargarnos algo hecho a mano. Tu pedido qued&oacute; registrado
        con el n&uacute;mero <strong>${esc(d.numero)}</strong>.
      </p>

      <div style="background:#e8f5ee;border-radius:12px;padding:16px;margin-bottom:24px">
        <p style="margin:0;font-weight:700">Nos pondremos en contacto contigo</p>
        <p style="margin:6px 0 0;font-size:15px">
          Te escribiremos para acordar la forma de pago y la entrega.
          <strong>Todav&iacute;a no tienes que pagar nada.</strong>
        </p>
      </div>

      <h2 style="font-size:16px;margin:0 0 4px">Lo que pediste</h2>
      <table role="presentation" style="width:100%">${filasDeItems(d.items)}</table>

      <table role="presentation" style="width:100%;margin-top:16px">
        <tr>
          <td style="font-size:18px;font-weight:700">Total</td>
          <td style="text-align:right;font-size:18px;font-weight:700">${formatearPrecio(d.total)}</td>
        </tr>
      </table>

      <p style="margin-top:24px;font-size:14px;color:#5a5470">
        Si algo de esto no est&aacute; bien, responde este correo y lo corregimos.
      </p>

      <p style="margin-top:24px;font-size:14px;color:#5a5470">
        Fieltroman&iacute;a &middot; Hecho a mano en Chile
      </p>
    </div>`,
  };
}

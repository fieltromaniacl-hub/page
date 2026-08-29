"use server";

import { revalidatePath } from "next/cache";

import { crearClienteServidor } from "@/lib/supabase/servidor";

export type EstadoAviso = {
  error?: string;
  errores?: Record<string, string>;
  guardado?: boolean;
  valores?: Record<string, string>;
};

const TONOS = ["naranja", "verde", "violeta"] as const;

function revalidarTienda() {
  // El aviso vive en el layout, así que aparece en todas las páginas.
  revalidatePath("/", "layout");
  revalidatePath("/admin/avisos");
}

/** "" del formulario se guarda como null, no como cadena vacía. */
const oNulo = (v: string) => (v.trim() === "" ? null : v.trim());

export async function guardarAviso(
  _previo: EstadoAviso,
  datos: FormData,
): Promise<EstadoAviso> {
  const id = String(datos.get("id") ?? "");
  const texto = String(datos.get("texto") ?? "").trim();
  const enlaceTexto = String(datos.get("enlace_texto") ?? "").trim();
  const enlaceHref = String(datos.get("enlace_href") ?? "").trim();
  const desde = String(datos.get("desde") ?? "").trim();
  const hasta = String(datos.get("hasta") ?? "").trim();
  const tono = String(datos.get("tono") ?? "naranja");
  const activo = datos.get("activo") === "on";

  const valores = { texto, enlace_texto: enlaceTexto, enlace_href: enlaceHref, desde, hasta, tono };
  const errores: Record<string, string> = {};

  if (texto.length < 3) errores.texto = "Escribe el aviso.";
  if (texto.length > 160)
    errores.texto = `Máximo 160 caracteres para que quepa en un teléfono; llevas ${texto.length}.`;

  // La base tiene la misma regla, pero aquí el mensaje explica qué hacer.
  if (enlaceTexto && !enlaceHref)
    errores.enlace_href = "Pusiste un texto de enlace: falta a dónde lleva.";
  if (enlaceHref && !enlaceTexto)
    errores.enlace_texto = "Pusiste una dirección: falta el texto del enlace.";
  if (enlaceHref && !enlaceHref.startsWith("/") && !enlaceHref.startsWith("https://"))
    errores.enlace_href = "Usa una ruta del sitio como /productos, o una dirección https://";

  if (desde && hasta && desde > hasta)
    errores.hasta = "La fecha de término no puede ser anterior a la de inicio.";

  if (!TONOS.includes(tono as (typeof TONOS)[number]))
    errores.tono = "Elige un color de la lista.";

  if (Object.keys(errores).length)
    return { errores, valores, error: "Revisa los campos marcados." };

  const supabase = await crearClienteServidor();
  const fila = {
    texto,
    enlace_texto: oNulo(enlaceTexto),
    enlace_href: oNulo(enlaceHref),
    desde: oNulo(desde),
    hasta: oNulo(hasta),
    tono: tono as (typeof TONOS)[number],
    activo,
  };

  const { error } = id
    ? await supabase.from("avisos").update(fila).eq("id", id)
    : await supabase.from("avisos").insert(fila);

  if (error) return { error: `No se pudo guardar: ${error.message}`, valores };

  revalidarTienda();
  return { guardado: true };
}

export async function alternarAviso(datos: FormData) {
  const id = String(datos.get("id") ?? "");
  const activo = String(datos.get("activo") ?? "") === "true";
  if (!id) return;

  const supabase = await crearClienteServidor();
  await supabase.from("avisos").update({ activo: !activo }).eq("id", id);

  revalidarTienda();
}

export async function eliminarAviso(datos: FormData) {
  const id = String(datos.get("id") ?? "");
  if (!id) return;

  const supabase = await crearClienteServidor();
  await supabase.from("avisos").delete().eq("id", id);

  revalidarTienda();
}

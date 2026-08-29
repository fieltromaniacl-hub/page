"use server";

import { revalidatePath } from "next/cache";

import { crearClienteServidor } from "@/lib/supabase/servidor";

export type EstadoPortada = {
  error?: string;
  errores?: Record<string, string>;
  guardado?: boolean;
  valores?: Record<string, string>;
};

const TONOS = ["naranja", "verde", "violeta"] as const;

/** «3» o «1-2»: el formato que entiende /productos?edad= */
const RANGO = /^\d+(-\d+)?$/;

function revalidar() {
  revalidatePath("/");
  revalidatePath("/como-funciona");
  revalidatePath("/admin/portada");
}

// ─── Etapas ─────────────────────────────────────────────────────────────────

export async function guardarEtapa(
  _previo: EstadoPortada,
  datos: FormData,
): Promise<EstadoPortada> {
  const id = String(datos.get("id") ?? "");
  const edad = String(datos.get("edad") ?? "").trim();
  const rango = String(datos.get("rango") ?? "").trim();
  const titulo = String(datos.get("titulo") ?? "").trim();
  const texto = String(datos.get("texto") ?? "").trim();
  const tono = String(datos.get("tono") ?? "violeta");
  const orden = Number(datos.get("orden") ?? 0);
  const activa = datos.get("activa") === "on";

  const valores = { edad, rango, titulo, texto, tono };
  const errores: Record<string, string> = {};

  if (edad.length < 2) errores.edad = "Escribe la edad como se lee: «3 a 4 años».";
  if (!RANGO.test(rango))
    errores.rango =
      "Usa números: «3» para una edad sola, o «1-2» para un rango. Es lo que filtra el catálogo.";
  if (titulo.length < 2) errores.titulo = "Ponle un título a la etapa.";
  if (texto.length < 10) errores.texto = "Explica qué trabaja esta etapa.";
  if (!TONOS.includes(tono as (typeof TONOS)[number]))
    errores.tono = "Elige un color de la lista.";

  if (Object.keys(errores).length)
    return { errores, valores, error: "Revisa los campos marcados." };

  const supabase = await crearClienteServidor();
  const fila = {
    edad,
    rango,
    titulo,
    texto,
    tono: tono as (typeof TONOS)[number],
    orden: Number.isFinite(orden) ? orden : 0,
    activa,
  };

  const { error } = id
    ? await supabase.from("etapas").update(fila).eq("id", id)
    : await supabase.from("etapas").insert(fila);

  if (error) return { error: `No se pudo guardar: ${error.message}`, valores };

  revalidar();
  return { guardado: true };
}

export async function eliminarEtapa(datos: FormData) {
  const id = String(datos.get("id") ?? "");
  if (!id) return;

  const supabase = await crearClienteServidor();
  await supabase.from("etapas").delete().eq("id", id);
  revalidar();
}

// ─── Pasos ──────────────────────────────────────────────────────────────────

export async function guardarPaso(
  _previo: EstadoPortada,
  datos: FormData,
): Promise<EstadoPortada> {
  const id = String(datos.get("id") ?? "");
  const titulo = String(datos.get("titulo") ?? "").trim();
  const texto = String(datos.get("texto") ?? "").trim();
  const orden = Number(datos.get("orden") ?? 0);
  const enPortada = datos.get("en_portada") === "on";

  const valores = { titulo, texto };
  const errores: Record<string, string> = {};

  if (titulo.length < 2) errores.titulo = "Ponle un título al paso.";
  if (texto.length < 10) errores.texto = "Explica qué pasa en este paso.";

  if (Object.keys(errores).length)
    return { errores, valores, error: "Revisa los campos marcados." };

  const supabase = await crearClienteServidor();
  const fila = {
    titulo,
    texto,
    en_portada: enPortada,
    orden: Number.isFinite(orden) ? orden : 0,
  };

  const { error } = id
    ? await supabase.from("pasos").update(fila).eq("id", id)
    : await supabase.from("pasos").insert(fila);

  if (error) return { error: `No se pudo guardar: ${error.message}`, valores };

  revalidar();
  return { guardado: true };
}

export async function eliminarPaso(datos: FormData) {
  const id = String(datos.get("id") ?? "");
  if (!id) return;

  const supabase = await crearClienteServidor();
  await supabase.from("pasos").delete().eq("id", id);
  revalidar();
}

/** Intercambia un elemento con su vecino y reescribe el orden completo. */
async function mover(
  tabla: "etapas" | "pasos",
  id: string,
  direccion: string,
) {
  const supabase = await crearClienteServidor();
  const { data: filas } = await supabase.from(tabla).select("id, orden").order("orden");
  if (!filas) return;

  const i = filas.findIndex((f) => f.id === id);
  const j = direccion === "arriba" ? i - 1 : i + 1;
  if (i === -1 || j < 0 || j >= filas.length) return;

  const reordenadas = [...filas];
  [reordenadas[i], reordenadas[j]] = [reordenadas[j], reordenadas[i]];

  await Promise.all(
    reordenadas.map((f, indice) =>
      supabase.from(tabla).update({ orden: (indice + 1) * 10 }).eq("id", f.id),
    ),
  );

  revalidar();
}

export async function moverEtapa(datos: FormData) {
  await mover("etapas", String(datos.get("id") ?? ""), String(datos.get("direccion") ?? ""));
}

export async function moverPaso(datos: FormData) {
  await mover("pasos", String(datos.get("id") ?? ""), String(datos.get("direccion") ?? ""));
}

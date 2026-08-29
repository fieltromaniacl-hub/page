"use server";

import { revalidatePath } from "next/cache";

import { AJUSTES, CLAVES_AJUSTE, type ClaveAjuste, type DefinicionAjuste } from "@/lib/ajustes";
import { crearClienteServidor } from "@/lib/supabase/servidor";

export type EstadoAjustes = {
  error?: string;
  errores?: Record<string, string>;
  guardado?: boolean;
  /** Lo enviado, para repoblar el formulario si algo falla. */
  valores?: Record<string, string>;
};

const CORREO = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Guarda todos los ajustes de una vez.
 *
 * Se hace en un solo `upsert` en lugar de una fila por petición para que no
 * pueda quedar la mitad guardada: o entra todo o no entra nada, y ella no se
 * queda con el sitio diciendo dos cosas distintas.
 */
export async function guardarAjustes(
  _previo: EstadoAjustes,
  datos: FormData,
): Promise<EstadoAjustes> {
  // Solo se tocan las claves que venían en el formulario. El panel muestra los
  // ajustes en dos pantallas (Portada y Textos), y recorrer el catálogo entero
  // haría que guardar una borrara los campos de la otra por no venir en el
  // envío.
  const enviadas = CLAVES_AJUSTE.filter((clave) => datos.has(clave));
  if (!enviadas.length) return { error: "No llegó ningún campo que guardar." };

  const valores: Record<string, string> = {};
  const errores: Record<string, string> = {};

  for (const clave of enviadas) {
    const def = AJUSTES[clave] as DefinicionAjuste;
    const valor = String(datos.get(clave) ?? "").trim();
    valores[clave] = valor;

    if (valor === "") {
      errores[clave] = "Este texto no puede quedar vacío.";
      continue;
    }
    if (def.maxLargo && valor.length > def.maxLargo) {
      errores[clave] = `Máximo ${def.maxLargo} caracteres; llevas ${valor.length}.`;
    }
    if (def.tipo === "correo" && !CORREO.test(valor)) {
      errores[clave] = "Escribe una dirección de correo válida.";
    }
  }

  if (Object.keys(errores).length) {
    return { errores, valores, error: "Revisa los campos marcados." };
  }

  const supabase = await crearClienteServidor();
  const { error } = await supabase.from("ajustes").upsert(
    enviadas.map((clave) => ({ clave, valor: valores[clave] })),
    { onConflict: "clave" },
  );

  if (error) {
    return { error: `No se pudo guardar: ${error.message}`, valores };
  }

  // Los ajustes se ven en casi todo el sitio, así que se revalida entero.
  revalidatePath("/", "layout");

  return { guardado: true };
}

/** Devuelve un ajuste a su texto original, sin tocar los demás. */
export async function restablecerAjuste(datos: FormData) {
  const clave = String(datos.get("clave") ?? "") as ClaveAjuste;
  if (!CLAVES_AJUSTE.includes(clave)) return;

  const supabase = await crearClienteServidor();
  await supabase
    .from("ajustes")
    .upsert(
      { clave, valor: (AJUSTES[clave] as DefinicionAjuste).porDefecto },
      { onConflict: "clave" },
    );

  revalidatePath("/", "layout");
}

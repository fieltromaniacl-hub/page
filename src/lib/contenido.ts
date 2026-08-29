import { cache } from "react";

import { ajustesPorDefecto, type Ajustes, type ClaveAjuste } from "@/lib/ajustes";
import { crearClientePublico } from "@/lib/supabase/publico";

/**
 * Ajustes y páginas editables desde el panel.
 *
 * Va aparte de `consultas.ts`, que resuelve el catálogo: son dos cosas que
 * cambian por motivos distintos.
 */

/**
 * Ajustes resueltos: lo que ella escribió, o el valor por defecto del código.
 *
 * `cache` deduplica dentro de un mismo render, así que el pie, la ficha y el
 * carrito de una misma página comparten una sola consulta.
 *
 * Si la consulta falla, devuelve los valores por defecto en vez de propagar el
 * error: que se caiga la portada porque no se pudo leer una frase de cortesía
 * sería mucho peor que mostrar el texto original.
 */
export const obtenerAjustes = cache(async (): Promise<Ajustes> => {
  const resueltos = ajustesPorDefecto();

  try {
    const supabase = crearClientePublico();
    const { data } = await supabase.from("ajustes").select("clave, valor");

    for (const fila of data ?? []) {
      const clave = fila.clave as ClaveAjuste;
      // Una clave retirada del código puede seguir en la base: se ignora.
      if (clave in resueltos && fila.valor.trim() !== "") {
        resueltos[clave] = fila.valor;
      }
    }
  } catch {
    // Se queda con los valores por defecto.
  }

  return resueltos;
});

export type BloquePagina = {
  id: string;
  titulo: string | null;
  cuerpo: string;
  orden: number;
};

export type PaginaContenido = {
  id: string;
  slug: string;
  titulo: string;
  bajada: string | null;
  seo_titulo: string | null;
  seo_descripcion: string | null;
  publicada: boolean;
  del_sistema: boolean;
  orden: number;
  bloques: BloquePagina[];
};

/** Una página publicada con sus bloques ordenados, o null si no existe. */
export const obtenerPagina = cache(
  async (slug: string): Promise<PaginaContenido | null> => {
    const supabase = crearClientePublico();
    const { data } = await supabase
      .from("paginas")
      .select(
        "id, slug, titulo, bajada, seo_titulo, seo_descripcion, publicada, del_sistema, orden, pagina_bloques(id, titulo, cuerpo, orden)",
      )
      .eq("slug", slug)
      .eq("publicada", true)
      .maybeSingle();

    if (!data) return null;

    return {
      ...data,
      bloques: [...data.pagina_bloques].sort((a, b) => a.orden - b.orden),
    };
  },
);

/** Slugs publicados, para generar las rutas estáticas y el sitemap. */
export async function obtenerSlugsDePaginas() {
  const supabase = crearClientePublico();
  const { data } = await supabase
    .from("paginas")
    .select("slug, actualizado_en")
    .eq("publicada", true)
    .order("orden");
  return data ?? [];
}

/**
 * Parte un cuerpo en párrafos. Ella escribe en un área de texto normal,
 * separando ideas con una línea en blanco; no hay marcado que aprender.
 */
export function parrafosDe(cuerpo: string) {
  return cuerpo
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);
}

export type Aviso = {
  id: string;
  texto: string;
  enlace_texto: string | null;
  enlace_href: string | null;
  tono: "naranja" | "verde" | "violeta";
};

/**
 * El aviso que toca mostrar ahora, o null.
 *
 * No filtra por fechas aquí: lo hace la política RLS de la tabla, que compara
 * contra el día en Chile. El público no puede leer un aviso apagado ni vencido
 * aunque consulte la API a mano, así que una promoción en borrador no se
 * filtra antes de tiempo.
 *
 * Si hay varios vigentes se muestra uno solo, el de menor `orden`: dos franjas
 * apiladas sobre el encabezado serían ruido, no dos anuncios.
 */
export const obtenerAvisoVigente = cache(async (): Promise<Aviso | null> => {
  try {
    const supabase = crearClientePublico();
    const { data } = await supabase
      .from("avisos")
      .select("id, texto, enlace_texto, enlace_href, tono")
      .order("orden")
      .order("creado_en", { ascending: false })
      .limit(1)
      .maybeSingle();

    return data ?? null;
  } catch {
    // Un aviso es prescindible: si la base no responde, la tienda sigue.
    return null;
  }
});

export type Etapa = {
  id: string;
  edad: string;
  rango: string;
  titulo: string;
  texto: string;
  tono: "naranja" | "verde" | "violeta";
};

export type Paso = { id: string; titulo: string; texto: string };

/** Las tarjetas de edad de la portada. RLS ya descarta las desactivadas. */
export const obtenerEtapas = cache(async (): Promise<Etapa[]> => {
  try {
    const supabase = crearClientePublico();
    const { data } = await supabase
      .from("etapas")
      .select("id, edad, rango, titulo, texto, tono")
      .order("orden");
    return data ?? [];
  } catch {
    return [];
  }
});

/**
 * Los pasos del pedido, una sola vez para los dos sitios donde se explican.
 *
 * `soloPortada` devuelve el resumen; sin él vienen todos, que es lo que
 * muestra /como-funciona. Antes eran dos listas escritas a mano que ya se
 * contradecían entre sí.
 */
export const obtenerPasos = cache(
  async (soloPortada = false): Promise<Paso[]> => {
    try {
      const supabase = crearClientePublico();
      let consulta = supabase.from("pasos").select("id, titulo, texto").order("orden");
      if (soloPortada) consulta = consulta.eq("en_portada", true);
      const { data } = await consulta;
      return data ?? [];
    } catch {
      return [];
    }
  },
);

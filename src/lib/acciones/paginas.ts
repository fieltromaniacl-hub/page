"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { crearClienteServidor } from "@/lib/supabase/servidor";
import { generarSlug } from "@/lib/validacion";

export type EstadoPagina = {
  error?: string;
  errores?: Record<string, string>;
  guardado?: boolean;
  valores?: Record<string, string>;
};

/** Slugs que ya usan rutas propias de la tienda y no se pueden ocupar. */
const RESERVADOS = new Set([
  "productos",
  "carrito",
  "contacto",
  "como-funciona",
  "admin",
  "api",
  "robots.txt",
  "sitemap.xml",
  "llms.txt",
]);

function revalidarTienda(slug?: string) {
  revalidatePath("/admin/paginas");
  if (slug) revalidatePath(`/${slug}`);
  // El pie enlaza las páginas, así que cambia en todas.
  revalidatePath("/", "layout");
}

export async function guardarPagina(
  _previo: EstadoPagina,
  datos: FormData,
): Promise<EstadoPagina> {
  const id = String(datos.get("id") ?? "");
  const titulo = String(datos.get("titulo") ?? "").trim();
  const bajada = String(datos.get("bajada") ?? "").trim();
  const slugPedido = String(datos.get("slug") ?? "").trim();
  const seoTitulo = String(datos.get("seo_titulo") ?? "").trim();
  const seoDescripcion = String(datos.get("seo_descripcion") ?? "").trim();
  const publicada = datos.get("publicada") === "on";
  const orden = Number(datos.get("orden") ?? 0);
  const delSistema = datos.get("del_sistema") === "true";

  const valores = {
    titulo,
    bajada,
    slug: slugPedido,
    seo_titulo: seoTitulo,
    seo_descripcion: seoDescripcion,
  };
  const errores: Record<string, string> = {};

  if (titulo.length < 2) errores.titulo = "Ponle un título a la página.";

  // La dirección de una página del sistema no se toca: la tienda la enlaza
  // desde el pie y desde el carrito, y cambiarla dejaría enlaces rotos.
  const slug = delSistema
    ? String(datos.get("slug_original") ?? "")
    : slugPedido
      ? generarSlug(slugPedido)
      : generarSlug(titulo);

  if (!delSistema) {
    if (!slug) errores.slug = "La dirección no puede quedar vacía.";
    else if (RESERVADOS.has(slug))
      errores.slug = `«${slug}» ya lo usa otra parte del sitio. Elige otra dirección.`;
  }

  if (Object.keys(errores).length) {
    return { errores, valores, error: "Revisa los campos marcados." };
  }

  const supabase = await crearClienteServidor();
  const fila = {
    titulo,
    slug,
    bajada: bajada || null,
    seo_titulo: seoTitulo || null,
    seo_descripcion: seoDescripcion || null,
    publicada,
    orden: Number.isFinite(orden) ? orden : 0,
  };

  if (id) {
    const { error } = await supabase.from("paginas").update(fila).eq("id", id);
    if (error) {
      if (error.code === "23505")
        return { errores: { slug: "Ya hay otra página con esa dirección." }, valores };
      return { error: `No se pudo guardar: ${error.message}`, valores };
    }
    revalidarTienda(slug);
    return { guardado: true };
  }

  const { data, error } = await supabase
    .from("paginas")
    .insert(fila)
    .select("id")
    .single();

  if (error) {
    if (error.code === "23505")
      return { errores: { slug: "Ya hay otra página con esa dirección." }, valores };
    return { error: `No se pudo crear: ${error.message}`, valores };
  }

  revalidarTienda(slug);
  redirect(`/admin/paginas/${data.id}`);
}

export async function guardarBloque(datos: FormData) {
  const id = String(datos.get("id") ?? "");
  const paginaId = String(datos.get("pagina_id") ?? "");
  const slug = String(datos.get("slug") ?? "");
  const titulo = String(datos.get("titulo") ?? "").trim();
  const cuerpo = String(datos.get("cuerpo") ?? "").trim();
  const orden = Number(datos.get("orden") ?? 0);

  if (!paginaId) return;

  const supabase = await crearClienteServidor();
  const fila = {
    pagina_id: paginaId,
    titulo: titulo || null,
    cuerpo,
    orden: Number.isFinite(orden) ? orden : 0,
  };

  if (id) await supabase.from("pagina_bloques").update(fila).eq("id", id);
  else await supabase.from("pagina_bloques").insert(fila);

  revalidatePath(`/admin/paginas/${paginaId}`);
  revalidarTienda(slug);
}

export async function eliminarBloque(datos: FormData) {
  const id = String(datos.get("id") ?? "");
  const paginaId = String(datos.get("pagina_id") ?? "");
  const slug = String(datos.get("slug") ?? "");
  if (!id) return;

  const supabase = await crearClienteServidor();
  await supabase.from("pagina_bloques").delete().eq("id", id);

  revalidatePath(`/admin/paginas/${paginaId}`);
  revalidarTienda(slug);
}

/** Intercambia el orden de un bloque con su vecino. */
export async function moverBloque(datos: FormData) {
  const id = String(datos.get("id") ?? "");
  const paginaId = String(datos.get("pagina_id") ?? "");
  const slug = String(datos.get("slug") ?? "");
  const direccion = String(datos.get("direccion") ?? "");
  if (!id || !paginaId) return;

  const supabase = await crearClienteServidor();
  const { data: bloques } = await supabase
    .from("pagina_bloques")
    .select("id, orden")
    .eq("pagina_id", paginaId)
    .order("orden");

  if (!bloques) return;

  const i = bloques.findIndex((b) => b.id === id);
  const j = direccion === "arriba" ? i - 1 : i + 1;
  if (i === -1 || j < 0 || j >= bloques.length) return;

  // Se reescribe el orden completo: si dos bloques compartían número, esto lo
  // deja consistente en vez de arrastrar el empate.
  const reordenados = [...bloques];
  [reordenados[i], reordenados[j]] = [reordenados[j], reordenados[i]];

  await Promise.all(
    reordenados.map((b, indice) =>
      supabase
        .from("pagina_bloques")
        .update({ orden: (indice + 1) * 10 })
        .eq("id", b.id),
    ),
  );

  revalidatePath(`/admin/paginas/${paginaId}`);
  revalidarTienda(slug);
}

export async function eliminarPagina(datos: FormData) {
  const id = String(datos.get("id") ?? "");
  if (!id) return;

  const supabase = await crearClienteServidor();
  // El disparador de la base rechaza las páginas del sistema; aquí solo se
  // refleja ese error, no se duplica la regla.
  const { error } = await supabase.from("paginas").delete().eq("id", id);
  if (error) return;

  revalidarTienda();
  redirect("/admin/paginas");
}

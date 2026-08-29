"use server";

import { revalidatePath } from "next/cache";

import { crearClienteServidor } from "@/lib/supabase/servidor";
import { generarSlug } from "@/lib/validacion";

export type EstadoCategoria = { error?: string };

export async function guardarCategoria(
  _previo: EstadoCategoria,
  datos: FormData,
): Promise<EstadoCategoria> {
  const id = String(datos.get("id") ?? "");
  const nombre = String(datos.get("nombre") ?? "").trim();
  const descripcion = String(datos.get("descripcion") ?? "").trim();
  const orden = Number(datos.get("orden") ?? 0);

  if (nombre.length < 2) return { error: "Ponle un nombre a la categoría." };

  const supabase = await crearClienteServidor();
  const valores = {
    nombre,
    slug: generarSlug(nombre),
    descripcion: descripcion || null,
    orden: Number.isFinite(orden) ? orden : 0,
  };

  const { error } = id
    ? await supabase.from("categorias").update(valores).eq("id", id)
    : await supabase.from("categorias").insert(valores);

  if (error) {
    if (error.code === "23505") return { error: "Ya existe una categoría con ese nombre." };
    return { error: `No se pudo guardar: ${error.message}` };
  }

  revalidatePath("/admin/categorias");
  revalidatePath("/productos");
  return {};
}

/**
 * Los productos de la categoría no se borran: quedan sin categoría, porque la
 * base declara `on delete set null`. Perder el producto sería mucho peor que
 * perder su clasificación.
 */
export async function eliminarCategoria(datos: FormData) {
  const id = String(datos.get("id") ?? "");
  if (!id) return;

  const supabase = await crearClienteServidor();
  await supabase.from("categorias").delete().eq("id", id);

  revalidatePath("/admin/categorias");
  revalidatePath("/productos");
}

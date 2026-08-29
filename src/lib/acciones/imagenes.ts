"use server";

import { revalidatePath } from "next/cache";

import { crearClienteServidor } from "@/lib/supabase/servidor";

const TIPOS_ACEPTADOS = ["image/jpeg", "image/png", "image/webp", "image/avif"];
const TAMANO_MAXIMO = 5 * 1024 * 1024; // 5 MB, igual que el límite del bucket

export type EstadoImagen = { error?: string };

export async function subirImagenes(
  _previo: EstadoImagen,
  datos: FormData,
): Promise<EstadoImagen> {
  const productoId = String(datos.get("producto_id") ?? "");
  if (!productoId) return { error: "Falta el producto." };

  const archivos = datos
    .getAll("archivos")
    .filter((a): a is File => a instanceof File && a.size > 0);

  if (!archivos.length) return { error: "No elegiste ninguna foto." };

  for (const archivo of archivos) {
    if (!TIPOS_ACEPTADOS.includes(archivo.type)) {
      return { error: `«${archivo.name}» no es una imagen JPG, PNG, WEBP ni AVIF.` };
    }
    if (archivo.size > TAMANO_MAXIMO) {
      return {
        error: `«${archivo.name}» pesa más de 5 MB. Redúcela antes de subirla.`,
      };
    }
  }

  const supabase = await crearClienteServidor();

  // Se colocan al final del orden existente.
  const { data: existentes } = await supabase
    .from("producto_imagenes")
    .select("orden")
    .eq("producto_id", productoId)
    .order("orden", { ascending: false })
    .limit(1);

  let siguienteOrden = (existentes?.[0]?.orden ?? -1) + 1;

  for (const archivo of archivos) {
    const extension = archivo.name.split(".").pop()?.toLowerCase() ?? "jpg";
    const ruta = `${productoId}/${crypto.randomUUID()}.${extension}`;

    const { error: errorSubida } = await supabase.storage
      .from("productos")
      .upload(ruta, archivo, { contentType: archivo.type, upsert: false });

    if (errorSubida) {
      return { error: `No se pudo subir «${archivo.name}»: ${errorSubida.message}` };
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from("productos").getPublicUrl(ruta);

    const { error: errorFila } = await supabase.from("producto_imagenes").insert({
      producto_id: productoId,
      url: publicUrl,
      alt: "",
      orden: siguienteOrden++,
    });

    if (errorFila) {
      // El archivo ya está arriba pero la fila falló: se limpia para no dejar
      // basura invisible ocupando el almacenamiento.
      await supabase.storage.from("productos").remove([ruta]);
      return { error: `No se pudo registrar «${archivo.name}».` };
    }
  }

  revalidatePath(`/admin/productos/${productoId}`);
  return {};
}

export async function guardarTextoAlternativo(datos: FormData) {
  const id = String(datos.get("id") ?? "");
  const productoId = String(datos.get("producto_id") ?? "");
  const alt = String(datos.get("alt") ?? "").trim().slice(0, 160);
  if (!id) return;

  const supabase = await crearClienteServidor();
  await supabase.from("producto_imagenes").update({ alt }).eq("id", id);
  revalidatePath(`/admin/productos/${productoId}`);
}

export async function eliminarImagen(datos: FormData) {
  const id = String(datos.get("id") ?? "");
  const productoId = String(datos.get("producto_id") ?? "");
  if (!id) return;

  const supabase = await crearClienteServidor();

  const { data: imagen } = await supabase
    .from("producto_imagenes")
    .select("url")
    .eq("id", id)
    .maybeSingle();

  if (imagen) {
    const ruta = imagen.url.split("/productos/").pop();
    if (ruta) await supabase.storage.from("productos").remove([ruta]);
  }

  await supabase.from("producto_imagenes").delete().eq("id", id);
  revalidatePath(`/admin/productos/${productoId}`);
}

/** Mueve una imagen una posición, intercambiando el orden con su vecina. */
export async function moverImagen(datos: FormData) {
  const id = String(datos.get("id") ?? "");
  const productoId = String(datos.get("producto_id") ?? "");
  const direccion = String(datos.get("direccion") ?? "");
  if (!id || !productoId) return;

  const supabase = await crearClienteServidor();
  const { data: imagenes } = await supabase
    .from("producto_imagenes")
    .select("id, orden")
    .eq("producto_id", productoId)
    .order("orden");

  if (!imagenes) return;

  const i = imagenes.findIndex((img) => img.id === id);
  const j = direccion === "arriba" ? i - 1 : i + 1;
  if (i < 0 || j < 0 || j >= imagenes.length) return;

  await Promise.all([
    supabase.from("producto_imagenes").update({ orden: imagenes[j].orden }).eq("id", imagenes[i].id),
    supabase.from("producto_imagenes").update({ orden: imagenes[i].orden }).eq("id", imagenes[j].id),
  ]);

  revalidatePath(`/admin/productos/${productoId}`);
}

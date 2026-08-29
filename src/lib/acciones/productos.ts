"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { crearClienteServidor } from "@/lib/supabase/servidor";
import {
  aplanarErrores,
  esquemaProducto,
  generarSlug,
  type ErroresCampo,
} from "@/lib/validacion";

export type EstadoFormulario = {
  errores?: ErroresCampo;
  mensaje?: string;
  /**
   * Lo que la persona había escrito.
   *
   * React 19 reinicia los campos no controlados en cuanto la acción termina.
   * Sin devolver los valores, un error de validación borraría un formulario
   * largo entero. Se reenvían para repoblarlo.
   */
  valores?: Record<string, string>;
};

/**
 * Todas estas acciones usan el cliente con sesión, no el de clave secreta.
 * Eso significa que las políticas RLS siguen aplicando: si alguien llamara a
 * una acción sin ser administrador, la base la rechaza aunque el código de la
 * aplicación tuviera un descuido.
 */

function leerFormulario(datos: FormData) {
  const nombre = String(datos.get("nombre") ?? "");
  const slugCrudo = String(datos.get("slug") ?? "").trim();

  return {
    nombre,
    // Si no se escribió dirección, se deriva del nombre.
    slug: slugCrudo === "" ? generarSlug(nombre) : generarSlug(slugCrudo),
    resumen: String(datos.get("resumen") ?? ""),
    descripcion: String(datos.get("descripcion") ?? ""),
    precio: String(datos.get("precio") ?? ""),
    precio_antes: String(datos.get("precio_antes") ?? ""),
    categoria_id: String(datos.get("categoria_id") ?? ""),
    estado: String(datos.get("estado") ?? "inactivo"),
    stock: String(datos.get("stock") ?? "por_encargo"),
    cantidad: String(datos.get("cantidad") ?? ""),
    destacado: datos.get("destacado") === "on",
    orden: String(datos.get("orden") ?? "0"),
    edad_min: String(datos.get("edad_min") ?? ""),
    edad_max: String(datos.get("edad_max") ?? ""),
    materiales: String(datos.get("materiales") ?? ""),
    medidas: String(datos.get("medidas") ?? ""),
    cuidados: String(datos.get("cuidados") ?? ""),
    dias_confeccion: String(datos.get("dias_confeccion") ?? ""),
    habilidades: String(datos.get("habilidades") ?? ""),
    seo_titulo: String(datos.get("seo_titulo") ?? ""),
    seo_descripcion: String(datos.get("seo_descripcion") ?? ""),
  };
}

export async function guardarProducto(
  _previo: EstadoFormulario,
  datos: FormData,
): Promise<EstadoFormulario> {
  const id = datos.get("id");
  const esEdicion = typeof id === "string" && id !== "";

  const crudos = leerFormulario(datos);
  const enviados = Object.fromEntries(
    Object.entries(crudos).map(([k, v]) => [k, String(v)]),
  );

  const analisis = esquemaProducto.safeParse(crudos);
  if (!analisis.success) {
    return { errores: aplanarErrores(analisis.error), valores: enviados };
  }

  const supabase = await crearClienteServidor();
  const valores = analisis.data;

  const resultado = esEdicion
    ? await supabase.from("productos").update(valores).eq("id", id).select("id").single()
    : await supabase.from("productos").insert(valores).select("id").single();

  if (resultado.error) {
    // 23505 = violación de unicidad; aquí solo puede ser el slug.
    if (resultado.error.code === "23505") {
      return {
        errores: { slug: "Ya existe un producto con esa dirección. Cámbiala." },
        valores: enviados,
      };
    }
    return {
      mensaje: `No se pudo guardar: ${resultado.error.message}`,
      valores: enviados,
    };
  }

  revalidatePath("/admin/productos");
  revalidatePath("/productos");
  revalidatePath(`/productos/${valores.slug}`);

  if (!esEdicion) {
    // Tras crear, se pasa a la edición: ahí se cargan fotos y personalización.
    redirect(`/admin/productos/${resultado.data.id}?creado=1`);
  }

  return { mensaje: "Cambios guardados." };
}

export async function cambiarEstadoProducto(datos: FormData) {
  const id = String(datos.get("id") ?? "");
  const estado = String(datos.get("estado") ?? "");
  if (!id || !["activo", "inactivo", "archivado"].includes(estado)) return;

  const supabase = await crearClienteServidor();
  await supabase
    .from("productos")
    .update({ estado: estado as "activo" | "inactivo" | "archivado" })
    .eq("id", id);

  revalidatePath("/admin/productos");
  revalidatePath("/productos");
}

export async function cambiarStockProducto(datos: FormData) {
  const id = String(datos.get("id") ?? "");
  const stock = String(datos.get("stock") ?? "");
  if (!id || !["disponible", "por_encargo", "agotado"].includes(stock)) return;

  const supabase = await crearClienteServidor();
  await supabase
    .from("productos")
    .update({ stock: stock as "disponible" | "por_encargo" | "agotado" })
    .eq("id", id);

  revalidatePath("/admin/productos");
  revalidatePath("/productos");
}

/**
 * Borrado definitivo. Las imágenes y los campos caen en cascada, pero los
 * pedidos históricos sobreviven porque guardan su propia copia del nombre y
 * del precio.
 */
export async function eliminarProducto(datos: FormData) {
  const id = String(datos.get("id") ?? "");
  if (!id) return;

  const supabase = await crearClienteServidor();

  // Primero las imágenes del almacenamiento: si se borra la fila antes, se
  // pierde la referencia y los archivos quedan huérfanos ocupando espacio.
  const { data: imagenes } = await supabase
    .from("producto_imagenes")
    .select("url")
    .eq("producto_id", id);

  const rutas = (imagenes ?? [])
    .map((img) => img.url.split("/productos/").pop())
    .filter((r): r is string => Boolean(r));

  if (rutas.length) {
    await supabase.storage.from("productos").remove(rutas);
  }

  await supabase.from("productos").delete().eq("id", id);

  revalidatePath("/admin/productos");
  revalidatePath("/productos");
  redirect("/admin/productos");
}

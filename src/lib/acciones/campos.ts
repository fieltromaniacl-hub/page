"use server";

import { revalidatePath } from "next/cache";

import { crearClienteServidor } from "@/lib/supabase/servidor";
import { aplanarErrores, esquemaCampo, type ErroresCampo } from "@/lib/validacion";

export type EstadoCampo = {
  errores?: ErroresCampo;
  valores?: Record<string, string>;
  exito?: boolean;
  /**
   * Marca única por intento. El formulario se monta con esta clave, así que
   * cada respuesta del servidor lo reconstruye desde cero.
   *
   * Hace falta porque React 19 reinicia el DOM del formulario al terminar la
   * acción, pero no reinicia el estado de React. Sin esto, un `select`
   * controlado queda mostrando una opción distinta de la que el componente
   * cree tener seleccionada.
   */
  sello?: string;
};

/**
 * Los campos de personalización son lo que se le pregunta al cliente al
 * comprar: el nombre a bordar, los colores, la edad del niño. Se configuran
 * por producto para no tener que tocar código cada vez que cambia el catálogo.
 */
export async function guardarCampo(
  _previo: EstadoCampo,
  datos: FormData,
): Promise<EstadoCampo> {
  const productoId = String(datos.get("producto_id") ?? "");
  const id = String(datos.get("id") ?? "");
  if (!productoId) return { errores: { _: "Falta el producto." } };

  const crudos = {
    etiqueta: String(datos.get("etiqueta") ?? ""),
    ayuda: String(datos.get("ayuda") ?? ""),
    tipo: String(datos.get("tipo") ?? "texto"),
    opciones: String(datos.get("opciones") ?? ""),
    requerido: datos.get("requerido") === "on",
    max_largo: String(datos.get("max_largo") ?? ""),
    orden: String(datos.get("orden") ?? "0"),
  };

  const enviados = Object.fromEntries(
    Object.entries(crudos).map(([k, v]) => [k, String(v)]),
  );

  const analisis = esquemaCampo.safeParse(crudos);
  if (!analisis.success) {
    return {
      errores: aplanarErrores(analisis.error),
      valores: enviados,
      sello: crypto.randomUUID(),
    };
  }

  const supabase = await crearClienteServidor();
  const valores = { ...analisis.data, producto_id: productoId };

  const { error } = id
    ? await supabase.from("producto_campos").update(valores).eq("id", id)
    : await supabase.from("producto_campos").insert(valores);

  if (error) {
    return {
      errores: { _: `No se pudo guardar: ${error.message}` },
      valores: enviados,
      sello: crypto.randomUUID(),
    };
  }

  revalidatePath(`/admin/productos/${productoId}`);
  return { exito: true, sello: crypto.randomUUID() };
}

export async function eliminarCampo(datos: FormData) {
  const id = String(datos.get("id") ?? "");
  const productoId = String(datos.get("producto_id") ?? "");
  if (!id) return;

  const supabase = await crearClienteServidor();
  await supabase.from("producto_campos").delete().eq("id", id);
  revalidatePath(`/admin/productos/${productoId}`);
}

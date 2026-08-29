import { crearClientePublico } from "@/lib/supabase/publico";

/** Los campos que necesita una tarjeta de catálogo, y ninguno más. */
const CAMPOS_TARJETA =
  "id, slug, nombre, resumen, precio, precio_antes, stock, edad_min, edad_max, destacado, producto_imagenes(url, alt, orden)";

export type ProductoTarjeta = {
  id: string;
  slug: string;
  nombre: string;
  resumen: string | null;
  precio: number;
  precio_antes: number | null;
  stock: "disponible" | "por_encargo" | "agotado";
  edad_min: number | null;
  edad_max: number | null;
  destacado: boolean;
  producto_imagenes: { url: string; alt: string; orden: number }[];
};

export async function obtenerCategorias() {
  const supabase = crearClientePublico();
  const { data } = await supabase
    .from("categorias")
    .select("id, slug, nombre, descripcion")
    .order("orden");
  return data ?? [];
}

export async function obtenerProductos({
  categoria,
  edad,
}: {
  categoria?: string;
  edad?: number;
} = {}) {
  const supabase = crearClientePublico();

  let consulta = supabase
    .from("productos")
    .select(`${CAMPOS_TARJETA}, categorias!inner(slug)`)
    .eq("estado", "activo")
    .order("orden")
    .order("creado_en", { ascending: false });

  if (categoria) consulta = consulta.eq("categorias.slug", categoria);

  const { data } = await consulta;
  if (!data) return [];

  // El filtro por edad se aplica en memoria: son pocos productos y la consulta
  // en SQL exigiría manejar los nulos de edad_min/edad_max con condiciones
  // anidadas que hacen la consulta ilegible.
  const productos = data as unknown as ProductoTarjeta[];
  if (edad === undefined) return productos;

  return productos.filter(
    (p) =>
      (p.edad_min === null || p.edad_min <= edad) &&
      (p.edad_max === null || p.edad_max >= edad),
  );
}

export async function obtenerDestacados(limite = 3) {
  const supabase = crearClientePublico();
  const { data } = await supabase
    .from("productos")
    .select(CAMPOS_TARJETA)
    .eq("estado", "activo")
    .eq("destacado", true)
    .order("orden")
    .limit(limite);
  return (data ?? []) as unknown as ProductoTarjeta[];
}

export async function obtenerProducto(slug: string) {
  const supabase = crearClientePublico();
  const { data } = await supabase
    .from("productos")
    .select(
      "*, categorias(slug, nombre), producto_imagenes(id, url, alt, orden), producto_campos(id, etiqueta, ayuda, tipo, opciones, requerido, max_largo, orden)",
    )
    .eq("slug", slug)
    .eq("estado", "activo")
    .maybeSingle();

  if (!data) return null;

  return {
    ...data,
    producto_imagenes: [...data.producto_imagenes].sort((a, b) => a.orden - b.orden),
    producto_campos: [...data.producto_campos].sort((a, b) => a.orden - b.orden),
  };
}

export async function obtenerSlugsDeProductos() {
  const supabase = crearClientePublico();
  const { data } = await supabase
    .from("productos")
    .select("slug, actualizado_en")
    .eq("estado", "activo");
  return data ?? [];
}

/** Portada del producto, o null si todavía no tiene fotos. */
export function portadaDe(producto: ProductoTarjeta) {
  return [...producto.producto_imagenes].sort((a, b) => a.orden - b.orden)[0] ?? null;
}

/** «1 a 6 años», «desde 3 años», «hasta 2 años» o null. */
export function rangoEdad(min: number | null, max: number | null) {
  if (min !== null && max !== null) return `${min} a ${max} años`;
  if (min !== null) return `Desde ${min} años`;
  if (max !== null) return `Hasta ${max} años`;
  return null;
}

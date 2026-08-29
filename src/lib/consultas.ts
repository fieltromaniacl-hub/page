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
  edadHasta,
}: {
  categoria?: string;
  /** Edad exacta, o inicio del rango si viene `edadHasta`. */
  edad?: number;
  edadHasta?: number;
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

  // Se busca *solape* entre el rango del producto y el rango pedido, no que el
  // producto contenga una edad puntual. Con una etapa de «5 a 7 años», un libro
  // para 6-7 tiene que aparecer, y con la comprobación puntual no aparecía.
  const desde = edad;
  const hasta = edadHasta ?? edad;

  return productos.filter(
    (p) =>
      (p.edad_max === null || p.edad_max >= desde) &&
      (p.edad_min === null || p.edad_min <= hasta),
  );
}

/**
 * Productos para la portada.
 *
 * Los marcados como destacados van primero; si no alcanzan para llenar el
 * espacio, se completa con los más recientes. Así la casilla «Mostrar en la
 * portada» del panel *prioriza* en vez de ser el único camino: una tienda con
 * productos nunca muestra una portada vacía por haber olvidado marcarlos.
 */
export async function obtenerDestacados(limite = 3) {
  const supabase = crearClientePublico();
  const { data } = await supabase
    .from("productos")
    .select(CAMPOS_TARJETA)
    .eq("estado", "activo")
    .order("destacado", { ascending: false })
    .order("orden")
    .order("creado_en", { ascending: false })
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

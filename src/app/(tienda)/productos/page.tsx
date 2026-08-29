import type { Metadata } from "next";
import Link from "next/link";

import { TarjetaProducto } from "@/components/tienda/tarjeta-producto";
import { obtenerCategorias, obtenerProductos } from "@/lib/consultas";
import { cn } from "@/lib/utils";

// Se regenera cada cinco minutos: cambiar un precio en el panel se refleja
// solo, sin tener que desplegar de nuevo.
export const revalidate = 300;

export const metadata: Metadata = {
  title: "Catálogo",
  description:
    "Libros de fieltro, letreros, sujeta cortinas y recuerdos hechos a mano en Chile. Personalizados para niños de 1 a 7 años.",
  alternates: { canonical: "/productos" },
};

const EDADES = [
  { valor: "1", texto: "1 año" },
  { valor: "2", texto: "2 años" },
  { valor: "3", texto: "3 años" },
  { valor: "4", texto: "4 años" },
  { valor: "5", texto: "5 años" },
  { valor: "6", texto: "6 años" },
  { valor: "7", texto: "7 años" },
];

function enlaceCon(
  base: { categoria?: string; edad?: string },
  cambio: { categoria?: string | null; edad?: string | null },
) {
  const params = new URLSearchParams();
  const categoria = cambio.categoria === null ? undefined : (cambio.categoria ?? base.categoria);
  const edad = cambio.edad === null ? undefined : (cambio.edad ?? base.edad);
  if (categoria) params.set("categoria", categoria);
  if (edad) params.set("edad", edad);
  const cadena = params.toString();
  return cadena ? `/productos?${cadena}` : "/productos";
}

const clasePildora = (activo: boolean) =>
  cn(
    "inline-flex min-h-11 items-center rounded-pill border-2 border-line px-4 font-display text-sm font-bold transition-[background-color,translate,box-shadow] duration-200 ease-[var(--ease-salida)]",
    activo
      ? "bg-violeta text-[oklch(0.17_0.022_292)]"
      : "bg-surface text-ink hover:-translate-y-0.5 hover:bg-violeta-tenue hover:shadow-solida motion-reduce:hover:translate-y-0",
  );

export default async function Catalogo({
  searchParams,
}: PageProps<"/productos">) {
  const params = await searchParams;
  const categoria = typeof params.categoria === "string" ? params.categoria : undefined;
  const edadTexto = typeof params.edad === "string" ? params.edad : undefined;

  // `edad` acepta una edad suelta («3») o un rango («1-2»), que es lo que
  // enlazan las tarjetas de etapa de la portada.
  const [desdeTexto, hastaTexto] = (edadTexto ?? "").split("-");
  const desde = Number(desdeTexto);
  const hasta = hastaTexto === undefined ? desde : Number(hastaTexto);
  const rangoValido = Number.isFinite(desde) && Number.isFinite(hasta);

  const [categorias, productos] = await Promise.all([
    obtenerCategorias(),
    obtenerProductos({
      categoria,
      edad: rangoValido ? desde : undefined,
      edadHasta: rangoValido ? hasta : undefined,
    }),
  ]);

  const actual = { categoria, edad: edadTexto };
  const categoriaActiva = categorias.find((c) => c.slug === categoria);
  const hayFiltros = Boolean(categoria || edadTexto);

  return (
    <div className="mx-auto max-w-[76rem] px-4 py-10 sm:px-6 lg:py-14">
      <h1 className="text-[length:var(--text-titulo)] leading-[1.05]">
        {categoriaActiva ? categoriaActiva.nombre : "Todo lo que hacemos"}
      </h1>
      <p className="mt-3 max-w-[60ch] text-ink-muted">
        {categoriaActiva?.descripcion ??
          "Cada pieza se corta y se cose a mano. La mayoría se hace a pedido, así que puedes elegir colores y personalizarla."}
      </p>

      <div className="mt-8 grid gap-4">
        <nav aria-label="Filtrar por categoría">
          <ul className="flex flex-wrap gap-2">
            <li>
              <Link
                href={enlaceCon(actual, { categoria: null })}
                aria-current={!categoria ? "page" : undefined}
                className={clasePildora(!categoria)}
              >
                Todo
              </Link>
            </li>
            {categorias.map((c) => (
              <li key={c.slug}>
                <Link
                  href={enlaceCon(actual, { categoria: c.slug })}
                  aria-current={categoria === c.slug ? "page" : undefined}
                  className={clasePildora(categoria === c.slug)}
                >
                  {c.nombre}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-label="Filtrar por edad">
          <ul className="flex flex-wrap gap-2">
            <li>
              <Link
                href={enlaceCon(actual, { edad: null })}
                aria-current={!edadTexto ? "page" : undefined}
                className={clasePildora(!edadTexto)}
              >
                Cualquier edad
              </Link>
            </li>
            {EDADES.map((e) => (
              <li key={e.valor}>
                <Link
                  href={enlaceCon(actual, { edad: e.valor })}
                  aria-current={edadTexto === e.valor ? "page" : undefined}
                  className={clasePildora(edadTexto === e.valor)}
                >
                  {e.texto}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      <p aria-live="polite" className="mt-6 text-sm text-ink-muted">
        {productos.length === 1
          ? "1 producto"
          : `${productos.length} productos`}
      </p>

      {productos.length ? (
        <ul className="mt-4 grid gap-6 [grid-template-columns:repeat(auto-fit,minmax(min(280px,100%),1fr))]">
          {productos.map((producto, i) => (
            <li key={producto.id}>
              <TarjetaProducto producto={producto} prioridad={i < 3} />
            </li>
          ))}
        </ul>
      ) : (
        <div className="mt-4 rounded-card border-[3px] border-dashed border-line-soft px-6 py-16 text-center">
          <h2 className="font-display text-lg font-bold">
            {hayFiltros
              ? "No hay nada con esos filtros"
              : "Todavía no hay productos publicados"}
          </h2>
          <p className="mx-auto mt-2 max-w-md text-ink-muted">
            {hayFiltros
              ? "Prueba con otra edad o mira todo el catálogo."
              : "Estamos preparando el catálogo. Escríbenos por Facebook o Instagram y te contamos qué tenemos disponible."}
          </p>
          {hayFiltros ? (
            <Link
              href="/productos"
              className="mt-6 inline-flex min-h-12 items-center rounded-control border-2 border-line bg-naranja px-5 font-display font-bold text-[oklch(0.17_0.022_292)]"
            >
              Ver todo el catálogo
            </Link>
          ) : null}
        </div>
      )}
    </div>
  );
}

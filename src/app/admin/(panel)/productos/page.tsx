import { ImageOff, Package, Plus } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { botonPanelVariants } from "@/components/panel/boton-panel";
import { InsigniaEstado, InsigniaStock } from "@/components/panel/insignias";
import { crearClienteServidor } from "@/lib/supabase/servidor";
import { cn, formatearPrecio } from "@/lib/utils";

export const metadata = { title: "Productos" };

const FILTROS = [
  { valor: "todos", texto: "Todos" },
  { valor: "activo", texto: "Publicados" },
  { valor: "inactivo", texto: "Sin publicar" },
  { valor: "archivado", texto: "Archivados" },
] as const;

export default async function ListaProductos({
  searchParams,
}: PageProps<"/admin/productos">) {
  const { estado } = await searchParams;
  const filtro = typeof estado === "string" ? estado : "todos";

  const supabase = await crearClienteServidor();

  let consulta = supabase
    .from("productos")
    .select(
      "id, nombre, slug, precio, estado, stock, destacado, categorias(nombre), producto_imagenes(url, alt, orden)",
    )
    .order("orden")
    .order("creado_en", { ascending: false });

  if (filtro !== "todos") {
    consulta = consulta.eq("estado", filtro as "activo" | "inactivo" | "archivado");
  } else {
    // La vista por defecto no muestra el archivo: es un depósito, no el catálogo.
    consulta = consulta.neq("estado", "archivado");
  }

  const { data: productos, error } = await consulta;

  return (
    <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-xl font-bold tracking-tight">Productos</h1>
        <Link
          href="/admin/productos/nuevo"
          className={cn(botonPanelVariants(), "gap-1.5")}
        >
          <Plus className="size-4" aria-hidden="true" />
          Nuevo producto
        </Link>
      </div>

      <nav aria-label="Filtrar por estado" className="mt-5">
        <ul className="flex flex-wrap gap-2">
          {FILTROS.map((f) => {
            const activo = filtro === f.valor;
            return (
              <li key={f.valor}>
                <Link
                  href={
                    f.valor === "todos"
                      ? "/admin/productos"
                      : `/admin/productos?estado=${f.valor}`
                  }
                  aria-current={activo ? "page" : undefined}
                  className={cn(
                    "inline-flex min-h-9 items-center rounded-pill px-3 text-sm font-medium transition-colors duration-150",
                    activo
                      ? "bg-violeta text-[oklch(0.17_0.022_292)]"
                      : "border border-line-soft text-ink-muted hover:border-ink-muted hover:text-ink",
                  )}
                >
                  {f.texto}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {error ? (
        <p role="alert" className="mt-6 rounded-card border border-alerta/40 bg-alerta-tenue p-4 text-sm">
          No se pudieron cargar los productos: {error.message}
        </p>
      ) : !productos?.length ? (
        <div className="mt-6 rounded-card border border-line-soft bg-surface p-10 text-center">
          <Package className="mx-auto size-8 text-ink-muted" strokeWidth={1.75} aria-hidden="true" />
          <h2 className="mt-3 text-base font-bold">
            {filtro === "todos"
              ? "Todavía no hay productos"
              : "Ningún producto en este estado"}
          </h2>
          <p className="mx-auto mt-2 max-w-md text-sm text-ink-muted">
            {filtro === "todos"
              ? "Carga el primero con su nombre, precio y fotos. Puedes dejarlo sin publicar mientras lo preparas."
              : "Prueba con otro filtro."}
          </p>
          {filtro === "todos" ? (
            <Link href="/admin/productos/nuevo" className={cn(botonPanelVariants({ tamano: "lg" }), "mt-5")}>
              Cargar el primer producto
            </Link>
          ) : null}
        </div>
      ) : (
        <ul className="mt-6 divide-y divide-line-soft overflow-hidden rounded-card border border-line-soft bg-surface">
          {productos.map((producto) => {
            const portada = [...(producto.producto_imagenes ?? [])].sort(
              (a, b) => a.orden - b.orden,
            )[0];

            return (
              <li key={producto.id}>
                <Link
                  href={`/admin/productos/${producto.id}`}
                  className="flex items-center gap-4 p-3 transition-colors hover:bg-surface-2"
                >
                  <span className="grid size-14 shrink-0 place-items-center overflow-hidden rounded-control border border-line-soft bg-surface-2">
                    {portada ? (
                      <Image
                        src={portada.url}
                        alt=""
                        width={56}
                        height={56}
                        className="size-full object-cover"
                      />
                    ) : (
                      <ImageOff className="size-5 text-ink-muted" aria-hidden="true" />
                    )}
                  </span>

                  <span className="min-w-0 flex-1">
                    <span className="block truncate font-semibold">
                      {producto.nombre}
                      {producto.destacado ? (
                        <span className="ml-2 text-xs font-medium text-naranja-txt">
                          Destacado
                        </span>
                      ) : null}
                    </span>
                    <span className="block truncate text-sm text-ink-muted">
                      {producto.categorias?.nombre ?? "Sin categoría"}
                    </span>
                  </span>

                  <span className="hidden shrink-0 gap-2 sm:flex">
                    <InsigniaEstado estado={producto.estado} />
                    <InsigniaStock stock={producto.stock} />
                  </span>

                  <span className="shrink-0 font-semibold tabular-nums">
                    {formatearPrecio(producto.precio)}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </main>
  );
}

import { ImageOff } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { InsigniaDisponibilidad } from "@/components/tienda/insignias";
import { portadaDe, rangoEdad, type ProductoTarjeta } from "@/lib/consultas";
import { formatearPrecio } from "@/lib/utils";

export function TarjetaProducto({
  producto,
  prioridad = false,
}: {
  producto: ProductoTarjeta;
  prioridad?: boolean;
}) {
  const portada = portadaDe(producto);
  const edad = rangoEdad(producto.edad_min, producto.edad_max);

  return (
    <article className="group h-full">
      <Link
        href={`/productos/${producto.slug}`}
        className="flex h-full flex-col overflow-hidden rounded-card border-[3px] border-line bg-surface transition-[translate,box-shadow] duration-200 ease-[var(--ease-salida)] hover:-translate-x-1 hover:-translate-y-1 hover:shadow-solida-lg motion-reduce:hover:translate-x-0 motion-reduce:hover:translate-y-0"
      >
        <div className="relative aspect-square border-b-[3px] border-line bg-surface-2">
          {portada ? (
            <Image
              src={portada.url}
              alt={portada.alt || producto.nombre}
              fill
              sizes="(min-width: 1024px) 22rem, (min-width: 640px) 45vw, 90vw"
              priority={prioridad}
              className="object-cover"
            />
          ) : (
            <span className="grid size-full place-items-center text-ink-muted">
              <ImageOff className="size-8" aria-hidden="true" />
            </span>
          )}

          {producto.stock === "agotado" ? (
            <span className="absolute inset-0 grid place-items-center bg-bg/70">
              <span className="rounded-pill border-2 border-line bg-surface px-4 py-1 font-display font-bold">
                Agotado
              </span>
            </span>
          ) : null}
        </div>

        <div className="flex flex-1 flex-col p-4">
          {edad ? (
            <p className="font-display text-sm font-bold text-violeta-txt">{edad}</p>
          ) : null}

          <h3 className="mt-1 font-display text-lg font-bold leading-tight tracking-tight text-ink [overflow-wrap:break-word]">
            {producto.nombre}
          </h3>

          {producto.resumen ? (
            <p className="mt-1.5 line-clamp-2 text-sm text-ink-muted">
              {producto.resumen}
            </p>
          ) : null}

          <div className="mt-auto flex flex-wrap items-baseline gap-x-2 gap-y-1 pt-4">
            <p className="font-display text-xl font-extrabold tabular-nums text-ink">
              {formatearPrecio(producto.precio)}
            </p>
            {producto.precio_antes ? (
              <p className="text-sm text-ink-muted line-through tabular-nums">
                {formatearPrecio(producto.precio_antes)}
              </p>
            ) : null}
          </div>

          <div className="mt-3 flex flex-wrap gap-1.5">
            {/* Un producto con componentes es un pack: conviene decirlo en la
                tarjeta, porque explica por qué cuesta más que sus vecinos. */}
            {producto.producto_incluye?.length ? (
              <span className="inline-flex items-center rounded-pill border-2 border-line bg-naranja-tenue px-3 py-0.5 font-display text-xs font-bold whitespace-nowrap text-naranja-txt">
                Pack de {producto.producto_incluye.length}
              </span>
            ) : null}
            <InsigniaDisponibilidad stock={producto.stock} />
          </div>
        </div>
      </Link>
    </article>
  );
}

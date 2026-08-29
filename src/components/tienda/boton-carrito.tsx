"use client";

import { ShoppingBag } from "lucide-react";
import Link from "next/link";

import { totalItems, usarCarrito } from "@/lib/carrito/tienda";

export function BotonCarrito() {
  const items = usarCarrito((e) => e.items);
  const total = totalItems(items);

  return (
    <Link
      href="/carrito"
      className="relative grid size-11 shrink-0 place-items-center rounded-pill border-2 border-line bg-surface text-ink transition-[background-color,box-shadow,translate] duration-200 ease-[var(--ease-salida)] hover:-translate-y-0.5 hover:bg-naranja-tenue hover:shadow-solida motion-reduce:hover:translate-y-0"
    >
      <ShoppingBag className="size-5" strokeWidth={2.5} aria-hidden="true" />
      <span className="sr-only">
        {total === 0
          ? "Tu pedido está vacío"
          : total === 1
            ? "Ver tu pedido, 1 producto"
            : `Ver tu pedido, ${total} productos`}
      </span>
      {total > 0 ? (
        <span
          aria-hidden="true"
          className="absolute -right-1.5 -top-1.5 grid min-w-6 place-items-center rounded-pill border-2 border-line bg-naranja px-1 font-display text-xs font-extrabold tabular-nums text-[oklch(0.17_0.022_292)]"
        >
          {total}
        </span>
      ) : null}
    </Link>
  );
}

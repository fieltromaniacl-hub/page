"use client";

import { Menu, ShoppingBag, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import { LogoConNombre } from "@/components/marca/logo";
import { ThemeToggle } from "@/components/theme-toggle";
import { cn } from "@/lib/utils";

const NAVEGACION = [
  { href: "/libros", texto: "Libros personalizados" },
  { href: "/productos", texto: "Catálogo" },
  { href: "/como-funciona", texto: "Cómo funciona" },
  { href: "/nosotros", texto: "Quiénes somos" },
];

export function Encabezado() {
  const [abierto, setAbierto] = useState(false);

  return (
    <header className="sticky top-0 z-[var(--z-sticky)] border-b-[3px] border-line bg-bg/95 backdrop-blur-sm">
      <div className="mx-auto flex max-w-[76rem] items-center gap-4 px-4 py-3 sm:px-6">
        <Link
          href="/"
          className="rounded-control"
          aria-label="Fieltromanía, ir al inicio"
        >
          <LogoConNombre />
        </Link>

        <nav aria-label="Principal" className="ml-auto hidden lg:block">
          <ul className="flex items-center gap-1">
            {NAVEGACION.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="inline-flex min-h-11 items-center rounded-control px-3 font-medium text-ink transition-colors duration-150 hover:bg-violeta-tenue hover:text-violeta-txt"
                >
                  {item.texto}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className={cn("flex items-center gap-2", "lg:ml-0 ml-auto")}>
          <ThemeToggle />

          <Link
            href="/carrito"
            aria-label="Ver carrito de compra"
            className="relative grid size-11 shrink-0 place-items-center rounded-pill border-2 border-line bg-surface text-ink transition-[background-color,box-shadow,translate] duration-200 ease-[var(--ease-salida)] hover:-translate-y-0.5 hover:bg-naranja-tenue hover:shadow-solida motion-reduce:hover:translate-y-0"
          >
            <ShoppingBag className="size-5" strokeWidth={2.5} aria-hidden="true" />
          </Link>

          <button
            type="button"
            onClick={() => setAbierto((v) => !v)}
            aria-expanded={abierto}
            aria-controls="menu-movil"
            aria-label={abierto ? "Cerrar menú" : "Abrir menú"}
            className="grid size-11 shrink-0 place-items-center rounded-pill border-2 border-line bg-surface text-ink lg:hidden"
          >
            {abierto ? (
              <X className="size-5" strokeWidth={2.5} aria-hidden="true" />
            ) : (
              <Menu className="size-5" strokeWidth={2.5} aria-hidden="true" />
            )}
          </button>
        </div>
      </div>

      {abierto ? (
        <nav
          id="menu-movil"
          aria-label="Principal, móvil"
          className="border-t-[3px] border-line bg-surface lg:hidden"
        >
          <ul className="mx-auto max-w-[76rem] px-4 py-2 sm:px-6">
            {NAVEGACION.map((item) => (
              <li key={item.href} className="border-b border-line-soft last:border-0">
                <Link
                  href={item.href}
                  onClick={() => setAbierto(false)}
                  className="flex min-h-14 items-center font-display text-lg font-bold tracking-tight text-ink"
                >
                  {item.texto}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      ) : null}
    </header>
  );
}

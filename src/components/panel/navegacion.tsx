"use client";

import {
  FileText,
  Megaphone,
  Home,
  LayoutDashboard,
  LogOut,
  Package,
  ShoppingBag,
  SlidersHorizontal,
  Store,
  Tags,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { Logo } from "@/components/marca/logo";
import { salir } from "@/lib/acciones/sesion";
import { cn } from "@/lib/utils";

const ENLACES = [
  { href: "/admin", texto: "Resumen", Icono: LayoutDashboard, exacto: true },
  { href: "/admin/pedidos", texto: "Pedidos", Icono: ShoppingBag },
  { href: "/admin/productos", texto: "Productos", Icono: Package },
  { href: "/admin/categorias", texto: "Categorías", Icono: Tags },
  { href: "/admin/portada", texto: "Portada", Icono: Home },
  { href: "/admin/avisos", texto: "Avisos", Icono: Megaphone },
  { href: "/admin/paginas", texto: "Páginas", Icono: FileText },
  { href: "/admin/ajustes", texto: "Textos", Icono: SlidersHorizontal },
];

export function NavegacionPanel({
  correo,
  nombre,
}: {
  correo: string;
  nombre?: string;
}) {
  const ruta = usePathname();

  return (
    <nav
      aria-label="Panel"
      className="flex flex-col gap-1 border-b border-line-soft bg-surface-2 p-3 lg:sticky lg:top-0 lg:h-dvh lg:border-b-0 lg:border-r"
    >
      <Link
        href="/admin"
        className="mb-2 flex items-center gap-2 rounded-control px-2 py-1.5"
      >
        <Logo className="h-8 w-auto shrink-0" />
        <span className="text-sm font-bold tracking-tight">Panel</span>
      </Link>

      <ul className="flex gap-1 overflow-x-auto lg:flex-col lg:overflow-visible">
        {ENLACES.map(({ href, texto, Icono, exacto }) => {
          const activo = exacto ? ruta === href : ruta.startsWith(href);
          return (
            <li key={href} className="shrink-0 lg:shrink">
              <Link
                href={href}
                aria-current={activo ? "page" : undefined}
                className={cn(
                  "flex min-h-11 items-center gap-2.5 rounded-control px-3 text-sm font-medium transition-colors duration-150",
                  activo
                    ? "bg-violeta-tenue text-violeta-txt"
                    : "text-ink-muted hover:bg-surface hover:text-ink",
                )}
              >
                <Icono className="size-4 shrink-0" aria-hidden="true" />
                {texto}
              </Link>
            </li>
          );
        })}
      </ul>

      <div className="mt-auto hidden gap-1 border-t border-line-soft pt-3 lg:grid">
        <Link
          href="/"
          className="flex min-h-11 items-center gap-2.5 rounded-control px-3 text-sm font-medium text-ink-muted transition-colors duration-150 hover:bg-surface hover:text-ink"
        >
          <Store className="size-4 shrink-0" aria-hidden="true" />
          Ver la tienda
        </Link>

        <form action={salir}>
          <button
            type="submit"
            className="flex min-h-11 w-full items-center gap-2.5 rounded-control px-3 text-left text-sm font-medium text-ink-muted transition-colors duration-150 hover:bg-surface hover:text-ink"
          >
            <LogOut className="size-4 shrink-0" aria-hidden="true" />
            Cerrar sesión
          </button>
        </form>

        <p className="truncate px-3 pt-1 text-xs text-ink-muted" title={correo}>
          {nombre ?? correo}
        </p>
      </div>
    </nav>
  );
}

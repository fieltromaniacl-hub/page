import Link from "next/link";

import { LogoConNombre } from "@/components/marca/logo";
import { EnlacesSociales } from "@/components/tienda/enlaces-sociales";

const COLUMNAS = [
  {
    titulo: "Tienda",
    enlaces: [
      { href: "/productos?categoria=libros-personalizados", texto: "Libros personalizados" },
      { href: "/productos", texto: "Catálogo completo" },
      { href: "/productos?categoria=letreros", texto: "Letreros" },
      { href: "/productos?categoria=recuerdos", texto: "Recuerdos para eventos" },
    ],
  },
  {
    titulo: "Ayuda",
    enlaces: [
      { href: "/como-funciona", texto: "Cómo funciona el pedido" },
      { href: "/envios", texto: "Envíos y plazos" },
      { href: "/cuidados", texto: "Cuidado de los productos" },
      { href: "/contacto", texto: "Contacto" },
    ],
  },
];

export function Pie() {
  return (
    <footer className="mt-auto border-t-[3px] border-line bg-surface-2">
      <div className="mx-auto max-w-[76rem] px-4 py-12 sm:px-6 lg:py-16">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div className="lg:col-span-2">
            <LogoConNombre />
            <p className="mt-4 max-w-sm text-ink-muted">
              Libros de fieltro hechos a mano en Chile, personalizados para niños
              de 1 a 7 años. Juegos educativos y sostenibles para cada etapa del
              desarrollo.
            </p>
            <EnlacesSociales className="mt-5" />

            <p className="mt-4 text-sm text-ink-muted">
              ¿Dudas sobre qué elegir?{" "}
              <a
                href="mailto:fieltromania.cl@gmail.com"
                className="font-semibold text-violeta-txt underline underline-offset-2"
              >
                fieltromania.cl@gmail.com
              </a>
            </p>
          </div>

          {COLUMNAS.map((columna) => (
            <nav key={columna.titulo} aria-label={columna.titulo}>
              <h2 className="font-display text-base font-bold tracking-tight text-ink">
                {columna.titulo}
              </h2>
              <ul className="mt-3 space-y-1">
                {columna.enlaces.map((enlace) => (
                  <li key={enlace.href}>
                    <Link
                      href={enlace.href}
                      className="inline-flex min-h-9 items-center text-ink-muted transition-colors hover:text-violeta-txt"
                    >
                      {enlace.texto}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div className="mt-12 flex flex-col gap-2 border-t-2 border-line-soft pt-6 text-sm text-ink-muted sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Fieltromanía · Hecho a mano en Chile</p>
          <p>Los precios se muestran en pesos chilenos.</p>
        </div>
      </div>
    </footer>
  );
}

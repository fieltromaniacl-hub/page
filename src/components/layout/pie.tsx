import Link from "next/link";

import { LogoConNombre } from "@/components/marca/logo";

const COLUMNAS = [
  {
    titulo: "Tienda",
    enlaces: [
      { href: "/libros", texto: "Libros personalizados" },
      { href: "/productos", texto: "Catálogo completo" },
      { href: "/productos/letreros", texto: "Letreros" },
      { href: "/productos/recuerdos", texto: "Recuerdos para eventos" },
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
            <div className="mt-5 flex flex-wrap gap-3">
              <a
                href="https://www.facebook.com/fieltromania.cl"
                target="_blank"
                rel="noreferrer"
                className="inline-flex min-h-11 items-center rounded-control border-2 border-line bg-surface px-4 font-medium text-ink transition-colors hover:bg-violeta-tenue"
              >
                Facebook
              </a>
              <a
                href="https://www.instagram.com/fieltromania_chile/"
                target="_blank"
                rel="noreferrer"
                className="inline-flex min-h-11 items-center rounded-control border-2 border-line bg-surface px-4 font-medium text-ink transition-colors hover:bg-violeta-tenue"
              >
                Instagram
              </a>
            </div>
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

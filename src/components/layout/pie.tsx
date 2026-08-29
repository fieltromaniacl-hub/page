import Link from "next/link";

import { LogoConNombre } from "@/components/marca/logo";
import { EnlacesSociales } from "@/components/tienda/enlaces-sociales";
import { obtenerAjustes } from "@/lib/contenido";
import { crearClientePublico } from "@/lib/supabase/publico";

const COLUMNA_TIENDA = {
  titulo: "Tienda",
  enlaces: [
    { href: "/productos?categoria=libros-personalizados", texto: "Libros personalizados" },
    { href: "/productos", texto: "Catálogo completo" },
    { href: "/productos?categoria=letreros", texto: "Letreros" },
    { href: "/productos?categoria=recuerdos", texto: "Recuerdos para eventos" },
  ],
};

/** Las que tienen ruta propia y por eso no salen de la tabla de páginas. */
const AYUDA_FIJA = [
  { href: "/como-funciona", texto: "Cómo funciona el pedido" },
  { href: "/contacto", texto: "Contacto" },
];

/**
 * Las páginas publicadas aparecen solas en el pie, en el orden que ella les
 * ponga en el panel. Antes la lista estaba escrita a mano aquí: crear una
 * página nueva no la enlazaba desde ninguna parte.
 */
async function enlacesDeAyuda() {
  try {
    const supabase = crearClientePublico();
    const { data } = await supabase
      .from("paginas")
      .select("slug, titulo")
      .eq("publicada", true)
      .order("orden");

    return [
      ...AYUDA_FIJA,
      ...(data ?? []).map((p) => ({ href: `/${p.slug}`, texto: p.titulo })),
    ];
  } catch {
    // Si la base no responde, el pie sigue mostrando lo que no depende de ella.
    return AYUDA_FIJA;
  }
}

export async function Pie() {
  const [ajustes, ayuda] = await Promise.all([obtenerAjustes(), enlacesDeAyuda()]);
  const columnas = [COLUMNA_TIENDA, { titulo: "Ayuda", enlaces: ayuda }];

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
                href={`mailto:${ajustes.contacto_email}`}
                className="font-semibold text-violeta-txt underline underline-offset-2"
              >
                {ajustes.contacto_email}
              </a>
            </p>
          </div>

          {columnas.map((columna) => (
            <nav key={columna.titulo} aria-label={columna.titulo}>
              <h2 className="font-display text-base font-bold tracking-tight text-ink">
                {columna.titulo}
              </h2>
              <ul className="mt-2">
                {columna.enlaces.map((enlace) => (
                  <li key={enlace.href}>
                    <Link
                      href={enlace.href}
                      className="inline-flex min-h-11 items-center text-ink-muted transition-colors hover:text-violeta-txt"
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

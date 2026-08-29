import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { Bloque, PaginaContenido } from "@/components/tienda/pagina-contenido";
import { obtenerPagina, obtenerSlugsDePaginas, parrafosDe } from "@/lib/contenido";

/**
 * Cualquier página de contenido que ella cree o edite desde el panel.
 *
 * Las rutas con archivo propio (`/productos`, `/carrito`, `/contacto`…) ganan
 * a este segmento dinámico, así que no hay riesgo de que una página nueva las
 * tape: si escribe el slug `productos`, el catálogo sigue mandando.
 */

export const revalidate = 300;

export async function generateStaticParams() {
  const paginas = await obtenerSlugsDePaginas();
  return paginas.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const pagina = await obtenerPagina(slug);

  if (!pagina) return { title: "Página no encontrada" };

  return {
    title: pagina.seo_titulo ?? pagina.titulo,
    description: pagina.seo_descripcion ?? pagina.bajada ?? undefined,
    alternates: { canonical: `/${pagina.slug}` },
    openGraph: {
      type: "article",
      title: pagina.seo_titulo ?? pagina.titulo,
      description: pagina.seo_descripcion ?? pagina.bajada ?? undefined,
      url: `/${pagina.slug}`,
    },
  };
}

export default async function Pagina({ params }: PageProps<"/[slug]">) {
  const { slug } = await params;
  const pagina = await obtenerPagina(slug);

  if (!pagina) notFound();

  return (
    <PaginaContenido titulo={pagina.titulo} bajada={pagina.bajada ?? undefined}>
      {pagina.bloques.map((bloque) =>
        bloque.titulo ? (
          <Bloque key={bloque.id} titulo={bloque.titulo}>
            {parrafosDe(bloque.cuerpo).map((parrafo, i) => (
              <p key={i}>{parrafo}</p>
            ))}
          </Bloque>
        ) : (
          <section key={bloque.id} className="grid gap-3 text-ink-muted">
            {parrafosDe(bloque.cuerpo).map((parrafo, i) => (
              <p key={i}>{parrafo}</p>
            ))}
          </section>
        ),
      )}
    </PaginaContenido>
  );
}

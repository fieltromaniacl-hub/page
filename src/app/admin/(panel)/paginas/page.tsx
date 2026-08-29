import { FileText, Lock, Plus } from "lucide-react";
import Link from "next/link";

import { botonPanelVariants } from "@/components/panel/boton-panel";
import { crearClienteServidor } from "@/lib/supabase/servidor";
import { cn } from "@/lib/utils";

export const metadata = { title: "Páginas" };
export const dynamic = "force-dynamic";

export default async function PaginasDelSitio() {
  const supabase = await crearClienteServidor();

  const { data: paginas } = await supabase
    .from("paginas")
    .select("id, titulo, slug, publicada, del_sistema, orden, pagina_bloques(id)")
    .order("orden");

  return (
    <main className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold tracking-tight">Páginas</h1>
          <p className="mt-1 text-sm text-ink-muted">
            Los textos largos del sitio: términos, envíos, cuidados y las que
            quieras agregar.
          </p>
        </div>

        <Link
          href="/admin/paginas/nueva"
          className={cn(botonPanelVariants(), "gap-1.5")}
        >
          <Plus className="size-4" aria-hidden="true" />
          Nueva página
        </Link>
      </div>

      <ul className="mt-6 divide-y divide-line-soft overflow-hidden rounded-card border border-line-soft bg-surface">
        {(paginas ?? []).map((pagina) => (
          <li key={pagina.id}>
            <Link
              href={`/admin/paginas/${pagina.id}`}
              className="flex min-h-11 flex-wrap items-center gap-3 p-4 transition-colors duration-150 hover:bg-surface-2"
            >
              <FileText
                className="size-4 shrink-0 text-ink-muted"
                aria-hidden="true"
              />

              <span className="min-w-0 flex-1">
                <span className="block font-semibold">{pagina.titulo}</span>
                <span className="block truncate text-sm text-ink-muted">
                  /{pagina.slug} ·{" "}
                  {pagina.pagina_bloques.length === 1
                    ? "1 sección"
                    : `${pagina.pagina_bloques.length} secciones`}
                </span>
              </span>

              {pagina.del_sistema ? (
                <span
                  className="inline-flex items-center gap-1 rounded-pill bg-surface-2 px-2.5 py-0.5 text-xs font-medium text-ink-muted"
                  title="La tienda enlaza esta página, así que no se puede borrar"
                >
                  <Lock className="size-3 shrink-0" aria-hidden="true" />
                  Fija
                </span>
              ) : null}

              <span
                className={
                  pagina.publicada
                    ? "rounded-pill bg-verde-tenue px-2.5 py-0.5 text-xs font-medium text-verde-txt"
                    : "rounded-pill bg-surface-2 px-2.5 py-0.5 text-xs font-medium text-ink-muted"
                }
              >
                {pagina.publicada ? "Publicada" : "Borrador"}
              </span>
            </Link>
          </li>
        ))}

        {!paginas?.length ? (
          <li className="p-8 text-center text-sm text-ink-muted">
            Todavía no hay páginas.
          </li>
        ) : null}
      </ul>
    </main>
  );
}

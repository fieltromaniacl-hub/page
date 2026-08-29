"use client";

import { ArrowDown, ArrowUp, Check, ExternalLink, Plus, Trash2 } from "lucide-react";
import Link from "next/link";
import { useActionState, useState } from "react";
import { useFormStatus } from "react-dom";

import { BotonPanel, botonPanelVariants } from "@/components/panel/boton-panel";
import { AreaTexto, Campo, Entrada } from "@/components/panel/campos";
import {
  eliminarBloque,
  eliminarPagina,
  guardarBloque,
  guardarPagina,
  moverBloque,
  type EstadoPagina,
} from "@/lib/acciones/paginas";
import { cn } from "@/lib/utils";

export type BloqueEditable = {
  id: string;
  titulo: string | null;
  cuerpo: string;
  orden: number;
};

export type PaginaEditable = {
  id: string;
  slug: string;
  titulo: string;
  bajada: string | null;
  seo_titulo: string | null;
  seo_descripcion: string | null;
  publicada: boolean;
  del_sistema: boolean;
  orden: number;
  bloques: BloqueEditable[];
};

function BotonGuardar({ texto = "Guardar" }: { texto?: string }) {
  const { pending } = useFormStatus();
  return (
    <BotonPanel type="submit" disabled={pending}>
      {pending ? "Guardando…" : texto}
    </BotonPanel>
  );
}

/** Una sección de la página: título opcional y cuerpo en párrafos. */
function Bloque({
  bloque,
  paginaId,
  slug,
  primero,
  ultimo,
}: {
  bloque: BloqueEditable;
  paginaId: string;
  slug: string;
  primero: boolean;
  ultimo: boolean;
}) {
  const [confirmando, setConfirmando] = useState(false);

  return (
    <li className="grid gap-3 rounded-card border border-line-soft bg-surface p-4">
      <form action={guardarBloque} className="grid gap-3">
        <input type="hidden" name="id" value={bloque.id} />
        <input type="hidden" name="pagina_id" value={paginaId} />
        <input type="hidden" name="slug" value={slug} />
        <input type="hidden" name="orden" value={bloque.orden} />

        <Campo
          htmlFor={`titulo-${bloque.id}`}
          etiqueta="Título de la sección"
          ayuda="Puede quedar vacío si solo quieres un párrafo suelto."
        >
          <Entrada
            id={`titulo-${bloque.id}`}
            name="titulo"
            defaultValue={bloque.titulo ?? ""}
            aria-describedby={`titulo-${bloque.id}-ayuda`}
          />
        </Campo>

        <Campo
          htmlFor={`cuerpo-${bloque.id}`}
          etiqueta="Texto"
          ayuda="Deja una línea en blanco entre párrafos. No hace falta ningún código."
        >
          <AreaTexto
            id={`cuerpo-${bloque.id}`}
            name="cuerpo"
            rows={6}
            defaultValue={bloque.cuerpo}
            aria-describedby={`cuerpo-${bloque.id}-ayuda`}
          />
        </Campo>

        <div className="flex flex-wrap items-center gap-2">
          <BotonGuardar texto="Guardar sección" />
        </div>
      </form>

      <div className="flex flex-wrap items-center gap-1 border-t border-line-soft pt-3">
        <form action={moverBloque} className="contents">
          <input type="hidden" name="id" value={bloque.id} />
          <input type="hidden" name="pagina_id" value={paginaId} />
          <input type="hidden" name="slug" value={slug} />
          <button
            type="submit"
            name="direccion"
            value="arriba"
            disabled={primero}
            aria-label="Subir esta sección"
            className={cn(botonPanelVariants({ variante: "fantasma", tamano: "md" }), "px-2")}
          >
            <ArrowUp className="size-4" aria-hidden="true" />
          </button>
          <button
            type="submit"
            name="direccion"
            value="abajo"
            disabled={ultimo}
            aria-label="Bajar esta sección"
            className={cn(botonPanelVariants({ variante: "fantasma", tamano: "md" }), "px-2")}
          >
            <ArrowDown className="size-4" aria-hidden="true" />
          </button>
        </form>

        <div className="ml-auto">
          {confirmando ? (
            <form action={eliminarBloque} className="flex items-center gap-1">
              <input type="hidden" name="id" value={bloque.id} />
              <input type="hidden" name="pagina_id" value={paginaId} />
              <input type="hidden" name="slug" value={slug} />
              <span className="text-sm text-ink-muted">¿Seguro?</span>
              <BotonPanel type="submit" variante="peligro" tamano="sm">
                Sí, borrar
              </BotonPanel>
              <BotonPanel
                type="button"
                variante="fantasma"
                tamano="sm"
                onClick={() => setConfirmando(false)}
              >
                No
              </BotonPanel>
            </form>
          ) : (
            <BotonPanel
              type="button"
              variante="fantasma"
              tamano="sm"
              onClick={() => setConfirmando(true)}
            >
              <Trash2 className="size-4" aria-hidden="true" />
              Borrar sección
            </BotonPanel>
          )}
        </div>
      </div>
    </li>
  );
}

export function EditorPagina({ pagina }: { pagina: PaginaEditable | null }) {
  const [estado, accion] = useActionState<EstadoPagina, FormData>(
    guardarPagina,
    {},
  );
  const [borrando, setBorrando] = useState(false);

  const err = estado.errores ?? {};
  const v = estado.valores;
  const esNueva = !pagina;

  return (
    <div className="grid gap-8">
      <form action={accion} className="grid gap-4">
        {pagina ? <input type="hidden" name="id" value={pagina.id} /> : null}
        <input
          type="hidden"
          name="del_sistema"
          value={String(pagina?.del_sistema ?? false)}
        />
        <input type="hidden" name="slug_original" value={pagina?.slug ?? ""} />

        {estado.error ? (
          <p
            role="alert"
            className="rounded-control border border-alerta bg-alerta-tenue px-4 py-3 text-sm font-medium"
          >
            {estado.error}
          </p>
        ) : null}

        {estado.guardado ? (
          <p
            role="status"
            className="inline-flex items-center gap-2 rounded-control border border-line-soft bg-verde-tenue px-4 py-3 text-sm font-medium text-verde-txt"
          >
            <Check className="size-4 shrink-0" aria-hidden="true" />
            Guardado.
          </p>
        ) : null}

        <Campo htmlFor="titulo" etiqueta="Título" requerido error={err.titulo}>
          <Entrada
            id="titulo"
            name="titulo"
            defaultValue={v?.titulo ?? pagina?.titulo ?? ""}
            aria-invalid={err.titulo ? true : undefined}
            aria-describedby={err.titulo ? "titulo-error" : undefined}
          />
        </Campo>

        <Campo
          htmlFor="bajada"
          etiqueta="Bajada"
          ayuda="El párrafo grande bajo el título. Opcional."
        >
          <AreaTexto
            id="bajada"
            name="bajada"
            rows={2}
            defaultValue={v?.bajada ?? pagina?.bajada ?? ""}
            aria-describedby="bajada-ayuda"
          />
        </Campo>

        <Campo
          htmlFor="slug"
          etiqueta="Dirección"
          ayuda={
            pagina?.del_sistema
              ? "Esta página la enlaza la tienda desde el pie, así que su dirección no se puede cambiar."
              : "Lo que va después del dominio. Si lo dejas vacío se arma con el título."
          }
          error={err.slug}
        >
          <Entrada
            id="slug"
            name="slug"
            defaultValue={v?.slug ?? pagina?.slug ?? ""}
            readOnly={pagina?.del_sistema}
            className={pagina?.del_sistema ? "opacity-60" : undefined}
            aria-invalid={err.slug ? true : undefined}
            aria-describedby={err.slug ? "slug-error" : "slug-ayuda"}
          />
        </Campo>

        <div className="grid gap-4 sm:grid-cols-2">
          <Campo
            htmlFor="seo_titulo"
            etiqueta="Título para buscadores"
            ayuda="Si lo dejas vacío se usa el título de arriba."
          >
            <Entrada
              id="seo_titulo"
              name="seo_titulo"
              defaultValue={v?.seo_titulo ?? pagina?.seo_titulo ?? ""}
              aria-describedby="seo_titulo-ayuda"
            />
          </Campo>

          <Campo
            htmlFor="orden"
            etiqueta="Orden en el pie"
            ayuda="Número menor, más arriba."
          >
            <Entrada
              id="orden"
              name="orden"
              type="number"
              defaultValue={String(pagina?.orden ?? 100)}
              aria-describedby="orden-ayuda"
            />
          </Campo>
        </div>

        <Campo
          htmlFor="seo_descripcion"
          etiqueta="Descripción para buscadores"
          ayuda="Las dos líneas que Google muestra bajo el título. Si la dejas vacía se usa la bajada."
        >
          <AreaTexto
            id="seo_descripcion"
            name="seo_descripcion"
            rows={2}
            defaultValue={v?.seo_descripcion ?? pagina?.seo_descripcion ?? ""}
            aria-describedby="seo_descripcion-ayuda"
          />
        </Campo>

        <label className="flex min-h-11 items-center gap-2.5 text-sm font-semibold">
          <input
            type="checkbox"
            name="publicada"
            defaultChecked={pagina?.publicada ?? true}
            className="size-4 rounded border-line-soft accent-violeta"
          />
          Visible en la tienda
        </label>

        <div className="flex flex-wrap items-center gap-3">
          <BotonGuardar texto={esNueva ? "Crear página" : "Guardar página"} />

          {pagina?.publicada ? (
            <Link
              href={`/${pagina.slug}`}
              target="_blank"
              className={cn(
                botonPanelVariants({ variante: "neutro" }),
                "gap-1.5",
              )}
            >
              Ver en la tienda
              <ExternalLink className="size-4" aria-hidden="true" />
            </Link>
          ) : null}
        </div>
      </form>

      {pagina ? (
        <section className="grid gap-4">
          <div className="flex flex-wrap items-end justify-between gap-3 border-t border-line-soft pt-6">
            <div>
              <h2 className="text-base font-bold tracking-tight">Secciones</h2>
              <p className="mt-1 text-sm text-ink-muted">
                Cada una es un bloque con su título y su texto. Se guardan por
                separado.
              </p>
            </div>

            <form action={guardarBloque}>
              <input type="hidden" name="pagina_id" value={pagina.id} />
              <input type="hidden" name="slug" value={pagina.slug} />
              <input type="hidden" name="cuerpo" value="" />
              <input
                type="hidden"
                name="orden"
                value={(pagina.bloques.length + 1) * 10}
              />
              <BotonPanel type="submit" variante="neutro">
                <Plus className="size-4" aria-hidden="true" />
                Agregar sección
              </BotonPanel>
            </form>
          </div>

          <ul className="grid gap-4">
            {pagina.bloques.map((bloque, i) => (
              <Bloque
                key={bloque.id}
                bloque={bloque}
                paginaId={pagina.id}
                slug={pagina.slug}
                primero={i === 0}
                ultimo={i === pagina.bloques.length - 1}
              />
            ))}
          </ul>

          {!pagina.bloques.length ? (
            <p className="rounded-card border border-dashed border-line-soft p-8 text-center text-sm text-ink-muted">
              Esta página todavía no tiene texto. Agrega la primera sección.
            </p>
          ) : null}

          {!pagina.del_sistema ? (
            <div className="mt-4 border-t border-line-soft pt-4">
              {borrando ? (
                <form action={eliminarPagina} className="flex flex-wrap items-center gap-2">
                  <input type="hidden" name="id" value={pagina.id} />
                  <span className="text-sm">
                    Se borra la página y todas sus secciones. No se puede deshacer.
                  </span>
                  <BotonPanel type="submit" variante="peligro" tamano="sm">
                    Sí, borrar
                  </BotonPanel>
                  <BotonPanel
                    type="button"
                    variante="fantasma"
                    tamano="sm"
                    onClick={() => setBorrando(false)}
                  >
                    Cancelar
                  </BotonPanel>
                </form>
              ) : (
                <BotonPanel
                  type="button"
                  variante="fantasma"
                  tamano="sm"
                  onClick={() => setBorrando(true)}
                >
                  <Trash2 className="size-4" aria-hidden="true" />
                  Borrar esta página
                </BotonPanel>
              )}
            </div>
          ) : null}
        </section>
      ) : null}
    </div>
  );
}

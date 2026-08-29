"use client";

import { Plus, Trash2, X } from "lucide-react";
import { useActionState, useState } from "react";
import { useFormStatus } from "react-dom";

import { BotonPanel } from "@/components/panel/boton-panel";
import { Campo, Entrada } from "@/components/panel/campos";
import {
  eliminarCategoria,
  guardarCategoria,
  type EstadoCategoria,
} from "@/lib/acciones/categorias";

type Categoria = {
  id: string;
  nombre: string;
  slug: string;
  descripcion: string | null;
  orden: number;
  productos: number;
};

function BotonGuardar() {
  const { pending } = useFormStatus();
  return (
    <BotonPanel type="submit" disabled={pending}>
      {pending ? "Guardando…" : "Guardar"}
    </BotonPanel>
  );
}

export function GestorCategorias({ categorias }: { categorias: Categoria[] }) {
  const [estado, accion] = useActionState<EstadoCategoria, FormData>(
    guardarCategoria,
    {},
  );
  const [abierto, setAbierto] = useState(false);
  const [editando, setEditando] = useState<Categoria | null>(null);

  return (
    <div className="grid gap-5">
      <ul className="divide-y divide-line-soft overflow-hidden rounded-card border border-line-soft bg-surface">
        {categorias.map((categoria) => (
          <li key={categoria.id} className="flex flex-wrap items-center gap-3 p-4">
            <button
              type="button"
              onClick={() => {
                setEditando(categoria);
                setAbierto(true);
              }}
              className="min-w-0 flex-1 text-left"
            >
              <span className="block font-semibold">{categoria.nombre}</span>
              <span className="block truncate text-sm text-ink-muted">
                /{categoria.slug} ·{" "}
                {categoria.productos === 1
                  ? "1 producto"
                  : `${categoria.productos} productos`}
              </span>
            </button>

            <form action={eliminarCategoria}>
              <input type="hidden" name="id" value={categoria.id} />
              <button
                type="submit"
                aria-label={`Eliminar ${categoria.nombre}`}
                className="grid size-9 place-items-center rounded-control text-ink-muted transition-colors hover:bg-alerta-tenue hover:text-alerta"
              >
                <Trash2 className="size-4" aria-hidden="true" />
              </button>
            </form>
          </li>
        ))}
      </ul>

      {abierto ? (
        <form
          key={editando?.id ?? "nueva"}
          action={accion}
          className="grid gap-4 rounded-card border border-line-soft bg-surface p-5"
        >
          {editando ? <input type="hidden" name="id" value={editando.id} /> : null}

          <div className="flex items-center justify-between gap-3">
            <h2 className="text-base font-bold tracking-tight">
              {editando ? `Editando «${editando.nombre}»` : "Nueva categoría"}
            </h2>
            <button
              type="button"
              onClick={() => {
                setAbierto(false);
                setEditando(null);
              }}
              aria-label="Cerrar"
              className="grid size-8 place-items-center rounded-control text-ink-muted hover:text-ink"
            >
              <X className="size-4" aria-hidden="true" />
            </button>
          </div>

          {estado.error ? (
            <p
              role="alert"
              className="rounded-control border border-alerta/40 bg-alerta-tenue px-3 py-2 text-sm font-medium"
            >
              {estado.error}
            </p>
          ) : null}

          <Campo etiqueta="Nombre" htmlFor="nombre" requerido>
            <Entrada
              id="nombre"
              name="nombre"
              defaultValue={editando?.nombre ?? ""}
              required
            />
          </Campo>

          <Campo
            etiqueta="Descripción"
            htmlFor="descripcion"
            ayuda="Aparece en la página de la categoría y ayuda en buscadores."
          >
            <Entrada
              id="descripcion"
              name="descripcion"
              defaultValue={editando?.descripcion ?? ""}
            />
          </Campo>

          <Campo etiqueta="Orden" htmlFor="orden" ayuda="Menor número, más arriba.">
            <Entrada
              id="orden"
              name="orden"
              type="number"
              step={1}
              defaultValue={editando?.orden ?? categorias.length + 1}
            />
          </Campo>

          <div className="flex justify-end">
            <BotonGuardar />
          </div>
        </form>
      ) : (
        <BotonPanel
          type="button"
          variante="neutro"
          onClick={() => {
            setEditando(null);
            setAbierto(true);
          }}
          className="justify-self-start gap-1.5"
        >
          <Plus className="size-4" aria-hidden="true" />
          Nueva categoría
        </BotonPanel>
      )}
    </div>
  );
}

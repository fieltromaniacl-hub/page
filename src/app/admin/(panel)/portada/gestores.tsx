"use client";

import { ArrowDown, ArrowUp, Check, Plus, Trash2, X } from "lucide-react";
import { useActionState, useState } from "react";
import { useFormStatus } from "react-dom";

import { BotonPanel } from "@/components/panel/boton-panel";
import { AreaTexto, Campo, Entrada, Seleccion } from "@/components/panel/campos";
import {
  eliminarEtapa,
  eliminarPaso,
  guardarEtapa,
  guardarPaso,
  moverEtapa,
  moverPaso,
  type EstadoPortada,
} from "@/lib/acciones/portada";
import { cn } from "@/lib/utils";
import { botonPanelVariants } from "@/components/panel/boton-panel";

export type Etapa = {
  id: string;
  edad: string;
  rango: string;
  titulo: string;
  texto: string;
  tono: "naranja" | "verde" | "violeta";
  orden: number;
  activa: boolean;
};

export type Paso = {
  id: string;
  titulo: string;
  texto: string;
  en_portada: boolean;
  orden: number;
};

const MUESTRA = {
  naranja: "bg-naranja",
  verde: "bg-verde",
  violeta: "bg-violeta",
} as const;

function BotonGuardar({ texto }: { texto: string }) {
  const { pending } = useFormStatus();
  return (
    <BotonPanel type="submit" disabled={pending}>
      {pending ? "Guardando…" : texto}
    </BotonPanel>
  );
}

function Aviso({ estado }: { estado: EstadoPortada }) {
  if (estado.error)
    return (
      <p
        role="alert"
        className="rounded-control border border-alerta bg-alerta-tenue px-4 py-3 text-sm font-medium"
      >
        {estado.error}
      </p>
    );
  if (estado.guardado)
    return (
      <p
        role="status"
        className="inline-flex items-center gap-2 rounded-control border border-line-soft bg-verde-tenue px-4 py-3 text-sm font-medium text-verde-txt"
      >
        <Check className="size-4 shrink-0" aria-hidden="true" />
        Guardado. Ya se ve en la tienda.
      </p>
    );
  return null;
}

/** Flechas de reordenar, compartidas por etapas y pasos. */
function Mover({
  accion,
  id,
  primero,
  ultimo,
  que,
}: {
  accion: (datos: FormData) => Promise<void>;
  id: string;
  primero: boolean;
  ultimo: boolean;
  que: string;
}) {
  return (
    <form action={accion} className="flex items-center gap-1">
      <input type="hidden" name="id" value={id} />
      <button
        type="submit"
        name="direccion"
        value="arriba"
        disabled={primero}
        aria-label={`Subir ${que}`}
        className={cn(botonPanelVariants({ variante: "fantasma" }), "px-2")}
      >
        <ArrowUp className="size-4" aria-hidden="true" />
      </button>
      <button
        type="submit"
        name="direccion"
        value="abajo"
        disabled={ultimo}
        aria-label={`Bajar ${que}`}
        className={cn(botonPanelVariants({ variante: "fantasma" }), "px-2")}
      >
        <ArrowDown className="size-4" aria-hidden="true" />
      </button>
    </form>
  );
}

// ─── Etapas ─────────────────────────────────────────────────────────────────

function FormularioEtapa({
  etapa,
  siguienteOrden,
  onCerrar,
}: {
  etapa: Etapa | null;
  siguienteOrden: number;
  onCerrar: () => void;
}) {
  const [estado, accion] = useActionState<EstadoPortada, FormData>(guardarEtapa, {});
  const err = estado.errores ?? {};
  const v = estado.valores;

  return (
    <form
      action={accion}
      className="grid gap-4 rounded-card border border-line-soft bg-surface p-4"
    >
      {etapa ? <input type="hidden" name="id" value={etapa.id} /> : null}
      <input type="hidden" name="orden" value={etapa?.orden ?? siguienteOrden} />

      <div className="flex items-center justify-between gap-3">
        <h3 className="text-sm font-bold tracking-tight">
          {etapa ? "Editar etapa" : "Nueva etapa"}
        </h3>
        <BotonPanel type="button" variante="fantasma" tamano="sm" onClick={onCerrar}>
          <X className="size-4" aria-hidden="true" />
          Cerrar
        </BotonPanel>
      </div>

      <Aviso estado={estado} />

      <div className="grid gap-4 sm:grid-cols-2">
        <Campo
          htmlFor="edad"
          etiqueta="Edad como se lee"
          requerido
          ayuda="Lo que aparece en la píldora: «3 a 4 años»."
          error={err.edad}
        >
          <Entrada
            id="edad"
            name="edad"
            defaultValue={v?.edad ?? etapa?.edad ?? ""}
            aria-invalid={err.edad ? true : undefined}
            aria-describedby={err.edad ? "edad-error" : "edad-ayuda"}
          />
        </Campo>

        <Campo
          htmlFor="rango"
          etiqueta="Rango para el catálogo"
          requerido
          ayuda="Solo números: «3», o «1-2» para un rango. Es lo que filtra el catálogo al pulsar la tarjeta."
          error={err.rango}
        >
          <Entrada
            id="rango"
            name="rango"
            placeholder="1-2"
            defaultValue={v?.rango ?? etapa?.rango ?? ""}
            aria-invalid={err.rango ? true : undefined}
            aria-describedby={err.rango ? "rango-error" : "rango-ayuda"}
          />
        </Campo>
      </div>

      <Campo htmlFor="titulo" etiqueta="Título" requerido error={err.titulo}>
        <Entrada
          id="titulo"
          name="titulo"
          defaultValue={v?.titulo ?? etapa?.titulo ?? ""}
          aria-invalid={err.titulo ? true : undefined}
          aria-describedby={err.titulo ? "titulo-error" : undefined}
        />
      </Campo>

      <Campo htmlFor="texto" etiqueta="Texto" requerido error={err.texto}>
        <AreaTexto
          id="texto"
          name="texto"
          rows={3}
          defaultValue={v?.texto ?? etapa?.texto ?? ""}
          aria-invalid={err.texto ? true : undefined}
          aria-describedby={err.texto ? "texto-error" : undefined}
        />
      </Campo>

      <div className="grid gap-4 sm:grid-cols-2">
        <Campo htmlFor="tono" etiqueta="Color de la tarjeta" error={err.tono}>
          <Seleccion
            id="tono"
            name="tono"
            defaultValue={v?.tono ?? etapa?.tono ?? "violeta"}
          >
            <option value="violeta">Morado</option>
            <option value="verde">Verde</option>
            <option value="naranja">Naranja</option>
          </Seleccion>
        </Campo>

        <label className="flex min-h-11 items-center gap-2.5 self-end text-sm font-semibold">
          <input
            type="checkbox"
            name="activa"
            defaultChecked={etapa?.activa ?? true}
            className="size-4 rounded border-line-soft accent-violeta"
          />
          Visible en la portada
        </label>
      </div>

      <div>
        <BotonGuardar texto="Guardar etapa" />
      </div>
    </form>
  );
}

export function GestorEtapas({ etapas }: { etapas: Etapa[] }) {
  const [abierto, setAbierto] = useState(false);
  const [editando, setEditando] = useState<Etapa | null>(null);
  const [confirmando, setConfirmando] = useState<string | null>(null);

  const siguienteOrden = (etapas.length + 1) * 10;

  return (
    <div className="grid gap-4">
      {abierto ? (
        <FormularioEtapa
          key={editando?.id ?? "nueva"}
          etapa={editando}
          siguienteOrden={siguienteOrden}
          onCerrar={() => {
            setAbierto(false);
            setEditando(null);
          }}
        />
      ) : (
        <div>
          <BotonPanel
            type="button"
            variante="neutro"
            onClick={() => {
              setEditando(null);
              setAbierto(true);
            }}
          >
            <Plus className="size-4" aria-hidden="true" />
            Nueva etapa
          </BotonPanel>
        </div>
      )}

      <ul className="divide-y divide-line-soft overflow-hidden rounded-card border border-line-soft bg-surface">
        {etapas.map((etapa, i) => (
          <li key={etapa.id} className="flex flex-wrap items-center gap-3 p-4">
            <span
              aria-hidden="true"
              className={`size-4 shrink-0 rounded-full border border-line-soft ${MUESTRA[etapa.tono]}`}
            />

            <button
              type="button"
              onClick={() => {
                setEditando(etapa);
                setAbierto(true);
              }}
              className="min-w-0 flex-1 text-left"
            >
              <span className="block font-semibold">
                {etapa.edad} · {etapa.titulo}
              </span>
              <span className="block truncate text-sm text-ink-muted">
                Filtra el catálogo por {etapa.rango} años
              </span>
            </button>

            {!etapa.activa ? (
              <span className="rounded-pill bg-surface-2 px-2.5 py-0.5 text-xs font-medium text-ink-muted">
                Oculta
              </span>
            ) : null}

            <Mover
              accion={moverEtapa}
              id={etapa.id}
              primero={i === 0}
              ultimo={i === etapas.length - 1}
              que={`la etapa ${etapa.edad}`}
            />

            {confirmando === etapa.id ? (
              <form action={eliminarEtapa} className="flex items-center gap-1">
                <input type="hidden" name="id" value={etapa.id} />
                <BotonPanel type="submit" variante="peligro" tamano="sm">
                  Sí, borrar
                </BotonPanel>
                <BotonPanel
                  type="button"
                  variante="fantasma"
                  tamano="sm"
                  onClick={() => setConfirmando(null)}
                >
                  No
                </BotonPanel>
              </form>
            ) : (
              <BotonPanel
                type="button"
                variante="fantasma"
                tamano="sm"
                aria-label={`Borrar la etapa ${etapa.edad}`}
                onClick={() => setConfirmando(etapa.id)}
              >
                <Trash2 className="size-4" aria-hidden="true" />
              </BotonPanel>
            )}
          </li>
        ))}

        {!etapas.length ? (
          <li className="p-6 text-center text-sm text-ink-muted">
            Sin etapas, la portada no muestra esa sección.
          </li>
        ) : null}
      </ul>
    </div>
  );
}

// ─── Pasos ──────────────────────────────────────────────────────────────────

function FormularioPaso({
  paso,
  siguienteOrden,
  onCerrar,
}: {
  paso: Paso | null;
  siguienteOrden: number;
  onCerrar: () => void;
}) {
  const [estado, accion] = useActionState<EstadoPortada, FormData>(guardarPaso, {});
  const err = estado.errores ?? {};
  const v = estado.valores;

  return (
    <form
      action={accion}
      className="grid gap-4 rounded-card border border-line-soft bg-surface p-4"
    >
      {paso ? <input type="hidden" name="id" value={paso.id} /> : null}
      <input type="hidden" name="orden" value={paso?.orden ?? siguienteOrden} />

      <div className="flex items-center justify-between gap-3">
        <h3 className="text-sm font-bold tracking-tight">
          {paso ? "Editar paso" : "Nuevo paso"}
        </h3>
        <BotonPanel type="button" variante="fantasma" tamano="sm" onClick={onCerrar}>
          <X className="size-4" aria-hidden="true" />
          Cerrar
        </BotonPanel>
      </div>

      <Aviso estado={estado} />

      <Campo htmlFor="paso-titulo" etiqueta="Título" requerido error={err.titulo}>
        <Entrada
          id="paso-titulo"
          name="titulo"
          defaultValue={v?.titulo ?? paso?.titulo ?? ""}
          aria-invalid={err.titulo ? true : undefined}
          aria-describedby={err.titulo ? "paso-titulo-error" : undefined}
        />
      </Campo>

      <Campo htmlFor="paso-texto" etiqueta="Texto" requerido error={err.texto}>
        <AreaTexto
          id="paso-texto"
          name="texto"
          rows={3}
          defaultValue={v?.texto ?? paso?.texto ?? ""}
          aria-invalid={err.texto ? true : undefined}
          aria-describedby={err.texto ? "paso-texto-error" : undefined}
        />
      </Campo>

      <label className="flex min-h-11 items-center gap-2.5 text-sm font-semibold">
        <input
          type="checkbox"
          name="en_portada"
          defaultChecked={paso?.en_portada ?? false}
          className="size-4 rounded border-line-soft accent-violeta"
        />
        Mostrar también en el resumen de la portada
      </label>

      <div>
        <BotonGuardar texto="Guardar paso" />
      </div>
    </form>
  );
}

export function GestorPasos({ pasos }: { pasos: Paso[] }) {
  const [abierto, setAbierto] = useState(false);
  const [editando, setEditando] = useState<Paso | null>(null);
  const [confirmando, setConfirmando] = useState<string | null>(null);

  const siguienteOrden = (pasos.length + 1) * 10;

  return (
    <div className="grid gap-4">
      {abierto ? (
        <FormularioPaso
          key={editando?.id ?? "nuevo"}
          paso={editando}
          siguienteOrden={siguienteOrden}
          onCerrar={() => {
            setAbierto(false);
            setEditando(null);
          }}
        />
      ) : (
        <div>
          <BotonPanel
            type="button"
            variante="neutro"
            onClick={() => {
              setEditando(null);
              setAbierto(true);
            }}
          >
            <Plus className="size-4" aria-hidden="true" />
            Nuevo paso
          </BotonPanel>
        </div>
      )}

      <ol className="divide-y divide-line-soft overflow-hidden rounded-card border border-line-soft bg-surface">
        {pasos.map((paso, i) => (
          <li key={paso.id} className="flex flex-wrap items-center gap-3 p-4">
            <span
              aria-hidden="true"
              className="grid size-7 shrink-0 place-items-center rounded-pill bg-surface-2 text-xs font-bold tabular-nums"
            >
              {i + 1}
            </span>

            <button
              type="button"
              onClick={() => {
                setEditando(paso);
                setAbierto(true);
              }}
              className="min-w-0 flex-1 text-left"
            >
              <span className="block font-semibold">{paso.titulo}</span>
              <span className="block truncate text-sm text-ink-muted">
                {paso.texto}
              </span>
            </button>

            {paso.en_portada ? (
              <span className="rounded-pill bg-violeta-tenue px-2.5 py-0.5 text-xs font-medium text-violeta-txt">
                También en la portada
              </span>
            ) : null}

            <Mover
              accion={moverPaso}
              id={paso.id}
              primero={i === 0}
              ultimo={i === pasos.length - 1}
              que={`el paso ${paso.titulo}`}
            />

            {confirmando === paso.id ? (
              <form action={eliminarPaso} className="flex items-center gap-1">
                <input type="hidden" name="id" value={paso.id} />
                <BotonPanel type="submit" variante="peligro" tamano="sm">
                  Sí, borrar
                </BotonPanel>
                <BotonPanel
                  type="button"
                  variante="fantasma"
                  tamano="sm"
                  onClick={() => setConfirmando(null)}
                >
                  No
                </BotonPanel>
              </form>
            ) : (
              <BotonPanel
                type="button"
                variante="fantasma"
                tamano="sm"
                aria-label={`Borrar el paso ${paso.titulo}`}
                onClick={() => setConfirmando(paso.id)}
              >
                <Trash2 className="size-4" aria-hidden="true" />
              </BotonPanel>
            )}
          </li>
        ))}
      </ol>
    </div>
  );
}

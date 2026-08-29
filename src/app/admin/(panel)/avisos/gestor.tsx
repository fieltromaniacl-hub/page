"use client";

import { Check, Eye, EyeOff, Plus, Trash2, X } from "lucide-react";
import { useActionState, useState } from "react";
import { useFormStatus } from "react-dom";

import { BotonPanel } from "@/components/panel/boton-panel";
import { AreaTexto, Campo, Entrada, Seleccion } from "@/components/panel/campos";
import {
  alternarAviso,
  eliminarAviso,
  guardarAviso,
  type EstadoAviso,
} from "@/lib/acciones/avisos";

export type Aviso = {
  id: string;
  texto: string;
  enlace_texto: string | null;
  enlace_href: string | null;
  desde: string | null;
  hasta: string | null;
  activo: boolean;
  tono: "naranja" | "verde" | "violeta";
};

const MUESTRA_DE_TONO = {
  naranja: "bg-naranja",
  verde: "bg-verde",
  violeta: "bg-violeta",
} as const;

/**
 * Estado real del aviso, que no es lo mismo que la casilla «encendido»: uno
 * encendido pero con fecha futura todavía no se ve, y uno vencido tampoco. El
 * panel lo dice con palabras para que ella no crea que algo falla.
 */
function estadoDe(aviso: Aviso, hoy: string) {
  if (!aviso.activo) return { texto: "Apagado", clase: "bg-surface-2 text-ink-muted" };
  if (aviso.desde && aviso.desde > hoy)
    return { texto: `Empieza el ${formatear(aviso.desde)}`, clase: "bg-violeta-tenue text-violeta-txt" };
  if (aviso.hasta && aviso.hasta < hoy)
    return { texto: `Terminó el ${formatear(aviso.hasta)}`, clase: "bg-surface-2 text-ink-muted" };
  return { texto: "Se está mostrando", clase: "bg-verde-tenue text-verde-txt" };
}

function formatear(fecha: string) {
  const [a, m, d] = fecha.split("-");
  return `${d}-${m}-${a}`;
}

function BotonGuardar() {
  const { pending } = useFormStatus();
  return (
    <BotonPanel type="submit" disabled={pending}>
      {pending ? "Guardando…" : "Guardar aviso"}
    </BotonPanel>
  );
}

function Formulario({
  aviso,
  onCerrar,
}: {
  aviso: Aviso | null;
  onCerrar: () => void;
}) {
  const [estado, accion] = useActionState<EstadoAviso, FormData>(guardarAviso, {});
  const err = estado.errores ?? {};
  const v = estado.valores;

  return (
    <form
      action={accion}
      className="grid gap-4 rounded-card border border-line-soft bg-surface p-4"
    >
      {aviso ? <input type="hidden" name="id" value={aviso.id} /> : null}

      <div className="flex items-center justify-between gap-3">
        <h2 className="text-base font-bold tracking-tight">
          {aviso ? "Editar aviso" : "Nuevo aviso"}
        </h2>
        <BotonPanel
          type="button"
          variante="fantasma"
          tamano="sm"
          onClick={onCerrar}
        >
          <X className="size-4" aria-hidden="true" />
          Cerrar
        </BotonPanel>
      </div>

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
          Guardado. Ya se ve en la tienda.
        </p>
      ) : null}

      <Campo
        htmlFor="texto"
        etiqueta="Texto del aviso"
        requerido
        ayuda="Corto, que quepa en una línea de teléfono. Por ejemplo: «15% en libros personalizados hasta el domingo»."
        error={err.texto}
      >
        <AreaTexto
          id="texto"
          name="texto"
          rows={2}
          maxLength={160}
          defaultValue={v?.texto ?? aviso?.texto ?? ""}
          aria-invalid={err.texto ? true : undefined}
          aria-describedby={err.texto ? "texto-error" : "texto-ayuda"}
        />
      </Campo>

      <div className="grid gap-4 sm:grid-cols-2">
        <Campo
          htmlFor="enlace_texto"
          etiqueta="Texto del enlace"
          ayuda="Opcional."
          error={err.enlace_texto}
        >
          <Entrada
            id="enlace_texto"
            name="enlace_texto"
            placeholder="Ver catálogo"
            defaultValue={v?.enlace_texto ?? aviso?.enlace_texto ?? ""}
            aria-invalid={err.enlace_texto ? true : undefined}
            aria-describedby={
              err.enlace_texto ? "enlace_texto-error" : "enlace_texto-ayuda"
            }
          />
        </Campo>

        <Campo
          htmlFor="enlace_href"
          etiqueta="A dónde lleva"
          ayuda="Una ruta del sitio, como /productos."
          error={err.enlace_href}
        >
          <Entrada
            id="enlace_href"
            name="enlace_href"
            placeholder="/productos"
            defaultValue={v?.enlace_href ?? aviso?.enlace_href ?? ""}
            aria-invalid={err.enlace_href ? true : undefined}
            aria-describedby={
              err.enlace_href ? "enlace_href-error" : "enlace_href-ayuda"
            }
          />
        </Campo>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Campo
          htmlFor="desde"
          etiqueta="Desde"
          ayuda="Vacío = ya."
          error={err.desde}
        >
          <Entrada
            id="desde"
            name="desde"
            type="date"
            defaultValue={v?.desde ?? aviso?.desde ?? ""}
            aria-describedby="desde-ayuda"
          />
        </Campo>

        <Campo
          htmlFor="hasta"
          etiqueta="Hasta"
          ayuda="Vacío = sin fin. Se apaga solo."
          error={err.hasta}
        >
          <Entrada
            id="hasta"
            name="hasta"
            type="date"
            defaultValue={v?.hasta ?? aviso?.hasta ?? ""}
            aria-invalid={err.hasta ? true : undefined}
            aria-describedby={err.hasta ? "hasta-error" : "hasta-ayuda"}
          />
        </Campo>

        <Campo htmlFor="tono" etiqueta="Color" ayuda="Naranja llama más." error={err.tono}>
          <Seleccion
            id="tono"
            name="tono"
            defaultValue={v?.tono ?? aviso?.tono ?? "naranja"}
            aria-describedby="tono-ayuda"
          >
            <option value="naranja">Naranja</option>
            <option value="verde">Verde</option>
            <option value="violeta">Morado</option>
          </Seleccion>
        </Campo>
      </div>

      <label className="flex min-h-11 items-center gap-2.5 text-sm font-semibold">
        <input
          type="checkbox"
          name="activo"
          defaultChecked={aviso?.activo ?? true}
          className="size-4 rounded border-line-soft accent-violeta"
        />
        Encendido
      </label>

      <div>
        <BotonGuardar />
      </div>
    </form>
  );
}

export function GestorAvisos({ avisos, hoy }: { avisos: Aviso[]; hoy: string }) {
  const [abierto, setAbierto] = useState(false);
  const [editando, setEditando] = useState<Aviso | null>(null);
  const [confirmando, setConfirmando] = useState<string | null>(null);

  function cerrar() {
    setAbierto(false);
    setEditando(null);
  }

  return (
    <div className="grid gap-5">
      {abierto ? (
        // La clave reinicia el formulario al cambiar de aviso: sin ella, React
        // reutilizaría los campos y mostraría los datos del anterior.
        <Formulario key={editando?.id ?? "nuevo"} aviso={editando} onCerrar={cerrar} />
      ) : (
        <div>
          <BotonPanel
            type="button"
            onClick={() => {
              setEditando(null);
              setAbierto(true);
            }}
          >
            <Plus className="size-4" aria-hidden="true" />
            Nuevo aviso
          </BotonPanel>
        </div>
      )}

      <ul className="divide-y divide-line-soft overflow-hidden rounded-card border border-line-soft bg-surface">
        {avisos.map((aviso) => {
          const estado = estadoDe(aviso, hoy);
          return (
            <li key={aviso.id} className="flex flex-wrap items-center gap-3 p-4">
              <span
                aria-hidden="true"
                className={`size-4 shrink-0 rounded-full border border-line-soft ${MUESTRA_DE_TONO[aviso.tono]}`}
              />

              <button
                type="button"
                onClick={() => {
                  setEditando(aviso);
                  setAbierto(true);
                }}
                className="min-w-0 flex-1 text-left"
              >
                <span className="block font-semibold">{aviso.texto}</span>
                <span className="block truncate text-sm text-ink-muted">
                  {aviso.desde ? `Desde ${formatear(aviso.desde)}` : "Sin fecha de inicio"}
                  {" · "}
                  {aviso.hasta ? `hasta ${formatear(aviso.hasta)}` : "sin fecha de término"}
                </span>
              </button>

              <span
                className={`rounded-pill px-2.5 py-0.5 text-xs font-medium ${estado.clase}`}
              >
                {estado.texto}
              </span>

              <form action={alternarAviso}>
                <input type="hidden" name="id" value={aviso.id} />
                <input type="hidden" name="activo" value={String(aviso.activo)} />
                <BotonPanel
                  type="submit"
                  variante="fantasma"
                  tamano="sm"
                  aria-label={aviso.activo ? "Apagar este aviso" : "Encender este aviso"}
                >
                  {aviso.activo ? (
                    <EyeOff className="size-4" aria-hidden="true" />
                  ) : (
                    <Eye className="size-4" aria-hidden="true" />
                  )}
                </BotonPanel>
              </form>

              {confirmando === aviso.id ? (
                <form action={eliminarAviso} className="flex items-center gap-1">
                  <input type="hidden" name="id" value={aviso.id} />
                  <BotonPanel type="submit" variante="peligro" tamano="sm">
                    <Check className="size-4" aria-hidden="true" />
                    Borrar
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
                  aria-label={`Borrar el aviso «${aviso.texto}»`}
                  onClick={() => setConfirmando(aviso.id)}
                >
                  <Trash2 className="size-4" aria-hidden="true" />
                </BotonPanel>
              )}
            </li>
          );
        })}

        {!avisos.length ? (
          <li className="p-8 text-center text-sm text-ink-muted">
            No hay avisos. Crea uno para anunciar una promoción o un plazo.
          </li>
        ) : null}
      </ul>
    </div>
  );
}

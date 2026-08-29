"use client";

import { Check, ShoppingBag } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import { usarCarrito } from "@/lib/carrito/tienda";
import { cn } from "@/lib/utils";

type TipoCampo = "texto" | "parrafo" | "opcion" | "color" | "numero";

export type CampoPersonalizacion = {
  id: string;
  etiqueta: string;
  ayuda: string | null;
  tipo: TipoCampo;
  opciones: string[];
  requerido: boolean;
  max_largo: number | null;
};

/** Muestras aproximadas para los nombres de color más habituales del taller.
 *  Si un color no está en la lista, se muestra solo el nombre. */
const MUESTRAS: Record<string, string> = {
  rosado: "#F2A0C0",
  rosa: "#F2A0C0",
  celeste: "#7CC6E8",
  azul: "#3F7FD0",
  verde: "#5CB85C",
  amarillo: "#F5C935",
  naranja: "#F08A2C",
  rojo: "#E4453A",
  morado: "#8B7BC8",
  lila: "#B8A8E0",
  blanco: "#FFFFFF",
  negro: "#1B1725",
  gris: "#9AA0A6",
  cafe: "#8B5E3C",
  café: "#8B5E3C",
  beige: "#E3D5C0",
  turquesa: "#3FBFB0",
  fucsia: "#E0479E",
};

const claseControl =
  "w-full min-h-12 rounded-control border-2 border-line bg-surface px-3 py-2 text-ink transition-shadow duration-150 placeholder:text-ink-muted focus:outline-none focus:ring-4 focus:ring-violeta/30 aria-[invalid=true]:border-alerta";

export function FormularioPersonalizacion({
  producto,
  campos,
}: {
  producto: {
    id: string;
    slug: string;
    nombre: string;
    precio: number;
    stock: "disponible" | "por_encargo" | "agotado";
    imagen: string | null;
  };
  campos: CampoPersonalizacion[];
}) {
  const agregar = usarCarrito((e) => e.agregar);

  const [respuestas, setRespuestas] = useState<Record<string, string>>({});
  const [errores, setErrores] = useState<Record<string, string>>({});
  const [cantidad, setCantidad] = useState(1);
  const [agregado, setAgregado] = useState(false);

  const agotado = producto.stock === "agotado";

  function responder(etiqueta: string, valor: string) {
    setRespuestas((r) => ({ ...r, [etiqueta]: valor }));
    setErrores((e) => {
      if (!e[etiqueta]) return e;
      const resto = { ...e };
      delete resto[etiqueta];
      return resto;
    });
    setAgregado(false);
  }

  function enviar(evento: React.FormEvent) {
    evento.preventDefault();

    const nuevos: Record<string, string> = {};
    for (const campo of campos) {
      const valor = (respuestas[campo.etiqueta] ?? "").trim();
      if (campo.requerido && !valor) {
        nuevos[campo.etiqueta] = "Necesitamos este dato para hacer tu pedido.";
      } else if (campo.max_largo && valor.length > campo.max_largo) {
        nuevos[campo.etiqueta] = `Máximo ${campo.max_largo} caracteres.`;
      }
    }

    if (Object.keys(nuevos).length) {
      setErrores(nuevos);
      // Lleva el foco al primer campo con problema.
      const primero = campos.find((c) => nuevos[c.etiqueta]);
      if (primero) document.getElementById(`campo-${primero.id}`)?.focus();
      return;
    }

    // Solo se guardan las respuestas con contenido: un campo opcional vacío no
    // debe aparecer en el correo del pedido.
    const limpias = Object.fromEntries(
      Object.entries(respuestas)
        .map(([k, v]) => [k, v.trim()])
        .filter(([, v]) => v !== ""),
    );

    agregar({
      productoId: producto.id,
      slug: producto.slug,
      nombre: producto.nombre,
      precio: producto.precio,
      imagen: producto.imagen,
      cantidad,
      personalizacion: limpias,
    });

    setAgregado(true);
  }

  if (agotado) {
    return (
      <div className="rounded-card border-[3px] border-line bg-surface-2 p-5">
        <p className="font-display font-bold">Este producto está agotado</p>
        <p className="mt-1 text-sm text-ink-muted">
          Escríbenos y te avisamos apenas volvamos a tenerlo.
        </p>
        <Link
          href="/contacto"
          className="mt-4 inline-flex min-h-12 items-center rounded-control border-2 border-line bg-surface px-5 font-display font-bold"
        >
          Escribirnos
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={enviar} className="grid gap-5" noValidate>
      {campos.length ? (
        <fieldset className="grid gap-5">
          <legend className="font-display text-lg font-bold tracking-tight">
            Personalízalo
          </legend>

          {campos.map((campo) => {
            const id = `campo-${campo.id}`;
            const error = errores[campo.etiqueta];
            const valor = respuestas[campo.etiqueta] ?? "";
            const descrito = [
              campo.ayuda ? `${id}-ayuda` : null,
              error ? `${id}-error` : null,
            ]
              .filter(Boolean)
              .join(" ");

            return (
              <div key={campo.id} className="grid gap-1.5">
                <label htmlFor={id} className="font-semibold">
                  {campo.etiqueta}
                  {campo.requerido ? (
                    <span className="ml-1 text-alerta" aria-hidden="true">
                      *
                    </span>
                  ) : (
                    <span className="ml-2 text-sm font-normal text-ink-muted">
                      opcional
                    </span>
                  )}
                </label>

                {campo.tipo === "parrafo" ? (
                  <textarea
                    id={id}
                    rows={3}
                    value={valor}
                    maxLength={campo.max_largo ?? undefined}
                    onChange={(e) => responder(campo.etiqueta, e.target.value)}
                    aria-invalid={error ? true : undefined}
                    aria-describedby={descrito || undefined}
                    className={cn(claseControl, "resize-y")}
                  />
                ) : campo.tipo === "opcion" || campo.tipo === "color" ? (
                  <div
                    id={id}
                    role="radiogroup"
                    aria-labelledby={undefined}
                    aria-invalid={error ? true : undefined}
                    aria-describedby={descrito || undefined}
                    tabIndex={-1}
                    className="flex flex-wrap gap-2"
                  >
                    {campo.opciones.map((opcion) => {
                      const elegido = valor === opcion;
                      const muestra = MUESTRAS[opcion.toLowerCase()];
                      return (
                        <button
                          key={opcion}
                          type="button"
                          role="radio"
                          aria-checked={elegido}
                          onClick={() => responder(campo.etiqueta, opcion)}
                          className={cn(
                            "inline-flex min-h-12 items-center gap-2 rounded-pill border-2 border-line px-4 font-display text-sm font-bold transition-[background-color,box-shadow] duration-150",
                            elegido
                              ? "bg-violeta text-[oklch(0.17_0.022_292)] shadow-solida"
                              : "bg-surface text-ink hover:bg-violeta-tenue",
                          )}
                        >
                          {muestra ? (
                            <span
                              aria-hidden="true"
                              className="size-4 shrink-0 rounded-full border-2 border-line"
                              style={{ backgroundColor: muestra }}
                            />
                          ) : null}
                          {opcion}
                          {elegido ? (
                            <Check className="size-4" aria-hidden="true" />
                          ) : null}
                        </button>
                      );
                    })}
                  </div>
                ) : (
                  <input
                    id={id}
                    type={campo.tipo === "numero" ? "number" : "text"}
                    value={valor}
                    maxLength={campo.max_largo ?? undefined}
                    onChange={(e) => responder(campo.etiqueta, e.target.value)}
                    aria-invalid={error ? true : undefined}
                    aria-describedby={descrito || undefined}
                    className={claseControl}
                  />
                )}

                {campo.ayuda && !error ? (
                  <p id={`${id}-ayuda`} className="text-sm text-ink-muted">
                    {campo.ayuda}
                    {campo.max_largo && campo.tipo !== "opcion" && campo.tipo !== "color"
                      ? ` · ${valor.length}/${campo.max_largo}`
                      : ""}
                  </p>
                ) : null}

                {error ? (
                  <p
                    id={`${id}-error`}
                    role="alert"
                    className="text-sm font-semibold text-alerta"
                  >
                    {error}
                  </p>
                ) : null}
              </div>
            );
          })}
        </fieldset>
      ) : null}

      <div className="flex flex-wrap items-end gap-3">
        <div className="grid gap-1.5">
          <label htmlFor="cantidad" className="font-semibold">
            Cantidad
          </label>
          <input
            id="cantidad"
            type="number"
            min={1}
            max={99}
            value={cantidad}
            onChange={(e) =>
              setCantidad(Math.max(1, Math.min(99, Number(e.target.value) || 1)))
            }
            className={cn(claseControl, "w-24")}
          />
        </div>

        <button
          type="submit"
          className="inline-flex min-h-14 flex-1 items-center justify-center gap-2 rounded-control border-2 border-line bg-naranja px-6 font-display text-lg font-bold text-[oklch(0.17_0.022_292)] transition-[translate,box-shadow] duration-200 ease-[var(--ease-salida)] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-solida active:translate-x-0 active:translate-y-0 active:shadow-none motion-reduce:hover:translate-x-0 motion-reduce:hover:translate-y-0"
        >
          <ShoppingBag className="size-5" aria-hidden="true" />
          Agregar al pedido
        </button>
      </div>

      <p aria-live="polite" className="min-h-6">
        {agregado ? (
          <span className="inline-flex flex-wrap items-center gap-2 rounded-control border-2 border-line bg-verde-tenue px-4 py-2 font-semibold">
            <Check className="size-4 shrink-0" aria-hidden="true" />
            Agregado al pedido.
            <Link href="/carrito" className="underline underline-offset-2">
              Ver el pedido
            </Link>
          </span>
        ) : null}
      </p>
    </form>
  );
}

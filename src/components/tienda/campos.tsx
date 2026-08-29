"use client";

import { Check } from "lucide-react";
import { useId, useRef, type ComponentProps, type ReactNode } from "react";

import { cn } from "@/lib/utils";

/**
 * Primitivas de formulario de la tienda. Registro de marca: trazo de 2px,
 * tipografía display en las etiquetas de opción, sombra sólida en lo elegido.
 * El equivalente del panel vive en `components/panel/campos.tsx` con el
 * registro contrario; comparten tokens, no clases.
 *
 * Antes esta cadena estaba copiada carácter por carácter en
 * `formulario-personalizacion.tsx` y en `pagina-carrito.tsx`, y ambas copias
 * arrastraban el mismo defecto de foco.
 */
export const claseControl =
  "w-full min-h-12 rounded-control border-2 border-line bg-surface px-3 py-2 text-ink transition-colors duration-150 placeholder:text-ink-muted aria-[invalid=true]:border-alerta";

/**
 * El foco lo pone `:focus-visible` en globals.css: contorno sólido de 3px en
 * morado, que es el trazo grueso de la marca y mide 3.81:1 sobre la superficie
 * blanca. No se anula con `focus:outline-none` aquí ni en ningún control: el
 * anillo translúcido que lo reemplazaba medía 1.40:1 y no cumplía la
 * SC 1.4.11.
 */

export function Entrada({ className, ...props }: ComponentProps<"input">) {
  return <input className={cn(claseControl, className)} {...props} />;
}

export function AreaTexto({ className, ...props }: ComponentProps<"textarea">) {
  return (
    <textarea
      className={cn(claseControl, "resize-y leading-relaxed", className)}
      {...props}
    />
  );
}

export function Seleccion({ className, ...props }: ComponentProps<"select">) {
  return <select className={cn(claseControl, "pr-8", className)} {...props} />;
}

/** Ids de ayuda y error de un campo, y el `aria-describedby` que los une. */
export function descripcionDe(
  id: string,
  { ayuda, error }: { ayuda?: ReactNode; error?: string },
) {
  const ids = [ayuda ? `${id}-ayuda` : null, error ? `${id}-error` : null].filter(
    Boolean,
  );
  return {
    idAyuda: `${id}-ayuda`,
    idError: `${id}-error`,
    describedBy: ids.length ? ids.join(" ") : undefined,
  };
}

type CampoProps = {
  htmlFor: string;
  etiqueta: string;
  ayuda?: ReactNode;
  error?: string;
  requerido?: boolean;
  /** Muestra «opcional» junto a la etiqueta cuando el campo no es requerido. */
  marcarOpcional?: boolean;
  className?: string;
  children: ReactNode;
};

/**
 * Etiqueta + control + ayuda + error.
 *
 * La ayuda se renderiza SIEMPRE que exista, también cuando hay error. Antes se
 * ocultaba al fallar la validación, y con ella desaparecían el contador de
 * caracteres y el destino de un `aria-describedby` que seguía apuntándole.
 */
export function Campo({
  htmlFor,
  etiqueta,
  ayuda,
  error,
  requerido,
  marcarOpcional,
  className,
  children,
}: CampoProps) {
  const { idAyuda, idError } = descripcionDe(htmlFor, { ayuda, error });

  return (
    <div className={cn("grid gap-1.5", className)}>
      <label htmlFor={htmlFor} className="font-semibold">
        {etiqueta}
        {requerido ? (
          <span className="ml-1 text-alerta" aria-hidden="true">
            *
          </span>
        ) : marcarOpcional ? (
          <span className="ml-2 text-sm font-normal text-ink-muted">
            opcional
          </span>
        ) : null}
      </label>

      {children}

      {ayuda ? (
        <p id={idAyuda} className="text-sm text-ink-muted">
          {ayuda}
        </p>
      ) : null}

      {error ? (
        <p id={idError} role="alert" className="text-sm font-semibold text-alerta">
          {error}
        </p>
      ) : null}
    </div>
  );
}

type Opcion = { valor: string; muestra?: string };

type GrupoOpcionesProps = {
  etiqueta: string;
  opciones: Opcion[];
  valor: string;
  onCambio: (valor: string) => void;
  ayuda?: ReactNode;
  error?: string;
  requerido?: boolean;
  marcarOpcional?: boolean;
  /** Recibe el primer botón, para poder llevarle el foco al fallar la validación. */
  refPrimero?: (nodo: HTMLButtonElement | null) => void;
};

/**
 * Grupo de opciones con botones de marca en vez de radios nativos.
 *
 * Dos cosas que la versión anterior no hacía y que el patrón exige:
 *
 * 1. **Nombre accesible.** El `<label for>` apuntaba a un `<div>`, y `for` solo
 *    asocia con elementos etiquetables: el grupo se anunciaba como «grupo», sin
 *    decir de qué. Ahora es `fieldset` + `legend`, y el radiogroup apunta a la
 *    leyenda con `aria-labelledby`.
 * 2. **Navegación con flechas y tabulación única.** Un radiogroup se recorre con
 *    las flechas y ocupa una sola parada de tabulador; antes cada opción era una
 *    parada suelta y las flechas no hacían nada.
 */
export function GrupoOpciones({
  etiqueta,
  opciones,
  valor,
  onCambio,
  ayuda,
  error,
  requerido,
  marcarOpcional,
  refPrimero,
}: GrupoOpcionesProps) {
  const id = useId();
  const botones = useRef<(HTMLButtonElement | null)[]>([]);
  const { idAyuda, idError, describedBy } = descripcionDe(id, { ayuda, error });

  const elegidoEn = opciones.findIndex((o) => o.valor === valor);
  // Tabulador único: entra en lo elegido, o en la primera opción si no hay nada.
  const paradaDeTabulador = elegidoEn === -1 ? 0 : elegidoEn;

  function mover(desde: number, paso: number) {
    const total = opciones.length;
    const siguiente = (desde + paso + total) % total;
    onCambio(opciones[siguiente].valor);
    botones.current[siguiente]?.focus();
  }

  function alPulsarTecla(evento: React.KeyboardEvent, indice: number) {
    switch (evento.key) {
      case "ArrowRight":
      case "ArrowDown":
        evento.preventDefault();
        mover(indice, 1);
        break;
      case "ArrowLeft":
      case "ArrowUp":
        evento.preventDefault();
        mover(indice, -1);
        break;
      case "Home":
        evento.preventDefault();
        mover(-1, 1);
        break;
      case "End":
        evento.preventDefault();
        mover(0, -1);
        break;
    }
  }

  return (
    <fieldset className="grid gap-1.5">
      {/* El `gap` del fieldset no alcanza a la leyenda: la separación es suya. */}
      <legend id={`${id}-etiqueta`} className="mb-1.5 font-semibold">
        {etiqueta}
        {requerido ? (
          <span className="ml-1 text-alerta" aria-hidden="true">
            *
          </span>
        ) : marcarOpcional ? (
          <span className="ml-2 text-sm font-normal text-ink-muted">
            opcional
          </span>
        ) : null}
      </legend>

      <div
        role="radiogroup"
        aria-labelledby={`${id}-etiqueta`}
        aria-describedby={describedBy}
        aria-invalid={error ? true : undefined}
        aria-required={requerido || undefined}
        className="flex flex-wrap gap-2"
      >
        {opciones.map((opcion, i) => {
          const elegido = valor === opcion.valor;
          return (
            <button
              key={opcion.valor}
              ref={(nodo) => {
                botones.current[i] = nodo;
                if (i === 0) refPrimero?.(nodo);
              }}
              type="button"
              role="radio"
              aria-checked={elegido}
              tabIndex={i === paradaDeTabulador ? 0 : -1}
              onClick={() => onCambio(opcion.valor)}
              onKeyDown={(e) => alPulsarTecla(e, i)}
              className={cn(
                "inline-flex min-h-12 items-center gap-2 rounded-pill border-2 border-line px-4 font-display text-sm font-bold transition-[background-color,box-shadow] duration-150",
                elegido
                  ? "bg-violeta text-ink-fijo shadow-solida"
                  : "bg-surface text-ink hover:bg-violeta-tenue",
              )}
            >
              {opcion.muestra ? (
                <span
                  aria-hidden="true"
                  className="size-4 shrink-0 rounded-full border-2 border-line"
                  style={{ backgroundColor: opcion.muestra }}
                />
              ) : null}
              {opcion.valor}
              {elegido ? <Check className="size-4" aria-hidden="true" /> : null}
            </button>
          );
        })}
      </div>

      {ayuda ? (
        <p id={idAyuda} className="text-sm text-ink-muted">
          {ayuda}
        </p>
      ) : null}

      {error ? (
        <p id={idError} role="alert" className="text-sm font-semibold text-alerta">
          {error}
        </p>
      ) : null}
    </fieldset>
  );
}

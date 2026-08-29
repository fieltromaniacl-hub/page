"use client";

import { Check, ShoppingBag } from "lucide-react";
import Link from "next/link";
import { useRef, useState } from "react";

import {
  AreaTexto,
  Campo,
  Entrada,
  GrupoOpciones,
} from "@/components/tienda/campos";
import { usarCarrito } from "@/lib/carrito/tienda";

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

const esGrupo = (tipo: TipoCampo) => tipo === "opcion" || tipo === "color";

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
  // Se guarda como texto para que se pueda borrar y reescribir; el número se
  // interpreta al enviar. Con un número forzado, borrar el campo lo devolvía
  // a 1 de un salto y no se podía teclear «12».
  const [cantidad, setCantidad] = useState("1");
  const [agregado, setAgregado] = useState(false);

  /** Un destino de foco por campo, para aterrizar en el primero con problema. */
  const primerosDeGrupo = useRef<Record<string, HTMLButtonElement | null>>({});

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
      // Lleva el foco al primer campo con problema. Un grupo de opciones no es
      // un control enfocable: hay que aterrizar en su primer botón.
      const primero = campos.find((c) => nuevos[c.etiqueta]);
      if (primero) {
        if (esGrupo(primero.tipo)) {
          primerosDeGrupo.current[primero.id]?.focus();
        } else {
          document.getElementById(`campo-${primero.id}`)?.focus();
        }
      }
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
      cantidad: Math.max(1, Math.min(99, Number(cantidad) || 1)),
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
          <legend className="mb-2 font-display text-xl font-bold tracking-tight">
            Personalízalo
          </legend>

          {campos.map((campo) => {
            const id = `campo-${campo.id}`;
            const error = errores[campo.etiqueta];
            const valor = respuestas[campo.etiqueta] ?? "";

            // El contador vive junto a la ayuda y se muestra SIEMPRE que el
            // campo tenga tope, tenga o no texto de ayuda, y también cuando hay
            // un error: es justo entonces cuando más se necesita.
            const contador =
              campo.max_largo && !esGrupo(campo.tipo)
                ? `${valor.length}/${campo.max_largo}`
                : null;
            const ayuda =
              [campo.ayuda, contador].filter(Boolean).join(" · ") || undefined;

            if (esGrupo(campo.tipo)) {
              return (
                <GrupoOpciones
                  key={campo.id}
                  etiqueta={campo.etiqueta}
                  requerido={campo.requerido}
                  marcarOpcional={!campo.requerido}
                  opciones={campo.opciones.map((opcion) => ({
                    valor: opcion,
                    muestra: MUESTRAS[opcion.toLowerCase()],
                  }))}
                  valor={valor}
                  onCambio={(nuevo) => responder(campo.etiqueta, nuevo)}
                  ayuda={ayuda}
                  error={error}
                  refPrimero={(nodo) => {
                    primerosDeGrupo.current[campo.id] = nodo;
                  }}
                />
              );
            }

            const comunes = {
              id,
              value: valor,
              maxLength: campo.max_largo ?? undefined,
              "aria-invalid": error ? true : undefined,
              "aria-describedby":
                [ayuda ? `${id}-ayuda` : null, error ? `${id}-error` : null]
                  .filter(Boolean)
                  .join(" ") || undefined,
              onChange: (
                e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
              ) => responder(campo.etiqueta, e.target.value),
            };

            return (
              <Campo
                key={campo.id}
                htmlFor={id}
                etiqueta={campo.etiqueta}
                ayuda={ayuda}
                error={error}
                requerido={campo.requerido}
                marcarOpcional={!campo.requerido}
              >
                {campo.tipo === "parrafo" ? (
                  <AreaTexto rows={3} {...comunes} />
                ) : (
                  <Entrada
                    type={campo.tipo === "numero" ? "number" : "text"}
                    inputMode={campo.tipo === "numero" ? "numeric" : undefined}
                    {...comunes}
                  />
                )}
              </Campo>
            );
          })}
        </fieldset>
      ) : null}

      <div className="flex flex-wrap items-end gap-3">
        <Campo htmlFor="cantidad" etiqueta="Cantidad" className="w-24">
          <Entrada
            id="cantidad"
            type="number"
            inputMode="numeric"
            min={1}
            max={99}
            value={cantidad}
            onChange={(e) => setCantidad(e.target.value)}
            // Se normaliza al salir, no en cada tecla: así el campo puede estar
            // vacío mientras se escribe.
            onBlur={() =>
              setCantidad(String(Math.max(1, Math.min(99, Number(cantidad) || 1))))
            }
          />
        </Campo>

        <button
          type="submit"
          className="inline-flex min-h-14 flex-1 items-center justify-center gap-2 rounded-control border-2 border-line bg-naranja px-6 font-display text-lg font-bold text-ink-fijo transition-[translate,box-shadow] duration-200 ease-[var(--ease-salida)] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-solida active:translate-x-0 active:translate-y-0 active:shadow-none motion-reduce:hover:translate-x-0 motion-reduce:hover:translate-y-0"
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

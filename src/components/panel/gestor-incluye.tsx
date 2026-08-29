"use client";

import { Package, Plus, Trash2 } from "lucide-react";
import { useActionState, useState } from "react";
import { useFormStatus } from "react-dom";

import { BotonPanel } from "@/components/panel/boton-panel";
import { Campo, Entrada, Seleccion } from "@/components/panel/campos";
import {
  agregarIncluido,
  cambiarCantidadIncluida,
  quitarIncluido,
  type EstadoIncluye,
} from "@/lib/acciones/packs";
import { formatearPrecio } from "@/lib/utils";

export type Incluido = {
  incluido_id: string;
  cantidad: number;
  nombre: string;
  precio: number;
  publicado: boolean;
};

export type Candidato = { id: string; nombre: string; precio: number };

function BotonAgregar() {
  const { pending } = useFormStatus();
  return (
    <BotonPanel type="submit" variante="neutro" disabled={pending}>
      <Plus className="size-4" aria-hidden="true" />
      {pending ? "Agregando…" : "Agregar al pack"}
    </BotonPanel>
  );
}

/**
 * Arma un pack: qué productos vienen dentro de este.
 *
 * Un producto con filas aquí pasa a ser un pack en la tienda. No hay entidad
 * aparte: hereda precio, fotos, personalización y disponibilidad de la ficha
 * de arriba. La personalización se pregunta una sola vez, que es como se pide
 * de verdad «libro y letrero con el mismo nombre».
 */
export function GestorIncluye({
  productoId,
  slug,
  precio,
  incluye,
  candidatos,
}: {
  productoId: string;
  slug: string;
  precio: number;
  incluye: Incluido[];
  candidatos: Candidato[];
}) {
  const [estado, accion] = useActionState<EstadoIncluye, FormData>(
    agregarIncluido,
    {},
  );
  const [confirmando, setConfirmando] = useState<string | null>(null);

  const yaDentro = new Set(incluye.map((i) => i.incluido_id));
  const disponibles = candidatos.filter((c) => !yaDentro.has(c.id));

  // Solo cuenta lo publicado: es lo que el público puede ver y sumar.
  const suelto = incluye.reduce(
    (s, i) => s + (i.publicado ? i.precio * i.cantidad : 0),
    0,
  );
  const ahorro = suelto - precio;

  return (
    <section className="rounded-card border border-line-soft bg-surface p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="flex items-center gap-2 text-base font-bold tracking-tight">
            <Package className="size-4 shrink-0 text-ink-muted" aria-hidden="true" />
            Qué incluye este producto
          </h2>
          <p className="mt-1 text-sm text-ink-muted">
            Déjalo vacío si es un producto suelto. Si agregas productos, pasa a
            venderse como pack: se muestra qué trae y cuánto se ahorra, y se
            personaliza una sola vez.
          </p>
        </div>
      </div>

      {incluye.length ? (
        <>
          <ul className="mt-4 divide-y divide-line-soft rounded-control border border-line-soft">
            {incluye.map((item) => (
              <li key={item.incluido_id} className="flex flex-wrap items-center gap-3 p-3">
                <span className="min-w-0 flex-1">
                  <span className="block text-sm font-semibold">{item.nombre}</span>
                  <span className="block text-sm text-ink-muted tabular-nums">
                    {formatearPrecio(item.precio)}
                    {!item.publicado ? (
                      <span className="ml-2 text-alerta">
                        · sin publicar, no se muestra en la tienda
                      </span>
                    ) : null}
                  </span>
                </span>

                <form action={cambiarCantidadIncluida} className="flex items-center gap-2">
                  <input type="hidden" name="producto_id" value={productoId} />
                  <input type="hidden" name="incluido_id" value={item.incluido_id} />
                  <input type="hidden" name="slug" value={slug} />
                  <label
                    htmlFor={`cant-${item.incluido_id}`}
                    className="text-sm text-ink-muted"
                  >
                    Cantidad
                  </label>
                  <Entrada
                    id={`cant-${item.incluido_id}`}
                    name="cantidad"
                    type="number"
                    min={1}
                    max={20}
                    defaultValue={String(item.cantidad)}
                    className="w-20"
                  />
                  <BotonPanel type="submit" variante="neutro" tamano="sm">
                    Cambiar
                  </BotonPanel>
                </form>

                {confirmando === item.incluido_id ? (
                  <form action={quitarIncluido} className="flex items-center gap-1">
                    <input type="hidden" name="producto_id" value={productoId} />
                    <input type="hidden" name="incluido_id" value={item.incluido_id} />
                    <input type="hidden" name="slug" value={slug} />
                    <BotonPanel type="submit" variante="peligro" tamano="sm">
                      Sí, quitar
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
                    aria-label={`Quitar ${item.nombre} del pack`}
                    onClick={() => setConfirmando(item.incluido_id)}
                  >
                    <Trash2 className="size-4" aria-hidden="true" />
                  </BotonPanel>
                )}
              </li>
            ))}
          </ul>

          <p className="mt-3 text-sm">
            Por separado costarían{" "}
            <strong className="tabular-nums">{formatearPrecio(suelto)}</strong>.{" "}
            {ahorro > 0 ? (
              <span className="text-verde-txt">
                Tu precio ahorra {formatearPrecio(ahorro)}.
              </span>
            ) : (
              <span className="text-alerta">
                Tu precio no es más barato, así que la tienda no mostrará ahorro.
              </span>
            )}
          </p>
        </>
      ) : null}

      {estado.error ? (
        <p
          role="alert"
          className="mt-4 rounded-control border border-alerta bg-alerta-tenue px-4 py-3 text-sm font-medium"
        >
          {estado.error}
        </p>
      ) : null}

      {disponibles.length ? (
        <form action={accion} className="mt-4 flex flex-wrap items-end gap-3">
          <input type="hidden" name="producto_id" value={productoId} />
          <input type="hidden" name="slug" value={slug} />
          <input type="hidden" name="orden" value={(incluye.length + 1) * 10} />

          <Campo
            htmlFor="incluido_id"
            etiqueta="Agregar un producto"
            className="min-w-56 flex-1"
          >
            <Seleccion id="incluido_id" name="incluido_id" defaultValue="">
              <option value="" disabled>
                Elige uno
              </option>
              {disponibles.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.nombre} · {formatearPrecio(c.precio)}
                </option>
              ))}
            </Seleccion>
          </Campo>

          <Campo htmlFor="cantidad" etiqueta="Cantidad" className="w-24">
            <Entrada
              id="cantidad"
              name="cantidad"
              type="number"
              min={1}
              max={20}
              defaultValue="1"
            />
          </Campo>

          <BotonAgregar />
        </form>
      ) : (
        <p className="mt-4 text-sm text-ink-muted">
          No hay más productos que agregar. Los packs no se pueden meter dentro
          de otros packs.
        </p>
      )}
    </section>
  );
}

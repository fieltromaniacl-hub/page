"use client";

import { Check, Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useActionState, useEffect } from "react";
import { useFormStatus } from "react-dom";

import {
  AreaTexto,
  Campo,
  Entrada,
  Seleccion,
  descripcionDe,
} from "@/components/tienda/campos";
import { EnlaceWhatsapp } from "@/components/tienda/enlace-whatsapp";
import { subtotal, usarCarrito } from "@/lib/carrito/tienda";
import { crearPedido, type EstadoPedido } from "@/lib/acciones/pedido";
import { REGIONES } from "@/lib/regiones";
import { formatearPrecio } from "@/lib/utils";

function BotonEnviar() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex min-h-14 w-full items-center justify-center gap-2 rounded-control border-2 border-line bg-naranja px-6 font-display text-lg font-bold text-ink-fijo transition-[translate,box-shadow] duration-200 ease-[var(--ease-salida)] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-solida disabled:pointer-events-none disabled:opacity-60 motion-reduce:hover:translate-x-0 motion-reduce:hover:translate-y-0"
    >
      {pending ? "Enviando tu pedido…" : "Enviar pedido"}
    </button>
  );
}

function Confirmacion({
  numero,
  promesaDePago,
}: {
  numero: string;
  promesaDePago: string;
}) {
  const vaciar = usarCarrito((e) => e.vaciar);

  // El carrito se vacía una vez confirmado el pedido, no antes: si el envío
  // hubiera fallado, la persona conserva lo que había armado.
  useEffect(() => {
    vaciar();
  }, [vaciar]);

  return (
    <div className="mx-auto max-w-xl rounded-card border-[3px] border-line bg-verde-tenue p-8 text-center sm:p-10">
      <span className="mx-auto grid size-14 place-items-center rounded-pill border-[3px] border-line bg-surface">
        <Check className="size-7" strokeWidth={3} aria-hidden="true" />
      </span>

      <h1 className="mt-5 text-[length:var(--text-titulo)] leading-[1.05]">
        Recibimos tu pedido
      </h1>

      <p className="mt-3 text-[length:var(--text-sub)] leading-relaxed">
        Quedó registrado con el número{" "}
        <strong className="font-display">{numero}</strong>.
      </p>

      <p className="mx-auto mt-4 max-w-[46ch] text-ink-muted">
        Te enviamos un correo con el detalle. {promesaDePago}
      </p>

      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <EnlaceWhatsapp
          variante="fuerte"
          mensaje={`Hola, acabo de hacer el pedido ${numero} en el sitio.`}
        >
          Escribirnos por WhatsApp
        </EnlaceWhatsapp>
        <Link
          href="/productos"
          className="inline-flex min-h-12 items-center rounded-control border-2 border-line bg-surface px-5 font-display font-bold"
        >
          Seguir mirando
        </Link>
      </div>
    </div>
  );
}

export function PaginaCarrito({
  promesaDePago,
  notaDeDespacho,
}: {
  promesaDePago: string;
  notaDeDespacho: string;
}) {
  const items = usarCarrito((e) => e.items);
  const cambiarCantidad = usarCarrito((e) => e.cambiarCantidad);
  const quitar = usarCarrito((e) => e.quitar);

  const [estado, accion] = useActionState<EstadoPedido, FormData>(crearPedido, {});

  if (estado.numero)
    return <Confirmacion numero={estado.numero} promesaDePago={promesaDePago} />;

  if (!items.length) {
    return (
      <div className="mx-auto max-w-lg rounded-card border-[3px] border-dashed border-line-soft px-6 py-16 text-center">
        <ShoppingBag
          className="mx-auto size-9 text-ink-muted"
          strokeWidth={1.75}
          aria-hidden="true"
        />
        <h1 className="mt-4 font-display text-xl font-bold">
          Tu pedido está vacío
        </h1>
        <p className="mx-auto mt-2 max-w-sm text-ink-muted">
          Cuando agregues algo del catálogo, aparecerá aquí junto con los datos
          de personalización que hayas elegido.
        </p>
        <Link
          href="/productos"
          className="mt-6 inline-flex min-h-12 items-center rounded-control border-2 border-line bg-naranja px-5 font-display font-bold text-ink-fijo"
        >
          Ver el catálogo
        </Link>
      </div>
    );
  }

  const err = estado.errores ?? {};
  const previo = estado.valores;
  const total = subtotal(items);

  const AYUDA_CORREO = "Ahí te llega la confirmación del pedido.";
  const AYUDA_TELEFONO =
    "Si nos lo dejas, te escribimos por WhatsApp y es más rápido.";

  return (
    <div className="grid gap-10 lg:grid-cols-[1.15fr_1fr] lg:gap-14">
      <section aria-labelledby="titulo-pedido">
        <h1 id="titulo-pedido" className="text-[length:var(--text-titulo)] leading-[1.05]">
          Tu pedido
        </h1>

        <ul className="mt-6 grid gap-4">
          {items.map((item) => (
            <li
              key={item.clave}
              className="flex gap-4 rounded-card border-[3px] border-line bg-surface p-3"
            >
              <span className="relative size-24 shrink-0 overflow-hidden rounded-control border-2 border-line bg-surface-2">
                {item.imagen ? (
                  <Image
                    src={item.imagen}
                    alt=""
                    fill
                    sizes="6rem"
                    className="object-cover"
                  />
                ) : null}
              </span>

              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-2">
                  <Link
                    href={`/productos/${item.slug}`}
                    className="inline-flex min-h-11 items-center font-display font-bold leading-tight hover:underline"
                  >
                    {item.nombre}
                  </Link>
                  <button
                    type="button"
                    onClick={() => quitar(item.clave)}
                    aria-label={`Quitar ${item.nombre} del pedido`}
                    className="grid size-11 shrink-0 place-items-center rounded-control text-ink-muted transition-colors hover:bg-alerta-tenue hover:text-alerta"
                  >
                    <Trash2 className="size-4" aria-hidden="true" />
                  </button>
                </div>

                {Object.entries(item.personalizacion).length ? (
                  <dl className="mt-1.5 grid gap-0.5 text-sm">
                    {Object.entries(item.personalizacion).map(([pregunta, respuesta]) => (
                      <div key={pregunta} className="flex flex-wrap gap-x-1.5">
                        <dt className="text-ink-muted">{pregunta}:</dt>
                        <dd className="font-semibold">{respuesta}</dd>
                      </div>
                    ))}
                  </dl>
                ) : null}

                <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-1 rounded-pill border-2 border-line">
                    <button
                      type="button"
                      onClick={() => cambiarCantidad(item.clave, item.cantidad - 1)}
                      aria-label={`Quitar una unidad de ${item.nombre}`}
                      className="grid size-11 place-items-center rounded-pill text-ink transition-colors hover:bg-surface-2"
                    >
                      <Minus className="size-4" aria-hidden="true" />
                    </button>
                    <span className="min-w-8 text-center font-display font-bold tabular-nums">
                      {item.cantidad}
                    </span>
                    <button
                      type="button"
                      onClick={() => cambiarCantidad(item.clave, item.cantidad + 1)}
                      aria-label={`Agregar una unidad de ${item.nombre}`}
                      className="grid size-11 place-items-center rounded-pill text-ink transition-colors hover:bg-surface-2"
                    >
                      <Plus className="size-4" aria-hidden="true" />
                    </button>
                  </div>

                  <p className="font-display font-bold tabular-nums">
                    {formatearPrecio(item.precio * item.cantidad)}
                  </p>
                </div>
              </div>
            </li>
          ))}
        </ul>

        <div className="mt-6 flex items-baseline justify-between border-t-[3px] border-line pt-4">
          <p className="font-display text-lg font-bold">Total</p>
          <p className="font-display text-2xl font-extrabold tabular-nums">
            {formatearPrecio(total)}
          </p>
        </div>
        <p className="mt-2 text-sm text-ink-muted">{notaDeDespacho}</p>

        {/* Un solo anuncio para todo el pedido: cambiar una cantidad decía
            «3» sin más contexto, y había una región viva por cada línea. */}
        <p aria-live="polite" className="sr-only">
          {items.length === 1 ? "1 producto" : `${items.length} productos`} en tu
          pedido. Total {formatearPrecio(total)}.
        </p>
      </section>

      <section aria-labelledby="titulo-datos">
        <form action={accion} className="grid gap-4 rounded-card border-[3px] border-line bg-surface p-5 sm:p-6">
          <h2 id="titulo-datos" className="font-display text-xl font-bold tracking-tight">
            Tus datos
          </h2>
          <p className="-mt-2 text-sm text-ink-muted">
            Con esto te contactamos para acordar el pago y la entrega.
          </p>

          <input type="hidden" name="items" value={JSON.stringify(
            items.map((i) => ({
              productoId: i.productoId,
              cantidad: i.cantidad,
              personalizacion: i.personalizacion,
            })),
          )} />

          {/* Trampa para robots: invisible y fuera del orden de tabulación. */}
          <div aria-hidden="true" className="absolute left-[-9999px]">
            <label htmlFor="sitio_web">No llenar</label>
            <input id="sitio_web" name="sitio_web" type="text" tabIndex={-1} autoComplete="off" />
          </div>

          {estado.mensaje ? (
            <p
              role="alert"
              className="rounded-control border-2 border-alerta bg-alerta-tenue px-4 py-3 text-sm font-semibold"
            >
              {estado.mensaje}
            </p>
          ) : null}

          <Campo htmlFor="nombre" etiqueta="Nombre" requerido error={err.nombre}>
            <Entrada
              id="nombre"
              name="nombre"
              autoComplete="name"
              required
              defaultValue={previo?.nombre ?? ""}
              aria-invalid={err.nombre ? true : undefined}
              aria-describedby={
                descripcionDe("nombre", { error: err.nombre }).describedBy
              }
            />
          </Campo>

          <Campo
            htmlFor="email"
            etiqueta="Correo"
            requerido
            ayuda={AYUDA_CORREO}
            error={err.email}
          >
            <Entrada
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              defaultValue={previo?.email ?? ""}
              aria-invalid={err.email ? true : undefined}
              aria-describedby={
                descripcionDe("email", {
                  ayuda: AYUDA_CORREO,
                  error: err.email,
                }).describedBy
              }
            />
          </Campo>

          <Campo
            htmlFor="telefono"
            etiqueta="Teléfono"
            ayuda={AYUDA_TELEFONO}
            error={err.telefono}
          >
            <Entrada
              id="telefono"
              name="telefono"
              type="tel"
              autoComplete="tel"
              placeholder="+56 9 1234 5678"
              defaultValue={previo?.telefono ?? ""}
              aria-invalid={err.telefono ? true : undefined}
              aria-describedby={
                descripcionDe("telefono", {
                  ayuda: AYUDA_TELEFONO,
                  error: err.telefono,
                }).describedBy
              }
            />
          </Campo>

          <div className="grid gap-4 sm:grid-cols-2">
            <Campo htmlFor="comuna" etiqueta="Comuna">
              <Entrada
                id="comuna"
                name="comuna"
                autoComplete="address-level2"
                defaultValue={previo?.comuna ?? ""}
              />
            </Campo>
            <Campo htmlFor="region" etiqueta="Región">
              <Seleccion
                id="region"
                name="region"
                defaultValue={previo?.region ?? ""}
              >
                <option value="">Elige una</option>
                {REGIONES.map((r) => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </Seleccion>
            </Campo>
          </div>

          <Campo htmlFor="notas" etiqueta="¿Algo más que debamos saber?">
            <AreaTexto
              id="notas"
              name="notas"
              rows={3}
              defaultValue={previo?.notas ?? ""}
              placeholder="Para cuándo lo necesitas, si es un regalo, alguna preferencia…"
            />
          </Campo>

          <BotonEnviar />

          <p className="text-center text-sm text-ink-muted">{promesaDePago}</p>
        </form>
      </section>
    </div>
  );
}

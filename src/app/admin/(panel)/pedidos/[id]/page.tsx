import { ArrowLeft, Mail, MessageCircle, Phone } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

import { BotonPanel } from "@/components/panel/boton-panel";
import { AreaTexto } from "@/components/panel/campos";
import { ETIQUETA_PEDIDO, InsigniaPedido } from "@/components/panel/insignias";
import { cambiarEstadoPedido, guardarNotaPedido } from "@/lib/acciones/pedidos";
import { crearClienteServidor } from "@/lib/supabase/servidor";
import { cn, formatearPrecio } from "@/lib/utils";

export const metadata = { title: "Pedido" };

/** Deja el teléfono en formato internacional para wa.me: solo dígitos. */
function paraWhatsapp(telefono: string | null) {
  if (!telefono) return null;
  const digitos = telefono.replace(/\D/g, "");
  if (digitos.length < 8) return null;
  // Si viene sin código de país, se asume Chile.
  return digitos.startsWith("56") ? digitos : `56${digitos.replace(/^0+/, "")}`;
}

export default async function DetallePedido({
  params,
}: PageProps<"/admin/pedidos/[id]">) {
  const { id } = await params;
  const supabase = await crearClienteServidor();

  const { data: pedido } = await supabase
    .from("pedidos")
    .select("*, pedido_items(id, nombre, slug, precio_unitario, cantidad, personalizacion)")
    .eq("id", id)
    .maybeSingle();

  if (!pedido) notFound();

  const whatsapp = paraWhatsapp(pedido.cliente_telefono);
  const mensaje = encodeURIComponent(
    `Hola ${pedido.cliente_nombre}, te escribo de Fieltromanía por tu pedido ${pedido.numero}.`,
  );

  return (
    <main className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      <Link
        href="/admin/pedidos"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-ink-muted transition-colors hover:text-ink"
      >
        <ArrowLeft className="size-4" aria-hidden="true" />
        Pedidos
      </Link>

      <div className="mt-3 flex flex-wrap items-center gap-3">
        <h1 className="font-mono text-xl font-bold tracking-tight">
          {pedido.numero}
        </h1>
        <InsigniaPedido estado={pedido.estado} />
      </div>

      {!pedido.correo_enviado ? (
        <p
          role="alert"
          className="mt-4 rounded-control border border-alerta/40 bg-alerta-tenue px-4 py-2.5 text-sm"
        >
          El correo de este pedido no se pudo enviar
          {pedido.correo_error ? `: ${pedido.correo_error}` : "."} El pedido está
          completo igual: contáctala tú directamente.
        </p>
      ) : null}

      <section className="mt-6 rounded-card border border-line-soft bg-surface p-5">
        <h2 className="text-base font-bold tracking-tight">Cliente</h2>
        <dl className="mt-3 grid gap-2 text-sm sm:grid-cols-2">
          <div>
            <dt className="text-ink-muted">Nombre</dt>
            <dd className="font-medium">{pedido.cliente_nombre}</dd>
          </div>
          <div>
            <dt className="text-ink-muted">Correo</dt>
            <dd className="font-medium break-all">{pedido.cliente_email}</dd>
          </div>
          {pedido.cliente_telefono ? (
            <div>
              <dt className="text-ink-muted">Teléfono</dt>
              <dd className="font-medium">{pedido.cliente_telefono}</dd>
            </div>
          ) : null}
          {pedido.comuna || pedido.region ? (
            <div>
              <dt className="text-ink-muted">Dónde</dt>
              <dd className="font-medium">
                {[pedido.comuna, pedido.region].filter(Boolean).join(", ")}
              </dd>
            </div>
          ) : null}
        </dl>

        <div className="mt-4 flex flex-wrap gap-2">
          <a
            href={`mailto:${pedido.cliente_email}?subject=${encodeURIComponent(`Tu pedido ${pedido.numero} · Fieltromanía`)}`}
            className="inline-flex min-h-11 items-center gap-2 rounded-control border border-line-soft px-4 text-sm font-semibold transition-colors hover:bg-surface-2"
          >
            <Mail className="size-4" aria-hidden="true" />
            Escribir correo
          </a>
          {whatsapp ? (
            <a
              href={`https://wa.me/${whatsapp}?text=${mensaje}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex min-h-11 items-center gap-2 rounded-control border border-line-soft px-4 text-sm font-semibold transition-colors hover:bg-surface-2"
            >
              <MessageCircle className="size-4" aria-hidden="true" />
              WhatsApp
            </a>
          ) : null}
          {pedido.cliente_telefono ? (
            <a
              href={`tel:${pedido.cliente_telefono.replace(/\s/g, "")}`}
              className="inline-flex min-h-11 items-center gap-2 rounded-control border border-line-soft px-4 text-sm font-semibold transition-colors hover:bg-surface-2"
            >
              <Phone className="size-4" aria-hidden="true" />
              Llamar
            </a>
          ) : null}
        </div>
      </section>

      <section className="mt-5 rounded-card border border-line-soft bg-surface p-5">
        <h2 className="text-base font-bold tracking-tight">Qué encargó</h2>
        <ul className="mt-3 divide-y divide-line-soft">
          {pedido.pedido_items.map((item) => {
            const personalizacion = (item.personalizacion ?? {}) as Record<string, string>;
            const entradas = Object.entries(personalizacion);

            return (
              <li key={item.id} className="py-3 first:pt-0 last:pb-0">
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <p className="font-semibold">
                    {item.cantidad} × {item.nombre}
                  </p>
                  <p className="font-semibold tabular-nums">
                    {formatearPrecio(item.precio_unitario * item.cantidad)}
                  </p>
                </div>

                {entradas.length ? (
                  <dl className="mt-2 grid gap-1 rounded-control bg-violeta-tenue px-3 py-2 text-sm">
                    {entradas.map(([pregunta, respuesta]) => (
                      <div key={pregunta} className="flex flex-wrap gap-x-2">
                        <dt className="text-ink-muted">{pregunta}:</dt>
                        <dd className="font-semibold text-ink">{respuesta}</dd>
                      </div>
                    ))}
                  </dl>
                ) : null}
              </li>
            );
          })}
        </ul>

        <p className="mt-4 flex items-baseline justify-between border-t border-line-soft pt-3 text-base font-bold">
          <span>Total</span>
          <span className="tabular-nums">{formatearPrecio(pedido.total)}</span>
        </p>
      </section>

      <section className="mt-5 rounded-card border border-line-soft bg-surface p-5">
        <h2 className="text-base font-bold tracking-tight">Estado</h2>
        <p className="mt-1 text-sm text-ink-muted">
          Cambiarlo no le avisa al cliente. Es para tu orden interna.
        </p>
        <ul className="mt-3 flex flex-wrap gap-2">
          {Object.entries(ETIQUETA_PEDIDO).map(([valor, texto]) => (
            <li key={valor}>
              <form action={cambiarEstadoPedido}>
                <input type="hidden" name="id" value={pedido.id} />
                <input type="hidden" name="estado" value={valor} />
                <button
                  type="submit"
                  aria-pressed={pedido.estado === valor}
                  className={cn(
                    "inline-flex min-h-10 items-center rounded-pill px-3.5 text-sm font-medium transition-colors duration-150",
                    pedido.estado === valor
                      ? "bg-violeta text-[oklch(0.17_0.022_292)]"
                      : "border border-line-soft text-ink-muted hover:border-ink-muted hover:text-ink",
                  )}
                >
                  {texto}
                </button>
              </form>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-5 rounded-card border border-line-soft bg-surface p-5">
        <h2 className="text-base font-bold tracking-tight">Notas</h2>
        <p className="mt-1 text-sm text-ink-muted">
          Lo que escribió el cliente al pedir, y lo que quieras anotar tú.
        </p>
        <form action={guardarNotaPedido} className="mt-3 grid gap-3">
          <input type="hidden" name="id" value={pedido.id} />
          <label htmlFor="notas" className="sr-only">
            Notas del pedido
          </label>
          <AreaTexto
            id="notas"
            name="notas"
            rows={4}
            defaultValue={pedido.notas ?? ""}
          />
          <div className="flex justify-end">
            <BotonPanel type="submit" variante="neutro">
              Guardar nota
            </BotonPanel>
          </div>
        </form>
      </section>
    </main>
  );
}

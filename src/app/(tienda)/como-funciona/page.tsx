import type { Metadata } from "next";
import Link from "next/link";

import { Bloque, PaginaContenido } from "@/components/tienda/pagina-contenido";
import { obtenerPasos } from "@/lib/contenido";

export const metadata: Metadata = {
  title: "Cómo funciona el pedido",
  description:
    "Así se encarga un producto hecho a mano en Fieltromanía: eliges, personalizas, te contactamos y acordamos el pago y la entrega.",
  alternates: { canonical: "/como-funciona" },
};

export const revalidate = 300;

export default async function ComoFunciona() {
  const pasos = await obtenerPasos();

  return (
    <PaginaContenido
      titulo="Es un encargo, no una compra al paso"
      bajada="Todo lo que vendemos se hace a mano después de que lo pides. Por eso conversamos contigo antes de cobrar nada."
    >
      <ol className="grid gap-6">
        {pasos.map((paso, i) => (
          <li key={paso.id} className="flex gap-4">
            <span
              aria-hidden="true"
              className="grid size-11 shrink-0 place-items-center rounded-pill border-2 border-line bg-naranja font-display text-lg font-extrabold text-ink-fijo"
            >
              {i + 1}
            </span>
            <div>
              <h2 className="font-display text-lg font-bold tracking-tight">
                {paso.titulo}
              </h2>
              <p className="mt-1 text-ink-muted">{paso.texto}</p>
            </div>
          </li>
        ))}
      </ol>

      <Bloque titulo="¿Por qué no se paga en el sitio?">
        <p>
          Porque cada pedido es distinto. El despacho depende de tu comuna, algunos
          productos llevan modificaciones que conversamos contigo, y preferimos
          confirmar que todo esté bien antes de que gastes tu dinero.
        </p>
        <p>
          Es más lento que apretar un botón, pero significa que hay una persona
          revisando tu pedido.
        </p>
      </Bloque>

      <Bloque titulo="¿Y si me arrepiento?">
        <p>
          Mientras no hayas pagado, no hay compromiso. Nos avisas y listo. Una vez
          confeccionado un producto personalizado no podemos revenderlo, así que
          te pedimos que revises bien los datos antes de confirmar.
        </p>
      </Bloque>

      <p>
        <Link
          href="/productos"
          className="inline-flex min-h-12 items-center rounded-control border-2 border-line bg-naranja px-5 font-display font-bold text-ink-fijo"
        >
          Ver el catálogo
        </Link>
      </p>
    </PaginaContenido>
  );
}

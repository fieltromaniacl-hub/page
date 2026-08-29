import { ArrowRight } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

import { PaginaContenido } from "@/components/tienda/pagina-contenido";
import { obtenerAjustes, obtenerPasos } from "@/lib/contenido";

export const revalidate = 300;

export async function generateMetadata(): Promise<Metadata> {
  const ajustes = await obtenerAjustes();
  return {
    title: "Cómo funciona el pedido",
    description: ajustes.comofunciona_bajada,
    alternates: { canonical: "/como-funciona" },
  };
}

/**
 * El proceso del pedido, paso a paso.
 *
 * Todo lo que hay aquí sale del panel: el encabezado son dos ajustes y los
 * pasos vienen de la tabla `pasos`, la misma que resume la portada.
 *
 * Antes esta página repetía dos secciones que también viven en
 * /condiciones-de-pago y /terminos, escritas a mano. Eran las mismas palabras
 * en dos sitios, uno editable y otro no: el día que ella cambiara la versión
 * editable, esta la habría contradicho sin que nadie se enterara. Ahora se
 * enlazan en vez de copiarse.
 */
export default async function ComoFunciona() {
  const [ajustes, pasos] = await Promise.all([obtenerAjustes(), obtenerPasos()]);

  return (
    <PaginaContenido
      titulo={ajustes.comofunciona_titulo}
      bajada={ajustes.comofunciona_bajada}
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

      <nav aria-label="Más sobre el pedido" className="grid gap-2">
        {[
          {
            href: "/condiciones-de-pago",
            texto: "Cómo se paga",
            detalle: "Formas de pago y por qué no se cobra en el sitio",
          },
          {
            href: "/terminos",
            texto: "Términos y condiciones",
            detalle: "Qué pasa si te arrepientes o si algo llega mal",
          },
        ].map((enlace) => (
          <Link
            key={enlace.href}
            href={enlace.href}
            className="flex min-h-14 items-center gap-3 rounded-control border-2 border-line bg-surface px-4 py-3 transition-[translate,box-shadow] duration-200 ease-[var(--ease-salida)] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-solida motion-reduce:hover:translate-x-0 motion-reduce:hover:translate-y-0"
          >
            <span className="min-w-0 flex-1">
              <span className="block font-display font-bold text-ink">
                {enlace.texto}
              </span>
              <span className="block text-sm text-ink-muted">{enlace.detalle}</span>
            </span>
            <ArrowRight className="size-4 shrink-0 text-ink-muted" aria-hidden="true" />
          </Link>
        ))}
      </nav>

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

import type { Metadata } from "next";
import Link from "next/link";

import { Bloque, PaginaContenido } from "@/components/tienda/pagina-contenido";

export const metadata: Metadata = {
  title: "Quiénes somos",
  description:
    "Fieltromanía es un taller chileno que cose a mano libros de fieltro y juguetes educativos para niños de 1 a 7 años.",
  alternates: { canonical: "/nosotros" },
};

export default function Nosotros() {
  return (
    <PaginaContenido
      titulo="Un taller, no una fábrica"
      bajada="Fieltromanía es un emprendimiento chileno dedicado a los libros de fieltro artesanales y los juguetes educativos para la primera infancia."
    >
      <Bloque titulo="Qué hacemos">
        <p>
          Cortamos y cosemos a mano libros de estimulación para niños de 1 a 7
          años, además de letreros personalizados, sujeta cortinas y recuerdos
          para eventos.
        </p>
        <p>
          Cada libro se arma pieza por pieza. No hay dos idénticos, porque casi
          todos llevan el nombre de un niño en particular y los colores que
          eligió su familia.
        </p>
      </Bloque>

      <Bloque titulo="Por qué fieltro">
        <p>
          El fieltro no se deshilacha al cortarlo, aguanta el uso rudo de las
          manos pequeñas y es suave al tacto. Trabajamos con materiales sin
          tóxicos, seguros para una edad en que todo termina en la boca.
        </p>
        <p>
          Además dura años. Un libro de fieltro pasa de un hermano al siguiente,
          y eso es exactamente lo contrario del juguete de plástico que se rompe
          en una semana.
        </p>
      </Bloque>

      <Bloque titulo="Juego con propósito">
        <p>
          Cada página trabaja algo distinto: abrochar botones para la motricidad
          fina, secuencias para el pensamiento lógico, solapas para la
          permanencia del objeto. No es decoración: está pensado para acompañar
          una etapa concreta del desarrollo.
        </p>
        <p>
          Por eso el catálogo se puede filtrar por edad. Un libro que le sirve a
          un niño de dos años aburre a uno de seis, y al revés lo frustra.
        </p>
      </Bloque>

      <Bloque titulo="Dónde encontrarnos">
        <p>
          Estamos en{" "}
          <a
            href="https://www.facebook.com/fieltromania.cl"
            target="_blank"
            rel="noreferrer"
            className="font-semibold text-violeta-txt underline underline-offset-2"
          >
            Facebook
          </a>{" "}
          e{" "}
          <a
            href="https://www.instagram.com/fieltromania_chile/"
            target="_blank"
            rel="noreferrer"
            className="font-semibold text-violeta-txt underline underline-offset-2"
          >
            Instagram
          </a>
          , donde publicamos lo que va saliendo del taller.
        </p>
      </Bloque>

      <p>
        <Link
          href="/productos"
          className="inline-flex min-h-12 items-center rounded-control border-2 border-line bg-naranja px-5 font-display font-bold text-ink-fijo"
        >
          Ver lo que hacemos
        </Link>
      </p>
    </PaginaContenido>
  );
}

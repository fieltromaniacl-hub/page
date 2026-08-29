import { Mail, MessageCircle } from "lucide-react";
import type { Metadata } from "next";

import { Bloque, PaginaContenido } from "@/components/tienda/pagina-contenido";

export const metadata: Metadata = {
  title: "Contacto",
  description:
    "Escríbenos por WhatsApp, correo o redes sociales. Te ayudamos a elegir el producto adecuado para la edad de tu hijo.",
  alternates: { canonical: "/contacto" },
};

const CORREO = "fieltromania.cl@gmail.com";

export default function Contacto() {
  const whatsapp = process.env.NEXT_PUBLIC_WHATSAPP;

  return (
    <PaginaContenido
      titulo="Hablemos"
      bajada="Cuéntanos la edad del niño y qué buscas, y te ayudamos a elegir. Respondemos en horario hábil."
    >
      <div className="flex flex-wrap gap-3">
        {whatsapp ? (
          <a
            href={`https://wa.me/${whatsapp}`}
            target="_blank"
            rel="noreferrer"
            className="inline-flex min-h-12 items-center gap-2 rounded-control border-2 border-line bg-naranja px-5 font-display font-bold text-[oklch(0.17_0.022_292)]"
          >
            <MessageCircle className="size-5" aria-hidden="true" />
            WhatsApp
          </a>
        ) : null}

        <a
          href={`mailto:${CORREO}`}
          className="inline-flex min-h-12 items-center gap-2 rounded-control border-2 border-line bg-surface px-5 font-display font-bold"
        >
          <Mail className="size-5" aria-hidden="true" />
          {CORREO}
        </a>
      </div>

      <Bloque titulo="Redes">
        <p>
          Publicamos lo que sale del taller en{" "}
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
          . Por ahí también puedes escribirnos.
        </p>
      </Bloque>

      <Bloque titulo="Si ya hiciste un pedido">
        <p>
          Ten a mano el número que empieza con <strong>FM-</strong>: viene en el
          correo de confirmación y nos permite encontrarlo al instante.
        </p>
      </Bloque>

      <Bloque titulo="Pedidos grandes">
        <p>
          Para souvenirs de cumpleaños, bautizos o pedidos de jardines
          infantiles, escríbenos con la cantidad y la fecha. Cotizamos por
          volumen.
        </p>
      </Bloque>
    </PaginaContenido>
  );
}

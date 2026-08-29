import { Mail } from "lucide-react";
import type { Metadata } from "next";

import { EnlaceWhatsapp } from "@/components/tienda/enlace-whatsapp";
import { Bloque, PaginaContenido } from "@/components/tienda/pagina-contenido";
import { obtenerAjustes } from "@/lib/contenido";
import { REDES } from "@/lib/redes";

export const metadata: Metadata = {
  title: "Contacto",
  description:
    "Escríbenos por WhatsApp, correo o redes sociales. Te ayudamos a elegir el producto adecuado para la edad de tu hijo.",
  alternates: { canonical: "/contacto" },
};

export default async function Contacto() {
  const ajustes = await obtenerAjustes();
  const CORREO = ajustes.contacto_email;

  return (
    <PaginaContenido
      titulo="Hablemos"
      bajada={`Cuéntanos la edad del niño y qué buscas, y te ayudamos a elegir. ${ajustes.contacto_horario}`}
    >
      <div className="flex flex-wrap gap-3">
        <EnlaceWhatsapp
          variante="fuerte"
          mensaje="Hola, vengo del sitio y quiero hacer una consulta."
        >
          Escribirnos por WhatsApp
        </EnlaceWhatsapp>

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
          {REDES.map((red, i) => (
            <span key={red.nombre}>
              {i > 0 ? (i === REDES.length - 1 ? " y " : ", ") : ""}
              <a
                href={red.href}
                target="_blank"
                rel="noreferrer"
                className="font-semibold text-violeta-txt underline underline-offset-2"
              >
                {red.nombre}
              </a>
            </span>
          ))}
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

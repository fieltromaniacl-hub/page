import { Encabezado } from "@/components/layout/encabezado";
import { AvisoTienda } from "@/components/tienda/aviso";
import { Pie } from "@/components/layout/pie";
import { HidratarCarrito } from "@/lib/carrito/hidratar";

import { obtenerAjustes } from "@/lib/contenido";
import { urlSitio } from "@/lib/utils";

const SITIO = urlSitio();

/**
 * Identidad de la marca para buscadores y asistentes de IA. Va en el layout
 * para que aparezca en todas las páginas públicas sin repetirlo en cada una.
 */
const identidadDe = (email: string) => ({
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Fieltromanía",
  url: SITIO,
  description:
    "Taller chileno de libros de fieltro artesanales y juguetes educativos personalizados para niños de 1 a 7 años.",
  areaServed: { "@type": "Country", name: "Chile" },
  email,
  sameAs: [
    "https://www.facebook.com/fieltromania.cl",
    "https://www.instagram.com/fieltromania_chile/",
  ],
});

export default async function LayoutTienda({ children }: LayoutProps<"/">) {
  const ajustes = await obtenerAjustes();
  const IDENTIDAD = identidadDe(ajustes.contacto_email);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(IDENTIDAD) }}
      />
      <HidratarCarrito />
      <AvisoTienda />
      <Encabezado />
      <main id="contenido" className="flex-1">
        {children}
      </main>
      <Pie />
    </>
  );
}

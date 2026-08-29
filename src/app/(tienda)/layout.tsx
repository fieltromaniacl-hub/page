import { Encabezado } from "@/components/layout/encabezado";
import { Pie } from "@/components/layout/pie";
import { HidratarCarrito } from "@/lib/carrito/hidratar";

import { urlSitio } from "@/lib/utils";

const SITIO = urlSitio();

/**
 * Identidad de la marca para buscadores y asistentes de IA. Va en el layout
 * para que aparezca en todas las páginas públicas sin repetirlo en cada una.
 */
const IDENTIDAD = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Fieltromanía",
  url: SITIO,
  description:
    "Taller chileno de libros de fieltro artesanales y juguetes educativos personalizados para niños de 1 a 7 años.",
  areaServed: { "@type": "Country", name: "Chile" },
  email: "fieltromania.cl@gmail.com",
  sameAs: [
    "https://www.facebook.com/fieltromania.cl",
    "https://www.instagram.com/fieltromania_chile/",
  ],
};

export default function LayoutTienda({ children }: LayoutProps<"/">) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(IDENTIDAD) }}
      />
      <HidratarCarrito />
      <Encabezado />
      <main id="contenido" className="flex-1">
        {children}
      </main>
      <Pie />
    </>
  );
}

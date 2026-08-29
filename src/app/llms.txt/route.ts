import { obtenerCategorias, obtenerProductos, rangoEdad } from "@/lib/consultas";
import { formatearPrecio, urlSitio } from "@/lib/utils";

const SITIO = urlSitio();

export const revalidate = 3600;

/**
 * /llms.txt — convención emergente para que los modelos de lenguaje entiendan
 * un sitio sin tener que interpretar su HTML.
 *
 * No reemplaza a los datos estructurados de cada ficha: los complementa dando
 * el panorama completo del catálogo en un solo documento legible.
 */
export async function GET() {
  const [productos, categorias] = await Promise.all([
    obtenerProductos(),
    obtenerCategorias(),
  ]);

  const porCategoria = categorias
    .map((c) => `- ${c.nombre}: ${c.descripcion ?? ""}`.trim())
    .join("\n");

  const listado = productos
    .map((p) => {
      const edad = rangoEdad(p.edad_min, p.edad_max);
      const disponibilidad =
        p.stock === "agotado"
          ? "agotado"
          : p.stock === "por_encargo"
            ? "se fabrica a pedido"
            : "disponible";

      return [
        `### ${p.nombre}`,
        `- Precio: ${formatearPrecio(p.precio)} CLP`,
        edad ? `- Edad recomendada: ${edad}` : null,
        `- Disponibilidad: ${disponibilidad}`,
        p.resumen ? `- Descripción: ${p.resumen}` : null,
        `- Página: ${SITIO}/productos/${p.slug}`,
      ]
        .filter(Boolean)
        .join("\n");
    })
    .join("\n\n");

  const texto = `# Fieltromanía

> Taller chileno que cose a mano libros de fieltro y juguetes educativos
> personalizados para niños de 1 a 7 años.

## Qué es esto

Fieltromanía fabrica a mano, en Chile, libros de estimulación en fieltro
(quiet books), letreros personalizados, sujeta cortinas y recuerdos para
eventos. Casi todos los productos se personalizan con el nombre del niño y los
colores que elija la familia.

Los materiales son sin tóxicos y aptos para la primera infancia. Cada página de
los libros trabaja una habilidad concreta del desarrollo: motricidad fina,
secuencias, reconocimiento de colores, permanencia del objeto, lectura temprana.

## Cómo se compra

El sitio **no cobra en línea**. El cliente arma su pedido, indica los datos de
personalización y deja su contacto; el taller se comunica después para acordar
la forma de pago y el despacho. Los productos se confeccionan una vez acordado
el pedido, así que hay un plazo de fabricación indicado en cada ficha.

Se despacha a todo Chile. Precios en pesos chilenos (CLP), sin decimales.

## Categorías

${porCategoria}

## Catálogo

${listado || "El catálogo se está preparando. Aún no hay productos publicados."}

## Páginas útiles

- Catálogo completo: ${SITIO}/productos
- Cómo funciona el pedido: ${SITIO}/como-funciona
- Quiénes somos: ${SITIO}/nosotros
- Envíos y plazos: ${SITIO}/envios
- Cuidado de los productos: ${SITIO}/cuidados
- Contacto: ${SITIO}/contacto

## Contacto

- Correo: fieltromania.cl@gmail.com
- Facebook: https://www.facebook.com/fieltromania.cl
- Instagram: https://www.instagram.com/fieltromania_chile/
`;

  return new Response(texto, {
    headers: {
      "content-type": "text/plain; charset=utf-8",
      "cache-control": "public, max-age=0, s-maxage=3600",
    },
  });
}

import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { FormularioPersonalizacion } from "@/components/tienda/formulario-personalizacion";
import { EnlaceWhatsapp } from "@/components/tienda/enlace-whatsapp";
import { Galeria } from "@/components/tienda/galeria";
import { InsigniaDisponibilidad } from "@/components/tienda/insignias";
import {
  obtenerProducto,
  obtenerSlugsDeProductos,
  rangoEdad,
} from "@/lib/consultas";
import { obtenerAjustes } from "@/lib/contenido";
import { formatearPrecio, urlSitio } from "@/lib/utils";

export const revalidate = 300;

export async function generateStaticParams() {
  const productos = await obtenerSlugsDeProductos();
  return productos.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/productos/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const producto = await obtenerProducto(slug);

  if (!producto) return { title: "Producto no encontrado" };

  const descripcion =
    producto.seo_descripcion ??
    producto.resumen ??
    `${producto.nombre}, hecho a mano en Chile por Fieltromanía.`;

  const portada = producto.producto_imagenes[0];

  return {
    title: producto.seo_titulo ?? producto.nombre,
    description: descripcion,
    alternates: { canonical: `/productos/${producto.slug}` },
    openGraph: {
      type: "website",
      title: producto.seo_titulo ?? producto.nombre,
      description: descripcion,
      url: `/productos/${producto.slug}`,
      images: portada
        ? [{ url: portada.url, alt: portada.alt || producto.nombre }]
        : undefined,
    },
  };
}

export default async function FichaProducto({
  params,
}: PageProps<"/productos/[slug]">) {
  const { slug } = await params;
  const [producto, ajustes] = await Promise.all([
    obtenerProducto(slug),
    obtenerAjustes(),
  ]);

  if (!producto) notFound();

  const edad = rangoEdad(producto.edad_min, producto.edad_max);
  const portada = producto.producto_imagenes[0] ?? null;

  const disponibilidadSchema =
    producto.stock === "agotado"
      ? "https://schema.org/OutOfStock"
      : producto.stock === "por_encargo"
        ? "https://schema.org/PreOrder"
        : "https://schema.org/InStock";

  /**
   * Datos estructurados. Es lo que permite que Google muestre el precio y la
   * disponibilidad en los resultados, y lo que leen los asistentes de IA para
   * entender qué se vende aquí.
   */
  const schema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: producto.nombre,
    description: producto.resumen ?? producto.descripcion ?? undefined,
    image: producto.producto_imagenes.map((i) => i.url),
    sku: producto.slug,
    brand: { "@type": "Brand", name: "Fieltromanía" },
    material: producto.materiales ?? undefined,
    audience: edad
      ? {
          "@type": "PeopleAudience",
          suggestedMinAge: producto.edad_min ?? undefined,
          suggestedMaxAge: producto.edad_max ?? undefined,
        }
      : undefined,
    offers: {
      "@type": "Offer",
      price: producto.precio,
      priceCurrency: "CLP",
      availability: disponibilidadSchema,
      itemCondition: "https://schema.org/NewCondition",
      seller: { "@type": "Organization", name: "Fieltromanía" },
    },
  };

  // Schema.org exige URLs absolutas en `item`: con rutas relativas Google
  // descarta el bloque entero y no muestra las migas en los resultados.
  const sitio = urlSitio();
  const migas = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Inicio", item: sitio },
      {
        "@type": "ListItem",
        position: 2,
        name: "Catálogo",
        item: `${sitio}/productos`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: producto.nombre,
        item: `${sitio}/productos/${producto.slug}`,
      },
    ],
  };

  const ficha = [
    { titulo: "Materiales", valor: producto.materiales },
    { titulo: "Medidas", valor: producto.medidas },
    { titulo: "Cuidados", valor: producto.cuidados },
  ].filter((f) => f.valor);

  return (
    <div className="mx-auto max-w-[76rem] px-4 py-8 sm:px-6 lg:py-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(migas) }}
      />

      <nav aria-label="Migas de pan" className="text-sm">
        <ol className="flex flex-wrap items-center gap-1.5 text-ink-muted">
          <li>
            <Link href="/" className="hover:text-violeta-txt hover:underline">
              Inicio
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li>
            <Link href="/productos" className="hover:text-violeta-txt hover:underline">
              Catálogo
            </Link>
          </li>
          {producto.categorias ? (
            <>
              <li aria-hidden="true">/</li>
              <li>
                <Link
                  href={`/productos?categoria=${producto.categorias.slug}`}
                  className="hover:text-violeta-txt hover:underline"
                >
                  {producto.categorias.nombre}
                </Link>
              </li>
            </>
          ) : null}
        </ol>
      </nav>

      <div className="mt-6 grid gap-10 lg:grid-cols-2 lg:gap-14">
        <Galeria fotos={producto.producto_imagenes} nombre={producto.nombre} />

        <div>
          {edad ? (
            <p className="inline-flex items-center rounded-pill border-2 border-line bg-violeta-tenue px-3 py-1 font-display text-sm font-bold text-violeta-txt">
              {edad}
            </p>
          ) : null}

          <h1 className="mt-3 text-[length:var(--text-titulo)] leading-[1.05] [overflow-wrap:break-word]">
            {producto.nombre}
          </h1>

          {producto.resumen ? (
            <p className="mt-3 max-w-[55ch] text-[length:var(--text-sub)] leading-relaxed text-ink-muted">
              {producto.resumen}
            </p>
          ) : null}

          <div className="mt-5 flex flex-wrap items-baseline gap-x-3 gap-y-2">
            <p className="font-display text-3xl font-extrabold tabular-nums">
              {formatearPrecio(producto.precio)}
            </p>
            {producto.precio_antes ? (
              <p className="text-lg text-ink-muted line-through tabular-nums">
                {formatearPrecio(producto.precio_antes)}
              </p>
            ) : null}
            <InsigniaDisponibilidad stock={producto.stock} />
          </div>

          {producto.dias_confeccion ? (
            <p className="mt-2 text-sm text-ink-muted">
              Se confecciona en aproximadamente {producto.dias_confeccion} días
              desde que acordamos el pedido.
            </p>
          ) : null}

          <hr className="my-7 border-t-2 border-line-soft" />

          <FormularioPersonalizacion
            producto={{
              id: producto.id,
              slug: producto.slug,
              nombre: producto.nombre,
              precio: producto.precio,
              stock: producto.stock,
              imagen: portada?.url ?? null,
            }}
            campos={producto.producto_campos}
          />

          <p className="mt-5 rounded-control border-2 border-line bg-surface-2 px-4 py-3 text-sm">
            {ajustes.pago_promesa}
          </p>

          <div className="mt-4 flex flex-wrap items-center gap-3">
            <p className="text-sm text-ink-muted">¿Tienes alguna duda?</p>
            <EnlaceWhatsapp
              mensaje={`Hola, tengo una consulta sobre «${producto.nombre}».`}
            >
              Pregúntanos
            </EnlaceWhatsapp>
          </div>
        </div>
      </div>

      {producto.descripcion || producto.habilidades.length || ficha.length ? (
        <div className="mt-14 grid gap-10 border-t-[3px] border-line pt-10 lg:grid-cols-2 lg:gap-14">
          {producto.descripcion ? (
            <section>
              <h2 className="text-[length:var(--text-seccion)]">Sobre este producto</h2>
              <div className="mt-4 grid gap-4 text-[length:1.0625rem] leading-relaxed text-ink-muted">
                {producto.descripcion.split("\n\n").map((parrafo, i) => (
                  <p key={i}>{parrafo}</p>
                ))}
              </div>
            </section>
          ) : null}

          <div className="grid gap-8">
            {producto.habilidades.length ? (
              <section>
                <h2 className="text-[length:var(--text-seccion)]">Qué trabaja</h2>
                <ul className="mt-4 flex flex-wrap gap-2">
                  {producto.habilidades.map((habilidad) => (
                    <li
                      key={habilidad}
                      className="rounded-pill border-2 border-line bg-verde-tenue px-3 py-1 font-display text-sm font-bold text-verde-txt"
                    >
                      {habilidad}
                    </li>
                  ))}
                </ul>
              </section>
            ) : null}

            {ficha.length ? (
              <section>
                <h2 className="text-[length:var(--text-seccion)]">Ficha</h2>
                <dl className="mt-4 grid gap-3">
                  {ficha.map((f) => (
                    <div key={f.titulo}>
                      <dt className="font-display font-bold">{f.titulo}</dt>
                      <dd className="mt-0.5 text-ink-muted">{f.valor}</dd>
                    </div>
                  ))}
                </dl>
              </section>
            ) : null}
          </div>
        </div>
      ) : null}
    </div>
  );
}

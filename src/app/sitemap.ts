import type { MetadataRoute } from "next";

import { obtenerCategorias, obtenerSlugsDeProductos } from "@/lib/consultas";
import { obtenerSlugsDePaginas } from "@/lib/contenido";

import { urlSitio } from "@/lib/utils";

const SITIO = urlSitio();

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [productos, categorias, paginas] = await Promise.all([
    obtenerSlugsDeProductos(),
    obtenerCategorias(),
    obtenerSlugsDePaginas(),
  ]);

  const fijas: MetadataRoute.Sitemap = [
    { url: SITIO, changeFrequency: "weekly", priority: 1 },
    { url: `${SITIO}/productos`, changeFrequency: "daily", priority: 0.9 },
    { url: `${SITIO}/como-funciona`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${SITIO}/contacto`, changeFrequency: "monthly", priority: 0.6 },
  ];

  return [
    ...fijas,
    // Cualquier página que ella cree en el panel entra sola al sitemap.
    ...paginas.map((p) => ({
      url: `${SITIO}/${p.slug}`,
      lastModified: new Date(p.actualizado_en),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
    ...categorias.map((c) => ({
      url: `${SITIO}/productos?categoria=${c.slug}`,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })),
    ...productos.map((p) => ({
      url: `${SITIO}/productos/${p.slug}`,
      lastModified: new Date(p.actualizado_en),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
  ];
}

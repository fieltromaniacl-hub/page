import type { MetadataRoute } from "next";

import { obtenerCategorias, obtenerSlugsDeProductos } from "@/lib/consultas";

import { urlSitio } from "@/lib/utils";

const SITIO = urlSitio();

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [productos, categorias] = await Promise.all([
    obtenerSlugsDeProductos(),
    obtenerCategorias(),
  ]);

  const fijas: MetadataRoute.Sitemap = [
    { url: SITIO, changeFrequency: "weekly", priority: 1 },
    { url: `${SITIO}/productos`, changeFrequency: "daily", priority: 0.9 },
    { url: `${SITIO}/como-funciona`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${SITIO}/nosotros`, changeFrequency: "monthly", priority: 0.6 },
    { url: `${SITIO}/envios`, changeFrequency: "monthly", priority: 0.5 },
    { url: `${SITIO}/cuidados`, changeFrequency: "monthly", priority: 0.5 },
    { url: `${SITIO}/contacto`, changeFrequency: "monthly", priority: 0.6 },
  ];

  return [
    ...fijas,
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

import type { MetadataRoute } from "next";

import { urlSitio } from "@/lib/utils";

const SITIO = urlSitio();

/**
 * Los rastreadores de IA se permiten de forma explícita.
 *
 * Muchos sitios los bloquean por reflejo. Aquí conviene lo contrario: cuando
 * alguien le pregunta a un asistente «dónde compro un libro de fieltro
 * personalizado en Chile», queremos que Fieltromanía sea una respuesta posible.
 * Es un canal de venta, no una fuga de información: el catálogo es público.
 */
const RASTREADORES_IA = [
  "GPTBot",
  "OAI-SearchBot",
  "ChatGPT-User",
  "ClaudeBot",
  "Claude-User",
  "Claude-SearchBot",
  "PerplexityBot",
  "Perplexity-User",
  "Google-Extended",
  "Applebot-Extended",
  "meta-externalagent",
  "Bytespider",
  "CCBot",
];

export default function robots(): MetadataRoute.Robots {
  // El panel y el carrito no tienen nada que indexar.
  const prohibido = ["/admin", "/admin/", "/carrito"];

  return {
    rules: [
      { userAgent: "*", allow: "/", disallow: prohibido },
      ...RASTREADORES_IA.map((agente) => ({
        userAgent: agente,
        allow: "/",
        disallow: prohibido,
      })),
    ],
    sitemap: `${SITIO}/sitemap.xml`,
    host: SITIO,
  };
}

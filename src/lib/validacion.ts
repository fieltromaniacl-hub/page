import { z } from "zod";

/** Convierte "Libro Mi Primer Bosque" en "libro-mi-primer-bosque". */
export function generarSlug(texto: string) {
  return texto
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // quita tildes
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

/** Campo de texto opcional: "" del formulario se guarda como null, no como "". */
const textoOpcional = z
  .string()
  .trim()
  .transform((v) => (v === "" ? null : v))
  .nullable();

/** Entero opcional que acepta "" del formulario. */
const enteroOpcional = z
  .string()
  .trim()
  .transform((v) => (v === "" ? null : Number(v)))
  .nullable()
  .refine((v) => v === null || (Number.isInteger(v) && v >= 0), {
    message: "Debe ser un número entero.",
  });

export const esquemaProducto = z
  .object({
    nombre: z.string().trim().min(2, "Ponle un nombre al producto."),
    slug: z
      .string()
      .trim()
      .regex(
        /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
        "La dirección solo admite minúsculas, números y guiones.",
      ),
    resumen: textoOpcional,
    descripcion: textoOpcional,

    precio: z.coerce
      .number()
      .int("El precio va en pesos enteros, sin decimales.")
      .min(0, "El precio no puede ser negativo."),
    precio_antes: enteroOpcional,

    categoria_id: z
      .string()
      .transform((v) => (v === "" ? null : v))
      .nullable(),

    estado: z.enum(["activo", "inactivo", "archivado"]),
    stock: z.enum(["disponible", "por_encargo", "agotado"]),
    cantidad: enteroOpcional,

    destacado: z.coerce.boolean(),
    orden: z.coerce.number().int().default(0),

    edad_min: enteroOpcional,
    edad_max: enteroOpcional,
    materiales: textoOpcional,
    medidas: textoOpcional,
    cuidados: textoOpcional,
    dias_confeccion: enteroOpcional,
    habilidades: z
      .string()
      .transform((v) =>
        v
          .split(",")
          .map((h) => h.trim())
          .filter(Boolean),
      )
      .default([]),

    seo_titulo: textoOpcional,
    seo_descripcion: textoOpcional,
  })
  .refine(
    (d) => d.precio_antes === null || d.precio_antes > d.precio,
    {
      message: "El precio anterior debe ser mayor que el actual.",
      path: ["precio_antes"],
    },
  )
  .refine(
    (d) => d.edad_min === null || d.edad_max === null || d.edad_min <= d.edad_max,
    { message: "La edad mínima no puede superar a la máxima.", path: ["edad_max"] },
  );

export const esquemaCampo = z
  .object({
    etiqueta: z.string().trim().min(1, "La pregunta necesita un texto."),
    ayuda: textoOpcional,
    tipo: z.enum(["texto", "parrafo", "opcion", "color", "numero"]),
    opciones: z
      .string()
      .transform((v) =>
        v
          .split("\n")
          .map((o) => o.trim())
          .filter(Boolean),
      )
      .default([]),
    requerido: z.coerce.boolean(),
    max_largo: enteroOpcional,
    orden: z.coerce.number().int().default(0),
  })
  .refine(
    (d) => !["opcion", "color"].includes(d.tipo) || d.opciones.length > 0,
    {
      message: "Escribe al menos una alternativa, una por línea.",
      path: ["opciones"],
    },
  );

/** Errores por campo, en la forma que consumen los formularios del panel. */
export type ErroresCampo = Record<string, string>;

export function aplanarErrores(error: z.ZodError): ErroresCampo {
  const salida: ErroresCampo = {};
  for (const problema of error.issues) {
    const clave = problema.path.join(".") || "_";
    salida[clave] ??= problema.message;
  }
  return salida;
}

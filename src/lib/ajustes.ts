/**
 * Catálogo de ajustes de la tienda.
 *
 * Las claves viven aquí y no en la base a propósito: el panel se construye
 * desde este objeto, así que ella ve «Qué prometemos sobre el pago» con su
 * texto de ayuda, y no una fila llamada `pago_promesa`. Añadir un ajuste es
 * una línea aquí; no hace falta migración ni tocar el panel.
 *
 * `porDefecto` es lo que la tienda muestra mientras nadie haya escrito nada.
 * Es el texto que estaba antes en el código, así que el sitio nunca queda en
 * blanco por una fila que falta.
 */

export type TipoAjuste = "texto" | "parrafo" | "correo";

export type DefinicionAjuste = {
  etiqueta: string;
  ayuda: string;
  tipo: TipoAjuste;
  grupo: string;
  porDefecto: string;
  /** Dónde se ve, para que ella sepa qué está tocando antes de guardar. */
  dondeSeVe: string;
  maxLargo?: number;
};

export const AJUSTES = {
  pago_promesa: {
    etiqueta: "Qué prometemos sobre el pago",
    ayuda:
      "La frase que tranquiliza a quien está por pedir. Aparece en varios lugares del sitio y también en el correo de confirmación, así que con cambiarla aquí queda cambiada en todos.",
    tipo: "parrafo",
    grupo: "Pago y entrega",
    dondeSeVe: "Portada, ficha de producto, carrito y correo del pedido",
    maxLargo: 300,
    porDefecto:
      "No se paga nada en el sitio. Recibimos tu pedido, te escribimos y acordamos contigo el pago y la entrega.",
  },

  despacho_nota: {
    etiqueta: "Nota sobre el despacho",
    ayuda:
      "Lo que se lee bajo el total del carrito, antes de enviar el pedido. Sirve para que nadie crea que el precio que ve incluye el envío.",
    tipo: "texto",
    grupo: "Pago y entrega",
    dondeSeVe: "Carrito, bajo el total",
    maxLargo: 200,
    porDefecto:
      "El despacho se cotiza aparte según tu comuna y lo acordamos contigo.",
  },

  contacto_email: {
    etiqueta: "Correo de contacto",
    ayuda:
      "El correo que se publica en el sitio para que te escriban. No es el mismo que recibe los avisos de pedido: ese se configura aparte, en el servidor.",
    tipo: "correo",
    grupo: "Contacto",
    dondeSeVe: "Pie del sitio, página de contacto y ficha para buscadores",
    porDefecto: "fieltromania.cl@gmail.com",
  },

  contacto_horario: {
    etiqueta: "Cuándo respondemos",
    ayuda:
      "Poner un horario real evita que alguien crea que lo dejaste en visto un domingo a medianoche.",
    tipo: "texto",
    grupo: "Contacto",
    dondeSeVe: "Página de contacto",
    maxLargo: 160,
    porDefecto: "Respondemos en horario hábil, de lunes a viernes.",
  },
} as const satisfies Record<string, DefinicionAjuste>;

export type ClaveAjuste = keyof typeof AJUSTES;

/** Todos los ajustes resueltos: lo guardado, o el valor por defecto. */
export type Ajustes = Record<ClaveAjuste, string>;

export const CLAVES_AJUSTE = Object.keys(AJUSTES) as ClaveAjuste[];

/** Los grupos en el orden en que deben aparecer en el panel. */
export function ajustesPorGrupo() {
  const grupos = new Map<string, { clave: ClaveAjuste; def: DefinicionAjuste }[]>();

  for (const clave of CLAVES_AJUSTE) {
    const def = AJUSTES[clave] as DefinicionAjuste;
    const lista = grupos.get(def.grupo) ?? [];
    lista.push({ clave, def });
    grupos.set(def.grupo, lista);
  }

  return [...grupos.entries()].map(([grupo, campos]) => ({ grupo, campos }));
}

/** Valores por defecto, para cuando la base no responde o la fila no existe. */
export function ajustesPorDefecto(): Ajustes {
  const salida = {} as Ajustes;
  for (const clave of CLAVES_AJUSTE) {
    salida[clave] = (AJUSTES[clave] as DefinicionAjuste).porDefecto;
  }
  return salida;
}

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

  // ── Portada, en el orden en que se leen al bajar por la página ──────────
  portada_insignia: {
    etiqueta: "Píldora sobre el titular",
    ayuda:
      "Lo primero que se lee. Sirve para algo de temporada: «Envíos antes de Navidad», «Pedidos abiertos para marzo».",
    tipo: "texto",
    grupo: "Portada",
    dondeSeVe: "Arriba del titular, en la portada",
    maxLargo: 60,
    porDefecto: "Hecho a mano en Chile",
  },

  portada_titular: {
    etiqueta: "Titular",
    ayuda:
      "La frase grande de la portada. Es lo que decide si alguien que llega de Facebook se queda.",
    tipo: "texto",
    grupo: "Portada",
    dondeSeVe: "Titular de la portada",
    maxLargo: 90,
    porDefecto: "Un libro de fieltro con su nombre en la portada",
  },

  portada_bajada: {
    etiqueta: "Texto bajo el titular",
    ayuda: "Dos o tres líneas explicando qué se vende y para quién.",
    tipo: "parrafo",
    grupo: "Portada",
    dondeSeVe: "Bajo el titular de la portada",
    maxLargo: 260,
    porDefecto:
      "Libros de estimulación para niños de 1 a 7 años, cosidos uno por uno y personalizados para tu hijo. Cada página trabaja una habilidad distinta.",
  },

  portada_destacados_titulo: {
    etiqueta: "Título de los productos destacados",
    ayuda: "Encabeza la fila de productos. Solo se ve si hay catálogo publicado.",
    tipo: "texto",
    grupo: "Portada",
    dondeSeVe: "Sección de destacados de la portada",
    maxLargo: 70,
    porDefecto: "Lo que está saliendo del taller",
  },

  portada_promesa_titulo: {
    etiqueta: "Título del bloque de personalización",
    ayuda: "El argumento de por qué el producto vale lo que vale.",
    tipo: "texto",
    grupo: "Portada",
    dondeSeVe: "Bloque naranja de la portada",
    maxLargo: 80,
    porDefecto: "Lleva su nombre, y eso no se compra en una tienda",
  },

  portada_promesa_texto: {
    etiqueta: "Texto del bloque de personalización",
    tipo: "parrafo",
    ayuda: "Explica en qué consiste personalizar y por qué se fabrica después de pedir.",
    grupo: "Portada",
    dondeSeVe: "Bloque naranja de la portada",
    maxLargo: 320,
    porDefecto:
      "Bordamos el nombre del niño en la portada y adaptamos los colores a lo que ya tiene en su cuarto. Por eso cada libro se hace después de que lo pides: no hay dos iguales, y el tuyo todavía no existe.",
  },

  portada_etapas_titulo: {
    etiqueta: "Título de las etapas por edad",
    tipo: "texto",
    ayuda: "Encabeza las tres tarjetas de edad, que se editan más abajo.",
    grupo: "Portada",
    dondeSeVe: "Sección de etapas de la portada",
    maxLargo: 70,
    porDefecto: "Cada edad necesita un libro distinto",
  },

  portada_etapas_bajada: {
    etiqueta: "Texto de las etapas por edad",
    tipo: "parrafo",
    ayuda: "Una o dos líneas antes de las tarjetas.",
    grupo: "Portada",
    dondeSeVe: "Sección de etapas de la portada",
    maxLargo: 220,
    porDefecto:
      "No es el mismo juguete a los dos que a los seis. Elige la etapa en la que está tu hijo y te mostramos lo que le sirve.",
  },

  portada_pasos_titulo: {
    etiqueta: "Título de los pasos del pedido",
    tipo: "texto",
    ayuda: "Encabeza el resumen del proceso, que se edita más abajo.",
    grupo: "Portada",
    dondeSeVe: "Sección de pasos de la portada",
    maxLargo: 70,
    porDefecto: "Es un encargo, no una compra al paso",
  },

  portada_pasos_bajada: {
    etiqueta: "Texto de los pasos del pedido",
    tipo: "parrafo",
    ayuda: "Una o dos líneas antes de los pasos.",
    grupo: "Portada",
    dondeSeVe: "Sección de pasos de la portada",
    maxLargo: 220,
    porDefecto:
      "Los productos se hacen después de que pides. Por eso conversamos contigo antes de cobrar nada.",
  },

  portada_cierre_titulo: {
    etiqueta: "Título del cierre",
    tipo: "texto",
    ayuda: "La última invitación antes del pie.",
    grupo: "Portada",
    dondeSeVe: "Recuadro morado al final de la portada",
    maxLargo: 70,
    porDefecto: "¿No sabes cuál elegir?",
  },

  portada_cierre_texto: {
    etiqueta: "Texto del cierre",
    tipo: "parrafo",
    ayuda: "Qué pasa si escriben. Conviene prometer solo lo que se puede cumplir.",
    grupo: "Portada",
    dondeSeVe: "Recuadro morado al final de la portada",
    maxLargo: 260,
    porDefecto:
      "Dinos la edad del niño y qué le gusta, y te recomendamos el libro que le va a durar más tiempo. Respondemos por WhatsApp.",
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

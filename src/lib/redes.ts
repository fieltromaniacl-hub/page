/**
 * Las redes de la marca, en un solo sitio.
 *
 * Estaban escritas a mano en cuatro archivos —el pie, los datos estructurados
 * del layout, `llms.txt` y la página de contacto—, así que cambiar un usuario
 * obligaba a acordarse de los cuatro. Aquí se define una vez y de aquí las
 * leen todos.
 *
 * No son un ajuste del panel a propósito: cada red necesita además su icono,
 * que es código. Poder editar la dirección pero no poder añadir una red
 * resolvería la mitad del problema y sumaría campos que no se tocan nunca.
 */

export type Red = {
  nombre: string;
  href: string;
  /** Un icono solo no le dice nada a un lector de pantalla, y «Facebook» a
   *  secas tampoco dice qué pasa al pulsarlo. */
  etiqueta: string;
};

export const REDES: Red[] = [
  {
    nombre: "Facebook",
    href: "https://www.facebook.com/fieltromania.cl",
    etiqueta: "Fieltromanía en Facebook",
  },
  {
    nombre: "Instagram",
    href: "https://www.instagram.com/fieltromania_chile/",
    etiqueta: "Fieltromanía en Instagram",
  },
  {
    nombre: "YouTube",
    href: "https://www.youtube.com/@fieltromania_chile",
    etiqueta: "Fieltromanía en YouTube",
  },
];

/** Las direcciones sueltas, para `sameAs` de schema.org y para llms.txt. */
export const DIRECCIONES_DE_REDES = REDES.map((r) => r.href);

"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export type ItemCarrito = {
  /** Identifica la línea, no el producto: el mismo libro con dos nombres
   *  bordados distintos son dos líneas separadas. */
  clave: string;
  productoId: string;
  slug: string;
  nombre: string;
  /** Solo para mostrar. El total real lo recalcula el servidor con los
   *  precios de la base de datos. */
  precio: number;
  imagen: string | null;
  cantidad: number;
  personalizacion: Record<string, string>;
};

type EstadoCarrito = {
  items: ItemCarrito[];
  agregar: (item: Omit<ItemCarrito, "clave">) => void;
  cambiarCantidad: (clave: string, cantidad: number) => void;
  quitar: (clave: string) => void;
  vaciar: () => void;
};

/** Dos líneas se funden solo si son el mismo producto con la misma
 *  personalización. Se ordenan las claves para que el orden de respuesta no
 *  genere líneas duplicadas. */
function claveDeLinea(
  productoId: string,
  personalizacion: Record<string, string>,
) {
  const normalizada = Object.keys(personalizacion)
    .sort()
    .map((k) => `${k}=${personalizacion[k]}`)
    .join("|");
  return normalizada ? `${productoId}::${normalizada}` : productoId;
}

export const usarCarrito = create<EstadoCarrito>()(
  persist(
    (set) => ({
      items: [],

      agregar: (item) =>
        set((estado) => {
          const clave = claveDeLinea(item.productoId, item.personalizacion);
          const existente = estado.items.find((i) => i.clave === clave);

          if (existente) {
            return {
              items: estado.items.map((i) =>
                i.clave === clave
                  ? { ...i, cantidad: Math.min(i.cantidad + item.cantidad, 99) }
                  : i,
              ),
            };
          }

          return { items: [...estado.items, { ...item, clave }] };
        }),

      cambiarCantidad: (clave, cantidad) =>
        set((estado) => ({
          items:
            cantidad < 1
              ? estado.items.filter((i) => i.clave !== clave)
              : estado.items.map((i) =>
                  i.clave === clave ? { ...i, cantidad: Math.min(cantidad, 99) } : i,
                ),
        })),

      quitar: (clave) =>
        set((estado) => ({ items: estado.items.filter((i) => i.clave !== clave) })),

      vaciar: () => set({ items: [] }),
    }),
    {
      name: "fieltromania-carrito",
      storage: createJSONStorage(() => localStorage),
      /**
       * El servidor no tiene acceso a localStorage, así que si el carrito se
       * llenara durante la creación de la tienda el HTML del servidor y el del
       * navegador no coincidirían. Se rehidrata a mano tras montar.
       */
      skipHydration: true,
    },
  ),
);

export const totalItems = (items: ItemCarrito[]) =>
  items.reduce((suma, i) => suma + i.cantidad, 0);

export const subtotal = (items: ItemCarrito[]) =>
  items.reduce((suma, i) => suma + i.precio * i.cantidad, 0);

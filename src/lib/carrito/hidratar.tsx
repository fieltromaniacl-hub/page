"use client";

import { useEffect } from "react";

import { usarCarrito } from "./tienda";

/**
 * Carga el carrito guardado en el navegador después del primer pintado.
 *
 * Se hace aquí y no al crear la tienda porque el servidor no puede leer
 * localStorage: si la tienda naciera con los items dentro, el HTML del
 * servidor y el del navegador diferirían y React descartaría la hidratación.
 */
export function HidratarCarrito() {
  useEffect(() => {
    void usarCarrito.persist.rehydrate();
  }, []);

  return null;
}

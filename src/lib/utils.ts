import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Precio en pesos chilenos: sin decimales, separador de miles con punto. */
export function formatearPrecio(valor: number) {
  return new Intl.NumberFormat("es-CL", {
    style: "currency",
    currency: "CLP",
    maximumFractionDigits: 0,
  }).format(valor);
}

/**
 * URL base del sitio, siempre sin barra final.
 *
 * Sin normalizar, un `NEXT_PUBLIC_SITE_URL` terminado en «/» produce enlaces
 * con doble barra («sitio.cl//productos»), que los buscadores tratan como una
 * dirección distinta de la real y reparten la autoridad entre ambas.
 */
export function urlSitio() {
  const bruta = process.env.NEXT_PUBLIC_SITE_URL ?? "https://fieltromania.cl";
  return bruta.replace(/\/+$/, "");
}

"use client";

import { X } from "lucide-react";

/**
 * Cierra el aviso solo para quien lo cierra.
 *
 * Se guarda el id, no un simple «cerrado»: cuando ella publique el aviso
 * siguiente, quien cerró el anterior sí verá el nuevo. Con una bandera suelta,
 * cerrar una promoción de septiembre dejaría a esa persona sin ver ninguna
 * promoción nunca más.
 *
 * `localStorage` puede lanzar en ventanas privadas y con las cookies de sitio
 * bloqueadas, así que el fallo se traga: el aviso se esconde igual durante
 * esta visita y reaparece en la siguiente, que es un desenlace aceptable.
 */
export function BotonCerrarAviso({ id }: { id: string }) {
  return (
    <button
      type="button"
      aria-label="Cerrar este aviso"
      onClick={() => {
        try {
          localStorage.setItem("fieltromania-aviso", id);
        } catch {
          // Sin almacenamiento, se esconde solo por esta visita.
        }
        document.getElementById("aviso-tienda")?.remove();
      }}
      className="-mr-2 grid size-11 shrink-0 place-items-center rounded-pill text-ink-fijo transition-colors duration-150 hover:bg-[oklch(0.17_0.022_292/0.12)]"
    >
      <X className="size-4" strokeWidth={2.5} aria-hidden="true" />
    </button>
  );
}

import Link from "next/link";

import { BotonCerrarAviso } from "@/components/tienda/cerrar-aviso";
import { obtenerAvisoVigente } from "@/lib/contenido";
import { cn } from "@/lib/utils";

/** Los tres tonos usan relleno de marca y tinta fija: 5.04:1 en el peor caso. */
const TONOS = {
  naranja: "bg-naranja",
  verde: "bg-verde",
  violeta: "bg-violeta",
} as const;

/**
 * Franja programable sobre el encabezado.
 *
 * Se pinta en el servidor, así que va en el HTML y la lee un buscador. Quien
 * la cierra la esconde solo para sí, y el guion de abajo lo aplica ANTES del
 * primer pintado: sin él, la franja aparecería y desaparecería de un salto en
 * cada carga, empujando la página hacia abajo y otra vez hacia arriba.
 */
export async function AvisoTienda() {
  const aviso = await obtenerAvisoVigente();
  if (!aviso) return null;

  const ocultarSiFueCerrado = `try{if(localStorage.getItem('fieltromania-aviso')===${JSON.stringify(
    aviso.id,
  )}){var e=document.createElement('style');e.textContent='#aviso-tienda{display:none}';document.head.appendChild(e)}}catch(e){}`;

  return (
    <>
      <script dangerouslySetInnerHTML={{ __html: ocultarSiFueCerrado }} />

      <aside
        id="aviso-tienda"
        aria-label="Aviso de la tienda"
        className={cn(
          "border-b-[3px] border-line text-ink-fijo",
          TONOS[aviso.tono],
        )}
      >
        <div className="mx-auto flex max-w-[76rem] items-center gap-3 px-4 py-2 sm:px-6">
          <p className="flex-1 text-sm font-semibold text-balance">
            {aviso.texto}
            {aviso.enlace_href && aviso.enlace_texto ? (
              <>
                {" "}
                <Link
                  href={aviso.enlace_href}
                  className="whitespace-nowrap underline underline-offset-2"
                >
                  {aviso.enlace_texto}
                </Link>
              </>
            ) : null}
          </p>

          <BotonCerrarAviso id={aviso.id} />
        </div>
      </aside>
    </>
  );
}

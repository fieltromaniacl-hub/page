import type { Metadata } from "next";
import Link from "next/link";

import { Bloque, PaginaContenido } from "@/components/tienda/pagina-contenido";

export const metadata: Metadata = {
  title: "Cómo funciona el pedido",
  description:
    "Así se encarga un producto hecho a mano en Fieltromanía: eliges, personalizas, te contactamos y acordamos el pago y la entrega.",
  alternates: { canonical: "/como-funciona" },
};

const PASOS = [
  {
    numero: "1",
    titulo: "Eliges y personalizas",
    texto:
      "Escoges el producto y nos dices los datos que necesitamos: el nombre que va bordado, los colores, la edad del niño. Todo eso viaja con tu pedido, así no tenemos que preguntártelo después.",
  },
  {
    numero: "2",
    titulo: "Envías el pedido",
    texto:
      "Nos dejas tu nombre, correo y teléfono. En ese momento no se paga nada: solo queda registrado lo que quieres.",
  },
  {
    numero: "3",
    titulo: "Te contactamos",
    texto:
      "Te escribimos por correo o WhatsApp para confirmar los detalles, cotizar el despacho a tu comuna y acordar la forma de pago.",
  },
  {
    numero: "4",
    titulo: "Recién ahí empieza la confección",
    texto:
      "Una vez acordado, se corta y se cose tu pedido. Cada producto indica cuántos días toma aproximadamente.",
  },
  {
    numero: "5",
    titulo: "Te lo enviamos",
    texto:
      "Despachamos a todo Chile. Te avisamos cuando salga y te damos el número de seguimiento.",
  },
];

export default function ComoFunciona() {
  return (
    <PaginaContenido
      titulo="Es un encargo, no una compra al paso"
      bajada="Todo lo que vendemos se hace a mano después de que lo pides. Por eso conversamos contigo antes de cobrar nada."
    >
      <ol className="grid gap-6">
        {PASOS.map((paso) => (
          <li key={paso.numero} className="flex gap-4">
            <span
              aria-hidden="true"
              className="grid size-11 shrink-0 place-items-center rounded-pill border-2 border-line bg-naranja font-display text-lg font-extrabold text-[oklch(0.17_0.022_292)]"
            >
              {paso.numero}
            </span>
            <div>
              <h2 className="font-display text-lg font-bold tracking-tight">
                {paso.titulo}
              </h2>
              <p className="mt-1 text-ink-muted">{paso.texto}</p>
            </div>
          </li>
        ))}
      </ol>

      <Bloque titulo="¿Por qué no se paga en el sitio?">
        <p>
          Porque cada pedido es distinto. El despacho depende de tu comuna, algunos
          productos llevan modificaciones que conversamos contigo, y preferimos
          confirmar que todo esté bien antes de que gastes tu dinero.
        </p>
        <p>
          Es más lento que apretar un botón, pero significa que hay una persona
          revisando tu pedido.
        </p>
      </Bloque>

      <Bloque titulo="¿Y si me arrepiento?">
        <p>
          Mientras no hayas pagado, no hay compromiso. Nos avisas y listo. Una vez
          confeccionado un producto personalizado no podemos revenderlo, así que
          te pedimos que revises bien los datos antes de confirmar.
        </p>
      </Bloque>

      <p>
        <Link
          href="/productos"
          className="inline-flex min-h-12 items-center rounded-control border-2 border-line bg-naranja px-5 font-display font-bold text-[oklch(0.17_0.022_292)]"
        >
          Ver el catálogo
        </Link>
      </p>
    </PaginaContenido>
  );
}

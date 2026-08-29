import type { Metadata } from "next";

import { Bloque, PaginaContenido } from "@/components/tienda/pagina-contenido";

export const metadata: Metadata = {
  title: "Envíos y plazos",
  description:
    "Plazos de confección y despacho a todo Chile de los productos hechos a mano de Fieltromanía.",
  alternates: { canonical: "/envios" },
};

export default function Envios() {
  return (
    <PaginaContenido
      titulo="Envíos y plazos"
      bajada="Todo se hace a mano, así que hay una espera. Preferimos decírtelo antes y no después."
    >
      <Bloque titulo="Cuánto demora">
        <p>
          Cada producto indica en su ficha cuántos días toma confeccionarlo. El
          plazo empieza a correr cuando confirmamos el pedido y acordamos el pago,
          no cuando lo envías por el sitio.
        </p>
        <p>
          En temporadas altas —diciembre, vuelta a clases— los plazos se alargan.
          Si tienes una fecha límite, dínoslo en las notas del pedido y te
          confirmamos si alcanzamos antes de que pagues.
        </p>
      </Bloque>

      <Bloque titulo="A dónde enviamos">
        <p>
          Despachamos a todo Chile. El costo depende de tu comuna y del tamaño del
          pedido, así que lo cotizamos cuando te contactamos.
        </p>
        <p>
          Si estás en la misma ciudad, a veces podemos coordinar una entrega
          directa y te ahorras el despacho. Pregúntanos.
        </p>
      </Bloque>

      <Bloque titulo="Seguimiento">
        <p>
          Cuando el pedido sale del taller te avisamos con el número de
          seguimiento del transporte, para que puedas verlo tú misma.
        </p>
      </Bloque>

      <Bloque titulo="Si llega dañado">
        <p>
          Escríbenos con una foto apenas lo recibas. Nos hacemos cargo: lo
          reparamos o lo reponemos según lo que haya pasado.
        </p>
      </Bloque>
    </PaginaContenido>
  );
}

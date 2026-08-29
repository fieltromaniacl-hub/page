import type { Metadata } from "next";

import { Bloque, PaginaContenido } from "@/components/tienda/pagina-contenido";

export const metadata: Metadata = {
  title: "Cuidado de los productos",
  description:
    "Cómo lavar y conservar los libros de fieltro y los juguetes artesanales de Fieltromanía para que duren años.",
  alternates: { canonical: "/cuidados" },
};

export default function Cuidados() {
  return (
    <PaginaContenido
      titulo="Para que dure años"
      bajada="El fieltro aguanta mucho, pero no todo. Con estos cuidados un libro pasa de un hermano al siguiente."
    >
      <Bloque titulo="Lavado">
        <p>
          A mano, con agua fría y jabón suave. Frota solo la zona sucia, sin
          restregar. Nada de lavadora: el tambor deforma las piezas cosidas y
          suelta los bordes.
        </p>
        <p>
          Sin blanqueador ni quitamanchas. Los colores del fieltro son intensos y
          esos productos los comen.
        </p>
      </Bloque>

      <Bloque titulo="Secado">
        <p>
          Extendido y a la sombra, nunca en secadora ni sobre una estufa. El calor
          directo encoge el fieltro y lo deja rígido. El sol fuerte destiñe.
        </p>
      </Bloque>

      <Bloque titulo="Uso diario">
        <p>
          Los libros están hechos para jugarse, no para mirarse. Aun así, las
          piezas pequeñas —botones, cuentas, cordones— conviene revisarlas de vez
          en cuando y avisarnos si alguna se está soltando: se recose fácil.
        </p>
        <p>
          Si tu hijo tiene menos de tres años, acompáñalo mientras juega con las
          piezas sueltas.
        </p>
      </Bloque>

      <Bloque titulo="Guardado">
        <p>
          Plano o de pie, en un lugar seco. Evita apretarlo bajo otras cosas
          durante mucho tiempo: el fieltro toma la forma en que se guarda.
        </p>
      </Bloque>

      <Bloque titulo="Reparaciones">
        <p>
          Si se suelta algo, escríbenos. Lo hicimos nosotros y lo podemos
          arreglar; muchas veces basta con que nos mandes una foto para decirte
          cómo resolverlo en casa.
        </p>
      </Bloque>
    </PaginaContenido>
  );
}

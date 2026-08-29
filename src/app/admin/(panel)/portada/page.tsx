import { FormularioAjustes } from "@/app/admin/(panel)/ajustes/formulario";
import { obtenerAjustes } from "@/lib/contenido";
import { crearClienteServidor } from "@/lib/supabase/servidor";

import { GestorEtapas, GestorPasos } from "./gestores";

export const metadata = { title: "Portada" };
export const dynamic = "force-dynamic";

export default async function PaginaPortada() {
  const supabase = await crearClienteServidor();

  // Como admin, RLS deja ver también las etapas ocultas.
  const [ajustes, { data: etapas }, { data: pasos }] = await Promise.all([
    obtenerAjustes(),
    supabase
      .from("etapas")
      .select("id, edad, rango, titulo, texto, tono, orden, activa")
      .order("orden"),
    supabase
      .from("pasos")
      .select("id, titulo, texto, en_portada, orden")
      .order("orden"),
  ]);

  return (
    <main className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      <h1 className="text-xl font-bold tracking-tight">Portada</h1>
      <p className="mt-1 text-sm text-ink-muted">
        Los textos de la página de inicio, en el mismo orden en que se leen al
        bajar. La estructura no cambia: se cambian las palabras.
      </p>

      <div className="mt-6 grid gap-10">
        <FormularioAjustes valores={ajustes} soloGrupos={["Portada"]} />

        <section className="grid gap-4">
          <div className="border-t border-line-soft pt-6">
            <h2 className="text-base font-bold tracking-tight">Etapas por edad</h2>
            <p className="mt-1 text-sm text-ink-muted">
              Las tarjetas de colores. Cada una lleva al catálogo filtrado por su
              rango de edad, así que el rango tiene que coincidir con las edades
              que pusiste en los productos.
            </p>
          </div>
          <GestorEtapas etapas={etapas ?? []} />
        </section>

        <section className="grid gap-4">
          <div className="border-t border-line-soft pt-6">
            <h2 className="text-base font-bold tracking-tight">Pasos del pedido</h2>
            <p className="mt-1 text-sm text-ink-muted">
              Se escriben una sola vez y se usan en dos sitios: la página
              «Cómo funciona» los muestra todos, y la portada resume los que
              marques. Antes estaban escritos dos veces y ya no coincidían.
            </p>
          </div>
          <GestorPasos pasos={pasos ?? []} />
        </section>
      </div>
    </main>
  );
}

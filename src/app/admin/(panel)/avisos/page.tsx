import { crearClienteServidor } from "@/lib/supabase/servidor";

import { GestorAvisos } from "./gestor";

export const metadata = { title: "Avisos" };
export const dynamic = "force-dynamic";

/** El día en Chile, que es contra lo que la base decide la vigencia. */
function hoyEnChile() {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Santiago",
  }).format(new Date());
}

export default async function PaginaAvisos() {
  const supabase = await crearClienteServidor();

  // Como admin, RLS deja ver también los apagados y los vencidos.
  const { data: avisos } = await supabase
    .from("avisos")
    .select("id, texto, enlace_texto, enlace_href, desde, hasta, activo, tono")
    .order("orden")
    .order("creado_en", { ascending: false });

  return (
    <main className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      <h1 className="text-xl font-bold tracking-tight">Avisos</h1>
      <p className="mt-1 text-sm text-ink-muted">
        La franja de arriba de la tienda. Se enciende, se programa con fechas y
        se apaga sola cuando termina. Si hay varios vigentes se muestra el
        primero de la lista.
      </p>

      <div className="mt-6">
        <GestorAvisos avisos={avisos ?? []} hoy={hoyEnChile()} />
      </div>
    </main>
  );
}

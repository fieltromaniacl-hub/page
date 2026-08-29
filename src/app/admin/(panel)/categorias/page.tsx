import { crearClienteServidor } from "@/lib/supabase/servidor";

import { GestorCategorias } from "./gestor";

export const metadata = { title: "Categorías" };

export default async function PaginaCategorias() {
  const supabase = await crearClienteServidor();

  const { data: categorias } = await supabase
    .from("categorias")
    .select("id, nombre, slug, descripcion, orden")
    .order("orden");

  // Cuántos productos cuelgan de cada categoría, para avisar antes de borrar.
  const { data: productos } = await supabase
    .from("productos")
    .select("categoria_id")
    .neq("estado", "archivado");

  const conteo = new Map<string, number>();
  for (const p of productos ?? []) {
    if (p.categoria_id) conteo.set(p.categoria_id, (conteo.get(p.categoria_id) ?? 0) + 1);
  }

  return (
    <main className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      <h1 className="text-xl font-bold tracking-tight">Categorías</h1>
      <p className="mt-1 text-sm text-ink-muted">
        Agrupan el catálogo en la tienda. Borrar una no borra sus productos:
        quedan sin categoría.
      </p>

      <div className="mt-6">
        <GestorCategorias
          categorias={(categorias ?? []).map((c) => ({
            ...c,
            productos: conteo.get(c.id) ?? 0,
          }))}
        />
      </div>
    </main>
  );
}

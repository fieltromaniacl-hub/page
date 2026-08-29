import { ArrowLeft } from "lucide-react";
import Link from "next/link";

import { FormularioProducto } from "@/components/panel/formulario-producto";
import { crearClienteServidor } from "@/lib/supabase/servidor";

export const metadata = { title: "Nuevo producto" };

export default async function NuevoProducto() {
  const supabase = await crearClienteServidor();
  const { data: categorias } = await supabase
    .from("categorias")
    .select("id, nombre")
    .order("orden");

  return (
    <main className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      <Link
        href="/admin/productos"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-ink-muted transition-colors hover:text-ink"
      >
        <ArrowLeft className="size-4" aria-hidden="true" />
        Productos
      </Link>

      <h1 className="mt-3 text-xl font-bold tracking-tight">Nuevo producto</h1>
      <p className="mt-1 text-sm text-ink-muted">
        Guarda lo básico primero. Después podrás subir las fotos y definir qué le
        preguntas al cliente para personalizarlo.
      </p>

      <div className="mt-6">
        <FormularioProducto categorias={categorias ?? []} />
      </div>
    </main>
  );
}

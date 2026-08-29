import Link from "next/link";
import { notFound } from "next/navigation";

import { crearClienteServidor } from "@/lib/supabase/servidor";

import { EditorPagina } from "../editor";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: PageProps<"/admin/paginas/[id]">) {
  const { id } = await params;
  const supabase = await crearClienteServidor();
  const { data } = await supabase
    .from("paginas")
    .select("titulo")
    .eq("id", id)
    .maybeSingle();
  return { title: data?.titulo ?? "Página" };
}

export default async function EditarPagina({
  params,
}: PageProps<"/admin/paginas/[id]">) {
  const { id } = await params;
  const supabase = await crearClienteServidor();

  const { data } = await supabase
    .from("paginas")
    .select(
      "id, slug, titulo, bajada, seo_titulo, seo_descripcion, publicada, del_sistema, orden, pagina_bloques(id, titulo, cuerpo, orden)",
    )
    .eq("id", id)
    .maybeSingle();

  if (!data) notFound();

  const pagina = {
    ...data,
    bloques: [...data.pagina_bloques].sort((a, b) => a.orden - b.orden),
  };

  return (
    <main className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      <Link
        href="/admin/paginas"
        className="inline-flex min-h-11 items-center text-sm font-medium text-ink-muted hover:text-ink"
      >
        ← Páginas
      </Link>

      <h1 className="mt-2 text-xl font-bold tracking-tight">{pagina.titulo}</h1>

      <div className="mt-6">
        <EditorPagina pagina={pagina} />
      </div>
    </main>
  );
}

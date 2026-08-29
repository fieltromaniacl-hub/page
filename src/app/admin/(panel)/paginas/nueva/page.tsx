import Link from "next/link";

import { EditorPagina } from "../editor";

export const metadata = { title: "Nueva página" };

export default function NuevaPagina() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      <Link
        href="/admin/paginas"
        className="inline-flex min-h-11 items-center text-sm font-medium text-ink-muted hover:text-ink"
      >
        ← Páginas
      </Link>

      <h1 className="mt-2 text-xl font-bold tracking-tight">Nueva página</h1>
      <p className="mt-1 text-sm text-ink-muted">
        Primero se crea con su título y dirección; después se le agregan las
        secciones de texto.
      </p>

      <div className="mt-6">
        <EditorPagina pagina={null} />
      </div>
    </main>
  );
}

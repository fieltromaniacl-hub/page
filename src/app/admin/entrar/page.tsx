import type { Metadata } from "next";

import { Logo } from "@/components/marca/logo";

import { FormularioAcceso } from "./formulario";

export const metadata: Metadata = {
  title: "Entrar al panel",
  robots: { index: false, follow: false },
};

export default async function PaginaAcceso({
  searchParams,
}: PageProps<"/admin/entrar">) {
  const { volver } = await searchParams;

  return (
    <main className="grid min-h-dvh place-items-center px-4 py-12">
      <div className="w-full max-w-sm">
        <div className="mb-8 grid justify-items-center gap-3 text-center">
          <Logo className="h-14 w-auto" />
          <h1 className="font-sans text-xl font-bold tracking-tight">
            Panel de Fieltromanía
          </h1>
          <p className="text-sm text-ink-muted">
            Acceso solo para la administración de la tienda.
          </p>
        </div>

        <div className="rounded-card border border-line-soft bg-surface p-6">
          <FormularioAcceso volver={typeof volver === "string" ? volver : undefined} />
        </div>
      </div>
    </main>
  );
}

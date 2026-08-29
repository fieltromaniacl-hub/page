import type { ReactNode } from "react";

/** Envoltorio para las páginas de texto: ancho de lectura y ritmo comunes. */
export function PaginaContenido({
  titulo,
  bajada,
  children,
}: {
  titulo: string;
  bajada?: string;
  children: ReactNode;
}) {
  return (
    <div className="mx-auto max-w-[46rem] px-4 py-12 sm:px-6 lg:py-16">
      <h1 className="text-[length:var(--text-titulo)] leading-[1.05]">{titulo}</h1>
      {bajada ? (
        <p className="mt-4 text-[length:var(--text-sub)] leading-relaxed text-ink-muted">
          {bajada}
        </p>
      ) : null}
      <div className="mt-10 grid gap-8 text-[length:1.0625rem] leading-relaxed">
        {children}
      </div>
    </div>
  );
}

export function Bloque({
  titulo,
  children,
}: {
  titulo: string;
  children: ReactNode;
}) {
  return (
    <section>
      <h2 className="text-[length:var(--text-seccion)] leading-tight">{titulo}</h2>
      <div className="mt-3 grid gap-3 text-ink-muted">{children}</div>
    </section>
  );
}

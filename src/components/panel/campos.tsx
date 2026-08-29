import type { ComponentProps, ReactNode } from "react";

import { cn } from "@/lib/utils";

/**
 * Primitivas de formulario del panel. Registro de producto: borde de 1px,
 * sin sombras sólidas, sin tipografía display. La misma forma en todas las
 * pantallas del panel; la personalidad se queda en el sitio público.
 */

const claseControl =
  "w-full min-h-11 rounded-control border border-line-soft bg-surface px-3 py-2 text-ink transition-colors duration-150 placeholder:text-ink-muted hover:border-ink-muted focus:border-violeta focus:outline-none focus:ring-2 focus:ring-violeta/35 disabled:cursor-not-allowed disabled:opacity-60 aria-[invalid=true]:border-alerta aria-[invalid=true]:ring-alerta/30";

type EnvoltorioProps = {
  etiqueta: string;
  htmlFor: string;
  ayuda?: ReactNode;
  error?: string;
  requerido?: boolean;
  className?: string;
  children: ReactNode;
};

export function Campo({
  etiqueta,
  htmlFor,
  ayuda,
  error,
  requerido,
  className,
  children,
}: EnvoltorioProps) {
  return (
    <div className={cn("grid gap-1.5", className)}>
      <label htmlFor={htmlFor} className="text-sm font-semibold text-ink">
        {etiqueta}
        {requerido ? (
          <span className="ml-1 text-alerta" aria-hidden="true">
            *
          </span>
        ) : null}
      </label>

      {children}

      {ayuda && !error ? (
        <p id={`${htmlFor}-ayuda`} className="text-sm text-ink-muted">
          {ayuda}
        </p>
      ) : null}

      {error ? (
        <p
          id={`${htmlFor}-error`}
          role="alert"
          className="text-sm font-medium text-alerta"
        >
          {error}
        </p>
      ) : null}
    </div>
  );
}

export function Entrada({ className, ...props }: ComponentProps<"input">) {
  return <input className={cn(claseControl, className)} {...props} />;
}

export function AreaTexto({ className, ...props }: ComponentProps<"textarea">) {
  return (
    <textarea
      className={cn(claseControl, "min-h-28 resize-y leading-relaxed", className)}
      {...props}
    />
  );
}

export function Seleccion({ className, ...props }: ComponentProps<"select">) {
  return <select className={cn(claseControl, "pr-8", className)} {...props} />;
}

import { cva, type VariantProps } from "class-variance-authority";
import type { ComponentProps } from "react";

import { cn } from "@/lib/utils";

/**
 * Botón del panel. Versión sobria del botón de la tienda: sin desplazamiento
 * ni sombra sólida, transición de 150 ms, estados completos.
 */
export const botonPanelVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-control font-semibold transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violeta/45 focus-visible:ring-offset-2 focus-visible:ring-offset-bg disabled:pointer-events-none disabled:opacity-55",
  {
    variants: {
      variante: {
        primario: "bg-violeta text-[oklch(0.17_0.022_292)] hover:brightness-95",
        neutro:
          "border border-line-soft bg-surface text-ink hover:border-ink-muted hover:bg-surface-2",
        fantasma: "text-ink-muted hover:bg-surface-2 hover:text-ink",
        peligro: "bg-alerta text-[oklch(0.99_0_0)] hover:brightness-95",
      },
      tamano: {
        sm: "min-h-9 px-3 text-sm",
        md: "min-h-11 px-4 text-sm",
        lg: "min-h-12 px-5 text-base",
      },
    },
    defaultVariants: { variante: "primario", tamano: "md" },
  },
);

type Props = ComponentProps<"button"> & VariantProps<typeof botonPanelVariants>;

export function BotonPanel({ className, variante, tamano, ...props }: Props) {
  return (
    <button
      className={cn(botonPanelVariants({ variante, tamano }), className)}
      {...props}
    />
  );
}

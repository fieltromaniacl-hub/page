import { cva, type VariantProps } from "class-variance-authority";
import type { ComponentProps } from "react";

import { cn } from "@/lib/utils";

/**
 * El trazo negro y la sombra sólida desplazada son la firma de la marca.
 * Al pasar el cursor el elemento se levanta y la sombra crece, como papel
 * recortado. Se anula bajo `prefers-reduced-motion`.
 */
export const botonVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-control border-2 border-line font-display font-bold tracking-tight transition-[translate,box-shadow,background-color] duration-200 ease-[var(--ease-salida)] disabled:pointer-events-none disabled:opacity-50 hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-solida active:translate-x-0 active:translate-y-0 active:shadow-none motion-reduce:hover:translate-x-0 motion-reduce:hover:translate-y-0",
  {
    variants: {
      variante: {
        principal: "bg-naranja text-[oklch(0.17_0.022_292)]",
        secundario: "bg-surface text-ink hover:bg-violeta-tenue",
        marca: "bg-violeta text-[oklch(0.17_0.022_292)]",
      },
      tamano: {
        sm: "min-h-11 px-4 text-sm",
        md: "min-h-12 px-5 text-base",
        lg: "min-h-14 px-7 text-lg",
      },
    },
    defaultVariants: { variante: "principal", tamano: "md" },
  },
);

type Props = ComponentProps<"button"> & VariantProps<typeof botonVariants>;

export function Boton({ className, variante, tamano, ...props }: Props) {
  return (
    <button
      className={cn(botonVariants({ variante, tamano }), className)}
      {...props}
    />
  );
}

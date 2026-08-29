import { cn } from "@/lib/utils";

/** Estrella de cinco puntas con juntas redondeadas: la forma del fieltro cortado. */
const ESTRELLA =
  "M0,-10 L2.82,-3.88 L9.51,-3.09 L4.56,1.48 L5.88,8.09 L0,4.8 L-5.88,8.09 L-4.56,1.48 L-9.51,-3.09 L-2.82,-3.88 Z";

/**
 * Isotipo de Fieltromanía: libro abierto en trazo grueso con tres estrellas.
 * Las páginas se abren anchas, como alas, para que la forma siga leyéndose
 * como un libro a tamaños pequeños. El trazo usa `currentColor` y se invierte
 * en tema oscuro; las estrellas conservan sus colores de marca en ambos temas.
 */
export function Logo({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 220 156"
      role="img"
      aria-label="Fieltromanía"
      className={cn("text-ink", className)}
    >
      <g strokeWidth={3.5} strokeLinejoin="round">
        <path
          d={ESTRELLA}
          transform="translate(74 32) rotate(-14) scale(1.45)"
          fill="var(--violeta)"
          stroke="var(--violeta)"
        />
        <path
          d={ESTRELLA}
          transform="translate(146 24) rotate(12) scale(1.7)"
          fill="var(--verde)"
          stroke="var(--verde)"
        />
        <path
          d={ESTRELLA}
          transform="translate(110 64) rotate(-5) scale(1.15)"
          fill="var(--naranja)"
          stroke="var(--naranja)"
        />
      </g>

      <g
        fill="none"
        stroke="currentColor"
        strokeWidth={11}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M110,96 C88,72 50,54 12,66 C18,108 56,132 110,146 Z" />
        <path d="M110,96 C132,72 170,54 208,66 C202,108 164,132 110,146 Z" />
        <path d="M110,96 L110,146" />
      </g>
    </svg>
  );
}

/** Logo + logotipo, para el encabezado y el pie. */
export function LogoConNombre({ className }: { className?: string }) {
  return (
    <span className={cn("flex items-center gap-2.5", className)}>
      <Logo className="h-11 w-auto shrink-0" />
      <span className="font-display text-[1.35rem] font-extrabold tracking-tight text-ink">
        Fieltromanía
      </span>
    </span>
  );
}

import { cn } from "@/lib/utils";

/** Estrella de cinco puntas, centrada en el origen y de unas 19 unidades de ancho. */
const ESTRELLA =
  "M0,-10 L2.82,-3.88 L9.51,-3.09 L4.56,1.48 L5.88,8.09 L0,4.8 L-5.88,8.09 L-4.56,1.48 L-9.51,-3.09 L-2.82,-3.88 Z";

/**
 * Las tres estrellas, cada una con su color, tamaño e inclinación.
 *
 * `trazo` no es un contorno: es el mismo color del relleno engordando la forma
 * con juntas redondeadas, que es como se consiguen las puntas romas del
 * original. Va calculado a la inversa de la escala para que las tres queden
 * igual de redondeadas; si fuera un valor único, la estrella grande se vería
 * más afilada que la chica.
 */
const ESTRELLAS = [
  { color: "var(--violeta)", x: 78, y: 40, escala: 3.63, giro: -12, trazo: 2.2 },
  { color: "var(--verde)", x: 133, y: 132, escala: 4.31, giro: 14, trazo: 1.86 },
  { color: "var(--naranja)", x: 55, y: 170, escala: 2.94, giro: -16, trazo: 2.72 },
];

/**
 * Isotipo de Fieltromanía: las tres estrellas de fieltro.
 *
 * Antes eran las estrellas sobre un libro abierto de trazo negro grueso. El
 * libro se retiró por decisión de la marca; el trazo negro sigue siendo la
 * firma del sitio, pero como elección del sistema visual y ya no como algo
 * heredado del logotipo. Ver DESIGN.md.
 *
 * Los colores salen de los tokens, así que las tres conservan su fuerza en
 * tema oscuro sin repintar nada.
 */
export function Logo({ className }: { className?: string }) {
  return (
    // El viewBox se calcula sobre los límites reales de las tres estrellas,
    // trazo incluido: el redondeo las ensancha media pincelada por lado, y sin
    // contarlo la naranja quedaba cortada por la izquierda.
    <svg
      viewBox="19 -5 163 207"
      role="img"
      aria-label="Fieltromanía"
      className={className}
    >
      <g strokeLinejoin="round">
        {ESTRELLAS.map(({ color, x, y, escala, giro, trazo }) => (
          <path
            key={color}
            d={ESTRELLA}
            transform={`translate(${x} ${y}) rotate(${giro}) scale(${escala})`}
            fill={color}
            stroke={color}
            strokeWidth={trazo}
          />
        ))}
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

/**
 * Escena decorativa que reproduce el lenguaje visual del producto real:
 * arcoíris de fieltro sobre nube festoneada, fondo de lunares, trazo grueso.
 * Es ilustración de marca, no una foto: sustituible por fotografía real
 * cuando el catálogo tenga imágenes propias.
 */

const FRANJAS = [
  { r: 168, color: "#E4453A" },
  { r: 142, color: "#F08A2C" },
  { r: 116, color: "#F5C935" },
  { r: 90, color: "#5CB85C" },
  { r: 64, color: "#4AA8DC" },
];

const ESTRELLA =
  "M0,-10 L2.82,-3.88 L9.51,-3.09 L4.56,1.48 L5.88,8.09 L0,4.8 L-5.88,8.09 L-4.56,1.48 L-9.51,-3.09 L-2.82,-3.88 Z";

export function EscenaFieltro({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 400 400" aria-hidden="true" className={className}>
      <defs>
        <pattern
          id="lunares"
          width="26"
          height="26"
          patternUnits="userSpaceOnUse"
        >
          <rect width="26" height="26" fill="#6FC5E8" />
          <circle cx="7" cy="7" r="2.6" fill="#FFFFFF" opacity="0.95" />
          <circle cx="20" cy="20" r="2.6" fill="#FFFFFF" opacity="0.95" />
        </pattern>
        <clipPath id="recorte">
          <rect x="8" y="8" width="384" height="384" rx="34" />
        </clipPath>
      </defs>

      <g clipPath="url(#recorte)">
        <rect x="8" y="8" width="384" height="384" fill="url(#lunares)" />

        {/* Arcoíris: franjas de fieltro apiladas */}
        <g
          fill="none"
          strokeWidth={26}
          strokeLinecap="butt"
          transform="translate(0 34)"
        >
          {FRANJAS.map(({ r, color }) => (
            <path
              key={r}
              d={`M ${200 - r} 300 A ${r} ${r} 0 0 1 ${200 + r} 300`}
              stroke={color}
            />
          ))}
        </g>

        {/* Nube festoneada al pie del arcoíris */}
        <g transform="translate(0 34)">
          <path
            d="M60 300 a34 34 0 0 1 48 -30 a40 40 0 0 1 62 -14 a36 36 0 0 1 60 8 a34 34 0 0 1 52 36 v40 H60 Z"
            fill="#F4F6FA"
            stroke="#1B1725"
            strokeWidth={7}
            strokeLinejoin="round"
          />
        </g>

        {/* Costura de puntadas sobre la nube */}
        <path
          d="M74 366 h252"
          stroke="#1B1725"
          strokeWidth={4}
          strokeLinecap="round"
          strokeDasharray="9 11"
          opacity="0.5"
        />

        <g strokeWidth={4} strokeLinejoin="round">
          <path
            d={ESTRELLA}
            transform="translate(66 74) rotate(-14) scale(1.5)"
            fill="var(--violeta)"
            stroke="#1B1725"
          />
          <path
            d={ESTRELLA}
            transform="translate(330 108) rotate(12) scale(1.25)"
            fill="var(--verde)"
            stroke="#1B1725"
          />
          <path
            d={ESTRELLA}
            transform="translate(300 46) rotate(-6) scale(0.95)"
            fill="var(--naranja)"
            stroke="#1B1725"
          />
        </g>
      </g>

      <rect
        x="8"
        y="8"
        width="384"
        height="384"
        rx="34"
        fill="none"
        stroke="var(--line)"
        strokeWidth={7}
      />
    </svg>
  );
}

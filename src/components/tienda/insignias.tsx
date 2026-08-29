import { cn } from "@/lib/utils";

/**
 * Disponibilidad de cara al cliente. Siempre con texto, nunca solo color:
 * verde y naranja son indistinguibles para bastante gente.
 */
const STOCK = {
  disponible: { texto: "Listo para enviar", clase: "bg-verde-tenue text-verde-txt" },
  por_encargo: { texto: "Se hace a pedido", clase: "bg-violeta-tenue text-violeta-txt" },
  agotado: { texto: "Agotado", clase: "bg-surface-2 text-ink-muted" },
} as const;

export function InsigniaDisponibilidad({
  stock,
  className,
}: {
  stock: keyof typeof STOCK;
  className?: string;
}) {
  const { texto, clase } = STOCK[stock];
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-pill border-2 border-line px-3 py-0.5 font-display text-xs font-bold whitespace-nowrap",
        clase,
        className,
      )}
    >
      {texto}
    </span>
  );
}

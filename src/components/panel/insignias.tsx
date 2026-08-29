import { cn } from "@/lib/utils";

/**
 * Los estados siempre llevan texto, nunca solo color: por daltonismo y porque
 * verde y naranja son la misma cosa para bastante gente.
 */

const ESTADO = {
  activo: { texto: "Publicado", clase: "bg-verde-tenue text-verde-txt" },
  inactivo: { texto: "Sin publicar", clase: "bg-surface-2 text-ink-muted" },
  archivado: { texto: "Archivado", clase: "bg-surface-2 text-ink-muted" },
} as const;

const STOCK = {
  disponible: { texto: "Disponible", clase: "bg-verde-tenue text-verde-txt" },
  por_encargo: { texto: "Por encargo", clase: "bg-violeta-tenue text-violeta-txt" },
  agotado: { texto: "Agotado", clase: "bg-alerta-tenue text-ink" },
} as const;

const baseInsignia =
  "inline-flex items-center rounded-pill px-2.5 py-0.5 text-xs font-semibold whitespace-nowrap";

export function InsigniaEstado({ estado }: { estado: keyof typeof ESTADO }) {
  const { texto, clase } = ESTADO[estado];
  return <span className={cn(baseInsignia, clase)}>{texto}</span>;
}

export function InsigniaStock({ stock }: { stock: keyof typeof STOCK }) {
  const { texto, clase } = STOCK[stock];
  return <span className={cn(baseInsignia, clase)}>{texto}</span>;
}

export const ETIQUETA_PEDIDO = {
  recibido: "Recibido",
  contactado: "Contactado",
  confirmado: "Confirmado",
  en_confeccion: "En confección",
  enviado: "Enviado",
  entregado: "Entregado",
  cancelado: "Cancelado",
} as const;

const PEDIDO_CLASE: Record<keyof typeof ETIQUETA_PEDIDO, string> = {
  recibido: "bg-naranja-tenue text-naranja-txt",
  contactado: "bg-violeta-tenue text-violeta-txt",
  confirmado: "bg-violeta-tenue text-violeta-txt",
  en_confeccion: "bg-violeta-tenue text-violeta-txt",
  enviado: "bg-verde-tenue text-verde-txt",
  entregado: "bg-verde-tenue text-verde-txt",
  cancelado: "bg-surface-2 text-ink-muted",
};

export function InsigniaPedido({
  estado,
}: {
  estado: keyof typeof ETIQUETA_PEDIDO;
}) {
  return (
    <span className={cn(baseInsignia, PEDIDO_CLASE[estado])}>
      {ETIQUETA_PEDIDO[estado]}
    </span>
  );
}

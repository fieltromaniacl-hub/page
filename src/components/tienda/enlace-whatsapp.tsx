import { IconoWhatsapp } from "@/components/marca/iconos-redes";
import { cn } from "@/lib/utils";

/**
 * Enlace a WhatsApp con el mensaje ya escrito.
 *
 * Devuelve null si no hay número configurado, para que el sitio no muestre
 * nunca un botón que lleva a ninguna parte.
 */
export function EnlaceWhatsapp({
  mensaje,
  children,
  className,
  variante = "suave",
}: {
  mensaje: string;
  children: React.ReactNode;
  className?: string;
  variante?: "suave" | "fuerte";
}) {
  const numero = process.env.NEXT_PUBLIC_WHATSAPP;
  if (!numero) return null;

  return (
    <a
      href={`https://wa.me/${numero}?text=${encodeURIComponent(mensaje)}`}
      target="_blank"
      rel="noreferrer"
      className={cn(
        "inline-flex min-h-12 items-center gap-2 rounded-control border-2 border-line px-4 font-display font-bold transition-[background-color,translate,box-shadow] duration-200 ease-[var(--ease-salida)] hover:-translate-y-0.5 hover:shadow-solida motion-reduce:hover:translate-y-0",
        variante === "fuerte"
          ? "bg-naranja text-[oklch(0.17_0.022_292)]"
          : "bg-verde-tenue text-verde-txt",
        className,
      )}
    >
      <IconoWhatsapp className="size-5 shrink-0" />
      {children}
    </a>
  );
}

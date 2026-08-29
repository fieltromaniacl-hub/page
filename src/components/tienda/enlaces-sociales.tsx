import {
  IconoFacebook,
  IconoInstagram,
  IconoWhatsapp,
  IconoYoutube,
} from "@/components/marca/iconos-redes";
import { REDES } from "@/lib/redes";
import { cn } from "@/lib/utils";

/** El icono de cada red, emparejado por nombre con la lista de `lib/redes`. */
const ICONOS: Record<string, typeof IconoFacebook> = {
  Facebook: IconoFacebook,
  Instagram: IconoInstagram,
  YouTube: IconoYoutube,
};

export function EnlacesSociales({ className }: { className?: string }) {
  const whatsapp = process.env.NEXT_PUBLIC_WHATSAPP;

  return (
    <ul className={cn("flex flex-wrap items-center gap-2.5", className)}>
      {REDES.map(({ nombre, href, etiqueta }) => {
        const Icono = ICONOS[nombre];
        return (
        <li key={nombre}>
          <a
            href={href}
            target="_blank"
            rel="noreferrer"
            aria-label={etiqueta}
            title={nombre}
            className="grid size-12 place-items-center rounded-pill border-2 border-line bg-surface text-ink transition-[background-color,translate,box-shadow] duration-200 ease-[var(--ease-salida)] hover:-translate-y-0.5 hover:bg-violeta-tenue hover:shadow-solida motion-reduce:hover:translate-y-0"
          >
            <Icono className="size-5" />
          </a>
        </li>
        );
      })}

      {whatsapp ? (
        <li>
          <a
            href={`https://wa.me/${whatsapp}`}
            target="_blank"
            rel="noreferrer"
            aria-label="Escribirnos por WhatsApp"
            className="inline-flex min-h-12 items-center gap-2 rounded-pill border-2 border-line bg-verde-tenue px-4 font-display font-bold text-verde-txt transition-[background-color,translate,box-shadow] duration-200 ease-[var(--ease-salida)] hover:-translate-y-0.5 hover:shadow-solida motion-reduce:hover:translate-y-0"
          >
            <IconoWhatsapp className="size-5 shrink-0" />
            WhatsApp
          </a>
        </li>
      ) : null}
    </ul>
  );
}

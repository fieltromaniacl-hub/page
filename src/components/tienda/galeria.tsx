"use client";

import { ImageOff } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

import { cn } from "@/lib/utils";

type Foto = { id: string; url: string; alt: string };

export function Galeria({ fotos, nombre }: { fotos: Foto[]; nombre: string }) {
  const [activa, setActiva] = useState(0);

  if (!fotos.length) {
    return (
      <div className="grid aspect-square place-items-center rounded-card border-[3px] border-line bg-surface-2 text-ink-muted">
        <ImageOff className="size-10" aria-hidden="true" />
        <span className="sr-only">Este producto todavía no tiene fotos</span>
      </div>
    );
  }

  const principal = fotos[activa];

  return (
    <div className="grid gap-3">
      <div className="relative aspect-square overflow-hidden rounded-card border-[3px] border-line bg-surface-2">
        <Image
          src={principal.url}
          alt={principal.alt || nombre}
          fill
          sizes="(min-width: 1024px) 34rem, 92vw"
          priority
          className="object-cover"
        />
      </div>

      {fotos.length > 1 ? (
        <ul className="flex flex-wrap gap-2">
          {fotos.map((foto, i) => (
            <li key={foto.id}>
              <button
                type="button"
                onClick={() => setActiva(i)}
                aria-label={`Ver foto ${i + 1} de ${fotos.length}`}
                aria-current={i === activa ? "true" : undefined}
                className={cn(
                  "relative block size-20 overflow-hidden rounded-control border-2 transition-[border-color,translate] duration-150",
                  i === activa
                    ? "border-violeta"
                    : "border-line-soft hover:-translate-y-0.5 hover:border-line motion-reduce:hover:translate-y-0",
                )}
              >
                <Image
                  src={foto.url}
                  alt=""
                  fill
                  sizes="5rem"
                  className="object-cover"
                />
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}

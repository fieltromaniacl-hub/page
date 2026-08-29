"use client";

import { ChevronDown, ChevronUp, ImagePlus, Trash2, TriangleAlert } from "lucide-react";
import Image from "next/image";
import { useActionState, useRef } from "react";
import { useFormStatus } from "react-dom";

import { BotonPanel } from "@/components/panel/boton-panel";
import { Entrada } from "@/components/panel/campos";
import {
  eliminarImagen,
  guardarTextoAlternativo,
  moverImagen,
  subirImagenes,
  type EstadoImagen,
} from "@/lib/acciones/imagenes";

type Imagen = { id: string; url: string; alt: string; orden: number };

function BotonSubir() {
  const { pending } = useFormStatus();
  return (
    <BotonPanel type="submit" variante="neutro" disabled={pending}>
      {pending ? "Subiendo…" : "Subir fotos"}
    </BotonPanel>
  );
}

/** Guarda el texto alternativo al salir del campo, solo si cambió. */
function CampoAlternativo({
  imagen,
  productoId,
}: {
  imagen: Imagen;
  productoId: string;
}) {
  const formRef = useRef<HTMLFormElement>(null);
  const original = useRef(imagen.alt);

  return (
    <form ref={formRef} action={guardarTextoAlternativo} className="mt-2">
      <input type="hidden" name="id" value={imagen.id} />
      <input type="hidden" name="producto_id" value={productoId} />
      <label htmlFor={`alt-${imagen.id}`} className="sr-only">
        Descripción de la foto
      </label>
      <Entrada
        id={`alt-${imagen.id}`}
        name="alt"
        defaultValue={imagen.alt}
        placeholder="Describe la foto: «Libro abierto en la página del bosque»"
        maxLength={160}
        className="text-sm"
        onBlur={(e) => {
          if (e.target.value !== original.current) {
            original.current = e.target.value;
            formRef.current?.requestSubmit();
          }
        }}
      />
    </form>
  );
}

export function GestorImagenes({
  productoId,
  imagenes,
}: {
  productoId: string;
  imagenes: Imagen[];
}) {
  const [estado, accion] = useActionState<EstadoImagen, FormData>(
    subirImagenes,
    {},
  );

  const sinDescripcion = imagenes.filter((i) => !i.alt.trim()).length;

  return (
    <section className="rounded-card border border-line-soft bg-surface p-5">
      <h2 className="text-base font-bold tracking-tight">Fotos</h2>
      <p className="mt-1 text-sm text-ink-muted">
        La primera foto es la portada del producto. Arrastra el orden con las
        flechas.
      </p>

      <form action={accion} className="mt-4 flex flex-wrap items-center gap-3">
        <input type="hidden" name="producto_id" value={productoId} />
        <label
          htmlFor="archivos"
          className="inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-control border border-dashed border-line-soft px-4 text-sm font-medium text-ink-muted transition-colors hover:border-ink-muted hover:text-ink"
        >
          <ImagePlus className="size-4" aria-hidden="true" />
          Elegir fotos
        </label>
        <input
          id="archivos"
          name="archivos"
          type="file"
          multiple
          accept="image/jpeg,image/png,image/webp,image/avif"
          className="sr-only"
        />
        <BotonSubir />
        <span className="text-xs text-ink-muted">JPG, PNG o WEBP · máximo 5 MB cada una</span>
      </form>

      {estado.error ? (
        <p
          role="alert"
          className="mt-3 rounded-control border border-alerta/40 bg-alerta-tenue px-3 py-2 text-sm font-medium text-ink"
        >
          {estado.error}
        </p>
      ) : null}

      {sinDescripcion > 0 ? (
        <p className="mt-3 flex items-start gap-2 rounded-control bg-naranja-tenue px-3 py-2 text-sm text-ink">
          <TriangleAlert className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
          <span>
            {sinDescripcion === 1
              ? "Una foto no tiene descripción."
              : `${sinDescripcion} fotos no tienen descripción.`}{" "}
            Sirve para quien usa lector de pantalla y para que Google entienda la
            imagen.
          </span>
        </p>
      ) : null}

      {imagenes.length ? (
        <ul className="mt-4 grid gap-4 sm:grid-cols-2">
          {imagenes.map((imagen, i) => (
            <li
              key={imagen.id}
              className="rounded-control border border-line-soft p-3"
            >
              <div className="relative aspect-square overflow-hidden rounded-control bg-surface-2">
                <Image
                  src={imagen.url}
                  alt={imagen.alt || "Foto sin descripción"}
                  fill
                  sizes="(min-width: 640px) 20rem, 90vw"
                  className="object-cover"
                />
                {i === 0 ? (
                  <span className="absolute left-2 top-2 rounded-pill bg-violeta px-2 py-0.5 text-xs font-semibold text-[oklch(0.17_0.022_292)]">
                    Portada
                  </span>
                ) : null}
              </div>

              <CampoAlternativo imagen={imagen} productoId={productoId} />

              <div className="mt-2 flex items-center gap-1">
                <form action={moverImagen}>
                  <input type="hidden" name="id" value={imagen.id} />
                  <input type="hidden" name="producto_id" value={productoId} />
                  <input type="hidden" name="direccion" value="arriba" />
                  <button
                    type="submit"
                    disabled={i === 0}
                    aria-label="Mover antes"
                    className="grid size-9 place-items-center rounded-control text-ink-muted transition-colors hover:bg-surface-2 hover:text-ink disabled:opacity-40 disabled:hover:bg-transparent"
                  >
                    <ChevronUp className="size-4" aria-hidden="true" />
                  </button>
                </form>

                <form action={moverImagen}>
                  <input type="hidden" name="id" value={imagen.id} />
                  <input type="hidden" name="producto_id" value={productoId} />
                  <input type="hidden" name="direccion" value="abajo" />
                  <button
                    type="submit"
                    disabled={i === imagenes.length - 1}
                    aria-label="Mover después"
                    className="grid size-9 place-items-center rounded-control text-ink-muted transition-colors hover:bg-surface-2 hover:text-ink disabled:opacity-40 disabled:hover:bg-transparent"
                  >
                    <ChevronDown className="size-4" aria-hidden="true" />
                  </button>
                </form>

                <form action={eliminarImagen} className="ml-auto">
                  <input type="hidden" name="id" value={imagen.id} />
                  <input type="hidden" name="producto_id" value={productoId} />
                  <button
                    type="submit"
                    aria-label="Eliminar foto"
                    className="grid size-9 place-items-center rounded-control text-ink-muted transition-colors hover:bg-alerta-tenue hover:text-alerta"
                  >
                    <Trash2 className="size-4" aria-hidden="true" />
                  </button>
                </form>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-4 rounded-control border border-dashed border-line-soft px-4 py-8 text-center text-sm text-ink-muted">
          Todavía no hay fotos. Sin al menos una, el producto se ve vacío en la
          tienda.
        </p>
      )}
    </section>
  );
}

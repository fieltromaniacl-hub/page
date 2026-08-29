"use client";

import Link from "next/link";
import { useActionState, useState, type ReactNode } from "react";
import { useFormStatus } from "react-dom";

import { BotonPanel } from "@/components/panel/boton-panel";
import { AreaTexto, Campo, Entrada, Seleccion } from "@/components/panel/campos";
import {
  guardarProducto,
  type EstadoFormulario,
} from "@/lib/acciones/productos";
import { generarSlug } from "@/lib/validacion";

type Categoria = { id: string; nombre: string };

type Producto = {
  id: string;
  nombre: string;
  slug: string;
  resumen: string | null;
  descripcion: string | null;
  precio: number;
  precio_antes: number | null;
  categoria_id: string | null;
  estado: "activo" | "inactivo" | "archivado";
  stock: "disponible" | "por_encargo" | "agotado";
  cantidad: number | null;
  destacado: boolean;
  orden: number;
  edad_min: number | null;
  edad_max: number | null;
  materiales: string | null;
  medidas: string | null;
  cuidados: string | null;
  dias_confeccion: number | null;
  habilidades: string[];
  seo_titulo: string | null;
  seo_descripcion: string | null;
};

function Seccion({
  titulo,
  descripcion,
  children,
}: {
  titulo: string;
  descripcion?: string;
  children: ReactNode;
}) {
  return (
    <section className="rounded-card border border-line-soft bg-surface p-5">
      <h2 className="text-base font-bold tracking-tight">{titulo}</h2>
      {descripcion ? (
        <p className="mt-1 text-sm text-ink-muted">{descripcion}</p>
      ) : null}
      <div className="mt-4 grid gap-4">{children}</div>
    </section>
  );
}

function BotonGuardar({ esEdicion }: { esEdicion: boolean }) {
  const { pending } = useFormStatus();
  return (
    <BotonPanel type="submit" tamano="lg" disabled={pending}>
      {pending
        ? "Guardando…"
        : esEdicion
          ? "Guardar cambios"
          : "Crear y continuar"}
    </BotonPanel>
  );
}

export function FormularioProducto({
  categorias,
  producto,
}: {
  categorias: Categoria[];
  producto?: Producto;
}) {
  const esEdicion = Boolean(producto);
  const [estado, accion] = useActionState<EstadoFormulario, FormData>(
    guardarProducto,
    {},
  );

  // En un producto nuevo la dirección se deriva del nombre mientras se escribe,
  // hasta que la persona la edite a mano: ahí se respeta lo que puso.
  const [nombre, setNombre] = useState(producto?.nombre ?? "");
  const [slug, setSlug] = useState(producto?.slug ?? "");
  const [slugTocado, setSlugTocado] = useState(esEdicion);

  const err = estado.errores ?? {};

  /**
   * Valor inicial de cada campo. Si la acción devolvió lo enviado (porque la
   * validación falló), gana eso sobre lo que hay guardado: así la persona no
   * pierde lo que estaba escribiendo.
   */
  const val = (campo: string, base?: string | number | null) =>
    estado.valores?.[campo] ??
    (base === null || base === undefined ? "" : String(base));

  return (
    <form action={accion} className="grid gap-5 pb-24">
      {producto ? <input type="hidden" name="id" value={producto.id} /> : null}

      {estado.mensaje ? (
        <p
          role="status"
          className="rounded-control border border-line-soft bg-verde-tenue px-4 py-2.5 text-sm font-medium text-ink"
        >
          {estado.mensaje}
        </p>
      ) : null}

      <Seccion titulo="Lo básico">
        <Campo etiqueta="Nombre" htmlFor="nombre" error={err.nombre} requerido>
          <Entrada
            id="nombre"
            name="nombre"
            value={nombre}
            onChange={(e) => {
              setNombre(e.target.value);
              if (!slugTocado) setSlug(generarSlug(e.target.value));
            }}
            aria-invalid={err.nombre ? true : undefined}
            required
          />
        </Campo>

        <Campo
          etiqueta="Dirección en el sitio"
          htmlFor="slug"
          error={err.slug}
          ayuda={
            <>
              Quedará en <code className="text-ink">/productos/{slug || "…"}</code>.
              {esEdicion
                ? " Cambiarla rompe los enlaces que ya compartiste."
                : " Se genera sola desde el nombre."}
            </>
          }
        >
          <Entrada
            id="slug"
            name="slug"
            value={slug}
            onChange={(e) => {
              setSlugTocado(true);
              setSlug(e.target.value);
            }}
            aria-invalid={err.slug ? true : undefined}
          />
        </Campo>

        <Campo
          etiqueta="Resumen"
          htmlFor="resumen"
          error={err.resumen}
          ayuda="Una línea. Aparece en el catálogo y es lo que muestra Google bajo el título."
        >
          <Entrada
            id="resumen"
            name="resumen"
            defaultValue={val("resumen", producto?.resumen)}
            maxLength={160}
          />
        </Campo>

        <Campo
          etiqueta="Descripción"
          htmlFor="descripcion"
          error={err.descripcion}
          ayuda="El texto largo de la ficha. Cuenta qué trae, cómo se juega y por qué le sirve al niño."
        >
          <AreaTexto
            id="descripcion"
            name="descripcion"
            rows={7}
            defaultValue={val("descripcion", producto?.descripcion)}
          />
        </Campo>

        <Campo etiqueta="Categoría" htmlFor="categoria_id" error={err.categoria_id}>
          <Seleccion
            id="categoria_id"
            name="categoria_id"
            defaultValue={val("categoria_id", producto?.categoria_id)}
          >
            <option value="">Sin categoría</option>
            {categorias.map((c) => (
              <option key={c.id} value={c.id}>
                {c.nombre}
              </option>
            ))}
          </Seleccion>
        </Campo>
      </Seccion>

      <Seccion titulo="Precio y disponibilidad">
        <div className="grid gap-4 sm:grid-cols-2">
          <Campo
            etiqueta="Precio"
            htmlFor="precio"
            error={err.precio}
            requerido
            ayuda="En pesos, sin puntos ni decimales. Ejemplo: 24990"
          >
            <Entrada
              id="precio"
              name="precio"
              type="number"
              inputMode="numeric"
              min={0}
              step={1}
              defaultValue={val("precio", producto?.precio)}
              aria-invalid={err.precio ? true : undefined}
              required
            />
          </Campo>

          <Campo
            etiqueta="Precio anterior"
            htmlFor="precio_antes"
            error={err.precio_antes}
            ayuda="Opcional. Si lo llenas, se muestra tachado como oferta."
          >
            <Entrada
              id="precio_antes"
              name="precio_antes"
              type="number"
              inputMode="numeric"
              min={0}
              step={1}
              defaultValue={val("precio_antes", producto?.precio_antes)}
              aria-invalid={err.precio_antes ? true : undefined}
            />
          </Campo>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <Campo
            etiqueta="Estado"
            htmlFor="estado"
            error={err.estado}
            ayuda="Sin publicar lo oculta de la tienda pero lo conserva aquí."
          >
            <Seleccion
              id="estado"
              name="estado"
              defaultValue={val("estado", producto?.estado ?? "inactivo")}
            >
              <option value="activo">Publicado</option>
              <option value="inactivo">Sin publicar</option>
              <option value="archivado">Archivado</option>
            </Seleccion>
          </Campo>

          <Campo
            etiqueta="Disponibilidad"
            htmlFor="stock"
            error={err.stock}
            ayuda="«Por encargo» es lo normal aquí: se vende y después se confecciona."
          >
            <Seleccion
              id="stock"
              name="stock"
              defaultValue={val("stock", producto?.stock ?? "por_encargo")}
            >
              <option value="por_encargo">Por encargo</option>
              <option value="disponible">Disponible ahora</option>
              <option value="agotado">Agotado</option>
            </Seleccion>
          </Campo>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <Campo
            etiqueta="Unidades"
            htmlFor="cantidad"
            error={err.cantidad}
            ayuda="Déjalo vacío si no llevas control de unidades."
          >
            <Entrada
              id="cantidad"
              name="cantidad"
              type="number"
              inputMode="numeric"
              min={0}
              step={1}
              defaultValue={val("cantidad", producto?.cantidad)}
            />
          </Campo>

          <Campo
            etiqueta="Orden"
            htmlFor="orden"
            error={err.orden}
            ayuda="Menor número, más arriba en el catálogo."
          >
            <Entrada
              id="orden"
              name="orden"
              type="number"
              inputMode="numeric"
              step={1}
              defaultValue={val("orden", producto?.orden ?? 0)}
            />
          </Campo>
        </div>

        <label className="flex min-h-11 items-center gap-3">
          <input
            type="checkbox"
            name="destacado"
            defaultChecked={
              estado.valores
                ? estado.valores.destacado === "true"
                : (producto?.destacado ?? false)
            }
            className="size-5 shrink-0 rounded border-line-soft accent-[var(--violeta)]"
          />
          <span className="text-sm font-semibold">Mostrar en la portada</span>
        </label>
      </Seccion>

      <Seccion
        titulo="Ficha del producto"
        descripcion="Estos datos también alimentan lo que entienden Google y los asistentes de IA."
      >
        <div className="grid gap-4 sm:grid-cols-3">
          <Campo etiqueta="Edad mínima" htmlFor="edad_min" error={err.edad_min} ayuda="En años">
            <Entrada id="edad_min" name="edad_min" type="number" min={0} max={18} step={1} defaultValue={val("edad_min", producto?.edad_min)} />
          </Campo>
          <Campo etiqueta="Edad máxima" htmlFor="edad_max" error={err.edad_max} ayuda="En años">
            <Entrada id="edad_max" name="edad_max" type="number" min={0} max={18} step={1} defaultValue={val("edad_max", producto?.edad_max)} aria-invalid={err.edad_max ? true : undefined} />
          </Campo>
          <Campo etiqueta="Días de confección" htmlFor="dias_confeccion" error={err.dias_confeccion} ayuda="Plazo estimado">
            <Entrada id="dias_confeccion" name="dias_confeccion" type="number" min={1} step={1} defaultValue={val("dias_confeccion", producto?.dias_confeccion)} />
          </Campo>
        </div>

        <Campo
          etiqueta="Qué habilidades trabaja"
          htmlFor="habilidades"
          error={err.habilidades}
          ayuda="Separadas por comas. Ejemplo: motricidad fina, reconocimiento de colores, secuencias"
        >
          <Entrada
            id="habilidades"
            name="habilidades"
            defaultValue={val("habilidades", producto?.habilidades?.join(", "))}
          />
        </Campo>

        <Campo etiqueta="Materiales" htmlFor="materiales" error={err.materiales}>
          <Entrada id="materiales" name="materiales" defaultValue={val("materiales", producto?.materiales)} placeholder="Fieltro de poliéster, hilo de algodón, botones de madera" />
        </Campo>

        <Campo etiqueta="Medidas" htmlFor="medidas" error={err.medidas}>
          <Entrada id="medidas" name="medidas" defaultValue={val("medidas", producto?.medidas)} placeholder="20 × 20 cm cerrado, 8 páginas" />
        </Campo>

        <Campo etiqueta="Cuidados" htmlFor="cuidados" error={err.cuidados}>
          <AreaTexto id="cuidados" name="cuidados" rows={3} defaultValue={val("cuidados", producto?.cuidados)} placeholder="Lavar a mano con agua fría. No usar secadora." />
        </Campo>
      </Seccion>

      <Seccion
        titulo="Buscadores"
        descripcion="Opcional. Si lo dejas vacío se usan el nombre y el resumen."
      >
        <Campo etiqueta="Título para buscadores" htmlFor="seo_titulo" error={err.seo_titulo}>
          <Entrada id="seo_titulo" name="seo_titulo" maxLength={70} defaultValue={val("seo_titulo", producto?.seo_titulo)} />
        </Campo>
        <Campo etiqueta="Descripción para buscadores" htmlFor="seo_descripcion" error={err.seo_descripcion}>
          <AreaTexto id="seo_descripcion" name="seo_descripcion" rows={2} maxLength={160} defaultValue={val("seo_descripcion", producto?.seo_descripcion)} />
        </Campo>
      </Seccion>

      <div className="fixed inset-x-0 bottom-0 z-[var(--z-sticky)] lg:left-64 border-t border-line-soft bg-bg/95 px-4 py-3 backdrop-blur-sm">
        <div className="mx-auto flex max-w-3xl items-center justify-end gap-3">
          <Link
            href="/admin/productos"
            className="inline-flex min-h-11 items-center rounded-control px-4 text-sm font-semibold text-ink-muted transition-colors hover:text-ink"
          >
            Cancelar
          </Link>
          <BotonGuardar esEdicion={esEdicion} />
        </div>
      </div>
    </form>
  );
}

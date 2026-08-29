import { ArrowLeft, ExternalLink } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

import { FormularioProducto } from "@/components/panel/formulario-producto";
import { GestorCampos } from "@/components/panel/gestor-campos";
import { GestorImagenes } from "@/components/panel/gestor-imagenes";
import { eliminarProducto } from "@/lib/acciones/productos";
import { crearClienteServidor } from "@/lib/supabase/servidor";

export const metadata = { title: "Editar producto" };

export default async function EditarProducto({
  params,
  searchParams,
}: PageProps<"/admin/productos/[id]">) {
  const { id } = await params;
  const { creado } = await searchParams;

  const supabase = await crearClienteServidor();

  const [{ data: producto }, { data: categorias }, { data: imagenes }, { data: campos }] =
    await Promise.all([
      supabase.from("productos").select("*").eq("id", id).maybeSingle(),
      supabase.from("categorias").select("id, nombre").order("orden"),
      supabase
        .from("producto_imagenes")
        .select("id, url, alt, orden")
        .eq("producto_id", id)
        .order("orden"),
      supabase
        .from("producto_campos")
        .select("id, etiqueta, ayuda, tipo, opciones, requerido, max_largo, orden")
        .eq("producto_id", id)
        .order("orden"),
    ]);

  if (!producto) notFound();

  return (
    <main className="mx-auto max-w-3xl px-4 py-8 pb-32 sm:px-6">
      <Link
        href="/admin/productos"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-ink-muted transition-colors hover:text-ink"
      >
        <ArrowLeft className="size-4" aria-hidden="true" />
        Productos
      </Link>

      <div className="mt-3 flex flex-wrap items-start justify-between gap-3">
        <h1 className="text-xl font-bold tracking-tight">{producto.nombre}</h1>
        {producto.estado === "activo" ? (
          <Link
            href={`/productos/${producto.slug}`}
            target="_blank"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-violeta-txt hover:underline"
          >
            Ver en la tienda
            <ExternalLink className="size-3.5" aria-hidden="true" />
          </Link>
        ) : null}
      </div>

      {creado ? (
        <p
          role="status"
          className="mt-4 rounded-control border border-line-soft bg-verde-tenue px-4 py-2.5 text-sm font-medium text-ink"
        >
          Producto creado. Ahora sube las fotos y define la personalización más
          abajo; cuando esté listo, cámbialo a «Publicado».
        </p>
      ) : null}

      <div className="mt-6">
        <FormularioProducto categorias={categorias ?? []} producto={producto} />
      </div>

      <div className="-mt-20 grid gap-5">
        <GestorImagenes productoId={producto.id} imagenes={imagenes ?? []} />
        <GestorCampos productoId={producto.id} campos={campos ?? []} />

        <section className="rounded-card border border-alerta/30 bg-surface p-5">
          <h2 className="text-base font-bold tracking-tight">Eliminar</h2>
          <p className="mt-1 text-sm text-ink-muted">
            Borra el producto y sus fotos para siempre. Los pedidos que ya lo
            incluyen no se ven afectados: guardan su propia copia del nombre y el
            precio. Si solo quieres sacarlo de la tienda, usa «Sin publicar» o
            «Archivado» más arriba.
          </p>
          <form action={eliminarProducto} className="mt-4">
            <input type="hidden" name="id" value={producto.id} />
            <button
              type="submit"
              className="inline-flex min-h-11 items-center rounded-control border border-alerta/40 px-4 text-sm font-semibold text-alerta transition-colors hover:bg-alerta-tenue"
            >
              Eliminar este producto
            </button>
          </form>
        </section>
      </div>
    </main>
  );
}

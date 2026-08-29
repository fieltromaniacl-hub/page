import { ArrowRight, Package, ShoppingBag } from "lucide-react";
import Link from "next/link";

import { botonPanelVariants } from "@/components/panel/boton-panel";
import { crearClienteServidor } from "@/lib/supabase/servidor";
import { cn, formatearPrecio } from "@/lib/utils";

export const metadata = { title: "Resumen" };

const ETIQUETA_ESTADO: Record<string, string> = {
  recibido: "Recibido",
  contactado: "Contactado",
  confirmado: "Confirmado",
  en_confeccion: "En confección",
  enviado: "Enviado",
  entregado: "Entregado",
  cancelado: "Cancelado",
};

export default async function ResumenPanel() {
  const supabase = await crearClienteServidor();

  const [pendientes, productosActivos, sinPublicar, ultimos] = await Promise.all([
    supabase
      .from("pedidos")
      .select("id", { count: "exact", head: true })
      .in("estado", ["recibido", "contactado", "confirmado", "en_confeccion"]),
    supabase
      .from("productos")
      .select("id", { count: "exact", head: true })
      .eq("estado", "activo"),
    supabase
      .from("productos")
      .select("id", { count: "exact", head: true })
      .eq("estado", "inactivo"),
    supabase
      .from("pedidos")
      .select("id, numero, cliente_nombre, total, estado, creado_en")
      .order("creado_en", { ascending: false })
      .limit(6),
  ]);

  const catalogoVacio = (productosActivos.count ?? 0) === 0 && (sinPublicar.count ?? 0) === 0;

  return (
    <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
      <h1 className="text-xl font-bold tracking-tight">Resumen</h1>

      {catalogoVacio ? (
        <div className="mt-6 rounded-card border border-line-soft bg-surface p-8 text-center">
          <Package
            className="mx-auto size-8 text-ink-muted"
            strokeWidth={1.75}
            aria-hidden="true"
          />
          <h2 className="mt-3 text-base font-bold">
            Todavía no hay productos en la tienda
          </h2>
          <p className="mx-auto mt-2 max-w-md text-sm text-ink-muted">
            Empieza cargando un libro: nombre, precio, fotos y qué datos le vas a
            pedir al cliente para personalizarlo. Puedes dejarlo sin publicar
            mientras lo preparas.
          </p>
          <Link
            href="/admin/productos/nuevo"
            className={cn(botonPanelVariants({ tamano: "lg" }), "mt-5")}
          >
            Cargar el primer producto
          </Link>
        </div>
      ) : (
        <dl className="mt-6 grid gap-4 sm:grid-cols-3">
          <Metrica
            titulo="Pedidos por atender"
            valor={pendientes.count ?? 0}
            href="/admin/pedidos"
          />
          <Metrica
            titulo="Productos publicados"
            valor={productosActivos.count ?? 0}
            href="/admin/productos"
          />
          <Metrica
            titulo="Sin publicar"
            valor={sinPublicar.count ?? 0}
            href="/admin/productos?estado=inactivo"
          />
        </dl>
      )}

      <section className="mt-10">
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-base font-bold tracking-tight">Últimos pedidos</h2>
          {ultimos.data?.length ? (
            <Link
              href="/admin/pedidos"
              className="inline-flex items-center gap-1 text-sm font-medium text-violeta-txt hover:underline"
            >
              Ver todos
              <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
          ) : null}
        </div>

        {ultimos.data?.length ? (
          <ul className="mt-3 divide-y divide-line-soft rounded-card border border-line-soft bg-surface">
            {ultimos.data.map((pedido) => (
              <li key={pedido.id}>
                <Link
                  href={`/admin/pedidos/${pedido.id}`}
                  className="flex flex-wrap items-center gap-x-4 gap-y-1 px-4 py-3 transition-colors hover:bg-surface-2"
                >
                  <span className="font-mono text-sm text-ink-muted">
                    {pedido.numero}
                  </span>
                  <span className="min-w-0 flex-1 truncate text-sm font-medium">
                    {pedido.cliente_nombre}
                  </span>
                  <span className="text-sm text-ink-muted">
                    {ETIQUETA_ESTADO[pedido.estado] ?? pedido.estado}
                  </span>
                  <span className="text-sm font-semibold tabular-nums">
                    {formatearPrecio(pedido.total)}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <div className="mt-3 rounded-card border border-line-soft bg-surface px-4 py-10 text-center">
            <ShoppingBag
              className="mx-auto size-7 text-ink-muted"
              strokeWidth={1.75}
              aria-hidden="true"
            />
            <p className="mt-2 text-sm text-ink-muted">
              Aún no llegan pedidos. Cuando alguien encargue algo, aparecerá aquí
              y te llegará un correo.
            </p>
          </div>
        )}
      </section>
    </main>
  );
}

function Metrica({
  titulo,
  valor,
  href,
}: {
  titulo: string;
  valor: number;
  href: string;
}) {
  return (
    <div className="rounded-card border border-line-soft bg-surface p-4">
      <dt className="text-sm text-ink-muted">{titulo}</dt>
      <dd className="mt-1 text-2xl font-bold tabular-nums">{valor}</dd>
      <Link
        href={href}
        className="mt-2 inline-flex items-center gap-1 text-sm font-medium text-violeta-txt hover:underline"
      >
        Ver
        <ArrowRight className="size-3.5" aria-hidden="true" />
      </Link>
    </div>
  );
}

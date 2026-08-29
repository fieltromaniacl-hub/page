import { ShoppingBag } from "lucide-react";
import Link from "next/link";

import { ETIQUETA_PEDIDO, InsigniaPedido } from "@/components/panel/insignias";
import { crearClienteServidor } from "@/lib/supabase/servidor";
import { cn, formatearPrecio } from "@/lib/utils";

export const metadata = { title: "Pedidos" };

const FILTROS = [
  { valor: "abiertos", texto: "Por atender" },
  { valor: "todos", texto: "Todos" },
  ...Object.entries(ETIQUETA_PEDIDO).map(([valor, texto]) => ({ valor, texto })),
];

const ABIERTOS = ["recibido", "contactado", "confirmado", "en_confeccion"] as const;

function fecha(iso: string) {
  return new Intl.DateTimeFormat("es-CL", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(iso));
}

export default async function ListaPedidos({
  searchParams,
}: PageProps<"/admin/pedidos">) {
  const { estado } = await searchParams;
  const filtro = typeof estado === "string" ? estado : "abiertos";

  const supabase = await crearClienteServidor();

  let consulta = supabase
    .from("pedidos")
    .select(
      "id, numero, cliente_nombre, cliente_email, total, estado, creado_en, correo_enviado",
    )
    .order("creado_en", { ascending: false });

  if (filtro === "abiertos") {
    consulta = consulta.in("estado", [...ABIERTOS]);
  } else if (filtro !== "todos") {
    consulta = consulta.eq("estado", filtro as keyof typeof ETIQUETA_PEDIDO);
  }

  const { data: pedidos } = await consulta;

  return (
    <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <h1 className="text-xl font-bold tracking-tight">Pedidos</h1>

      <nav aria-label="Filtrar pedidos" className="mt-5">
        <ul className="flex flex-wrap gap-2">
          {FILTROS.map((f) => {
            const activo = filtro === f.valor;
            return (
              <li key={f.valor}>
                <Link
                  href={
                    f.valor === "abiertos"
                      ? "/admin/pedidos"
                      : `/admin/pedidos?estado=${f.valor}`
                  }
                  aria-current={activo ? "page" : undefined}
                  className={cn(
                    "inline-flex min-h-9 items-center rounded-pill px-3 text-sm font-medium transition-colors duration-150",
                    activo
                      ? "bg-violeta text-ink-fijo"
                      : "border border-line-soft text-ink-muted hover:border-ink-muted hover:text-ink",
                  )}
                >
                  {f.texto}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {pedidos?.length ? (
        <ul className="mt-6 divide-y divide-line-soft overflow-hidden rounded-card border border-line-soft bg-surface">
          {pedidos.map((pedido) => (
            <li key={pedido.id}>
              <Link
                href={`/admin/pedidos/${pedido.id}`}
                className="flex flex-wrap items-center gap-x-4 gap-y-1 p-4 transition-colors hover:bg-surface-2"
              >
                <span className="font-mono text-sm text-ink-muted">
                  {pedido.numero}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate font-semibold">
                    {pedido.cliente_nombre}
                  </span>
                  <span className="block truncate text-sm text-ink-muted">
                    {pedido.cliente_email} · {fecha(pedido.creado_en)}
                  </span>
                </span>
                {!pedido.correo_enviado ? (
                  <span className="rounded-pill bg-alerta-tenue px-2.5 py-0.5 text-xs font-semibold text-ink">
                    Correo no enviado
                  </span>
                ) : null}
                <InsigniaPedido estado={pedido.estado} />
                <span className="font-semibold tabular-nums">
                  {formatearPrecio(pedido.total)}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <div className="mt-6 rounded-card border border-line-soft bg-surface p-10 text-center">
          <ShoppingBag
            className="mx-auto size-8 text-ink-muted"
            strokeWidth={1.75}
            aria-hidden="true"
          />
          <h2 className="mt-3 text-base font-bold">
            {filtro === "abiertos"
              ? "No hay pedidos por atender"
              : "Ningún pedido con ese filtro"}
          </h2>
          <p className="mx-auto mt-2 max-w-md text-sm text-ink-muted">
            Cuando alguien encargue algo en la tienda, el pedido aparece aquí con
            todos los datos de personalización y te llega un correo.
          </p>
        </div>
      )}
    </main>
  );
}

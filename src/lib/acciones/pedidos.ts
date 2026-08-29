"use server";

import { revalidatePath } from "next/cache";

import { crearClienteServidor } from "@/lib/supabase/servidor";

const ESTADOS = [
  "recibido",
  "contactado",
  "confirmado",
  "en_confeccion",
  "enviado",
  "entregado",
  "cancelado",
] as const;

type EstadoPedido = (typeof ESTADOS)[number];

export async function cambiarEstadoPedido(datos: FormData) {
  const id = String(datos.get("id") ?? "");
  const estado = String(datos.get("estado") ?? "");
  if (!id || !ESTADOS.includes(estado as EstadoPedido)) return;

  const supabase = await crearClienteServidor();
  await supabase
    .from("pedidos")
    .update({ estado: estado as EstadoPedido })
    .eq("id", id);

  revalidatePath("/admin/pedidos");
  revalidatePath(`/admin/pedidos/${id}`);
  revalidatePath("/admin");
}

export async function guardarNotaPedido(datos: FormData) {
  const id = String(datos.get("id") ?? "");
  const notas = String(datos.get("notas") ?? "").trim().slice(0, 2000);
  if (!id) return;

  const supabase = await crearClienteServidor();
  await supabase.from("pedidos").update({ notas: notas || null }).eq("id", id);

  revalidatePath(`/admin/pedidos/${id}`);
}

import "server-only";

import { createClient } from "@supabase/supabase-js";

import type { Database } from "./tipos";

/**
 * Cliente con la clave secreta: **salta todas las políticas RLS**.
 *
 * Existe por una sola razón: crear pedidos. El formulario público no tiene
 * permiso de inserción (a propósito), y el total debe calcularse en el
 * servidor con los precios de la base, nunca con lo que envíe el navegador.
 *
 * El import de `server-only` hace que la compilación falle si este archivo
 * llega por accidente a un componente de cliente y filtre la clave.
 */
export function crearClienteAdministrador() {
  const clave = process.env.SUPABASE_SECRET_KEY;

  if (!clave) {
    throw new Error(
      "Falta SUPABASE_SECRET_KEY. Sin ella no se pueden registrar pedidos.",
    );
  }

  return createClient<Database>(process.env.NEXT_PUBLIC_SUPABASE_URL!, clave, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

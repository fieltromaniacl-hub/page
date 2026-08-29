import { createClient } from "@supabase/supabase-js";

import type { Database } from "./tipos";

/**
 * Cliente sin sesión para las páginas públicas.
 *
 * No lee cookies a propósito: leerlas obligaría a Next a renderizar cada
 * visita en el servidor. Sin ellas, el catálogo y las fichas se generan
 * estáticas y se revalidan cada cierto tiempo, que es mucho más rápido para
 * quien llega desde Facebook y mejor para los buscadores.
 *
 * Solo ve lo que las políticas RLS permiten al público: productos activos.
 */
export function crearClientePublico() {
  return createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    { auth: { persistSession: false, autoRefreshToken: false } },
  );
}

import { createBrowserClient } from "@supabase/ssr";

import type { Database } from "./tipos";

/**
 * Cliente para componentes que corren en el navegador (formularios del panel).
 * Usa la clave publicable: todo lo que haga queda sujeto a las políticas RLS.
 */
export function crearClienteNavegador() {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
  );
}

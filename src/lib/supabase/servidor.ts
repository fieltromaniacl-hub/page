import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

import type { Database } from "./tipos";

/**
 * Cliente para componentes de servidor y manejadores de ruta. Lee la sesión
 * desde las cookies, así que sabe si quien pide es un administrador conectado.
 * Sigue sujeto a RLS: es el cliente correcto para todo salvo crear pedidos.
 */
export async function crearClienteServidor() {
  const almacenCookies = await cookies();

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return almacenCookies.getAll();
        },
        setAll(cookiesNuevas) {
          try {
            for (const { name, value, options } of cookiesNuevas) {
              almacenCookies.set(name, value, options);
            }
          } catch {
            // Los componentes de servidor no pueden escribir cookies. El
            // middleware ya refrescó la sesión, así que aquí se puede ignorar.
          }
        },
      },
    },
  );
}

import type { NextRequest } from "next/server";

import { actualizarSesion } from "@/lib/supabase/middleware";

export async function middleware(peticion: NextRequest) {
  return actualizarSesion(peticion);
}

export const config = {
  matcher: [
    /*
     * Todas las rutas salvo archivos estáticos e imágenes. Se incluye el sitio
     * público para que la sesión se mantenga fresca al navegar entre la tienda
     * y el panel.
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|avif|ico)$).*)",
  ],
};

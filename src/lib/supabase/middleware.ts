import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

import type { Database } from "./tipos";

/**
 * Refresca la sesión en cada petición y protege /admin.
 *
 * Aquí solo se comprueba que haya sesión iniciada, no que la persona sea
 * administradora: eso lo resuelve el layout del panel con una consulta a la
 * tabla `admins`. Separarlo evita una consulta a la base en cada navegación y
 * deja la autorización donde puede fallar de forma legible.
 */
export async function actualizarSesion(peticion: NextRequest) {
  let respuesta = NextResponse.next({ request: peticion });

  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return peticion.cookies.getAll();
        },
        setAll(cookiesNuevas) {
          for (const { name, value } of cookiesNuevas) {
            peticion.cookies.set(name, value);
          }
          respuesta = NextResponse.next({ request: peticion });
          for (const { name, value, options } of cookiesNuevas) {
            respuesta.cookies.set(name, value, options);
          }
        },
      },
    },
  );

  // getUser() valida el token contra Supabase. No usar getSession() aquí: lee
  // la cookie sin verificarla y se puede falsificar.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const ruta = peticion.nextUrl.pathname;
  const esRutaProtegida = ruta.startsWith("/admin") && ruta !== "/admin/entrar";

  if (esRutaProtegida && !user) {
    const destino = peticion.nextUrl.clone();
    destino.pathname = "/admin/entrar";
    destino.searchParams.set("volver", ruta);
    return NextResponse.redirect(destino);
  }

  // Ya conectada: no tiene sentido mostrarle el formulario de acceso.
  if (ruta === "/admin/entrar" && user) {
    const destino = peticion.nextUrl.clone();
    destino.pathname = "/admin";
    destino.search = "";
    return NextResponse.redirect(destino);
  }

  return respuesta;
}

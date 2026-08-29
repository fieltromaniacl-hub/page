import { redirect } from "next/navigation";

import { NavegacionPanel } from "@/components/panel/navegacion";
import { crearClienteServidor } from "@/lib/supabase/servidor";

export const metadata = {
  robots: { index: false, follow: false },
};

/**
 * Autorización del panel.
 *
 * El middleware ya garantizó que hay sesión iniciada. Aquí se comprueba lo
 * distinto: que esa persona esté en la tabla `admins`. Tener cuenta en Auth no
 * basta, porque en el futuro los clientes también podrían tener cuenta.
 */
export default async function LayoutPanel({
  children,
}: LayoutProps<"/admin">) {
  const supabase = await crearClienteServidor();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/admin/entrar");

  const { data: admin } = await supabase
    .from("admins")
    .select("user_id, nombre")
    .eq("user_id", user.id)
    .maybeSingle();

  if (!admin) {
    return (
      <main className="grid min-h-dvh place-items-center px-4 text-center">
        <div className="max-w-md">
          <h1 className="text-xl font-bold">Esta cuenta no tiene acceso</h1>
          <p className="mt-2 text-ink-muted">
            Iniciaste sesión como <strong>{user.email}</strong>, pero esa cuenta
            no está autorizada para administrar la tienda.
          </p>
        </div>
      </main>
    );
  }

  return (
    <div className="min-h-dvh lg:grid lg:grid-cols-[16rem_1fr]">
      <NavegacionPanel
        correo={user.email ?? ""}
        nombre={admin.nombre ?? undefined}
      />
      <div className="min-w-0">{children}</div>
    </div>
  );
}

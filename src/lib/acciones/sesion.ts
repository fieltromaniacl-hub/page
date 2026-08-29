"use server";

import { redirect } from "next/navigation";
import { z } from "zod";

import { crearClienteServidor } from "@/lib/supabase/servidor";

const esquemaAcceso = z.object({
  correo: z.email("Ese correo no parece válido."),
  clave: z.string().min(1, "Escribe tu contraseña."),
});

export type EstadoAcceso = { error?: string };

export async function entrar(
  _previo: EstadoAcceso,
  datos: FormData,
): Promise<EstadoAcceso> {
  const analisis = esquemaAcceso.safeParse({
    correo: datos.get("correo"),
    clave: datos.get("clave"),
  });

  if (!analisis.success) {
    return { error: analisis.error.issues[0].message };
  }

  const supabase = await crearClienteServidor();
  const { error } = await supabase.auth.signInWithPassword({
    email: analisis.data.correo,
    password: analisis.data.clave,
  });

  if (error) {
    // Mensaje deliberadamente vago: distinguir "correo no existe" de
    // "contraseña incorrecta" le confirma a un atacante qué cuentas existen.
    return { error: "Correo o contraseña incorrectos." };
  }

  const volver = datos.get("volver");
  const destino =
    typeof volver === "string" && volver.startsWith("/admin") ? volver : "/admin";

  // redirect() lanza una excepción de control: va fuera de cualquier try.
  redirect(destino);
}

export async function salir() {
  const supabase = await crearClienteServidor();
  await supabase.auth.signOut();
  redirect("/admin/entrar");
}

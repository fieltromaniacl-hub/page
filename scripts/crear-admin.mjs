#!/usr/bin/env node
/**
 * Crea la cuenta de administración de la tienda.
 *
 * Uso:  pnpm admin:crear correo@ejemplo.com
 *
 * Hace dos cosas que deben ir juntas: crear el usuario en Supabase Auth y
 * registrarlo en la tabla `admins`. Tener cuenta no da acceso al panel; estar
 * en `admins` sí. La contraseña se pide por teclado y no queda en el historial
 * de la terminal ni en ningún archivo.
 */
import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "node:fs";
import { createInterface } from "node:readline";

function cargarEntorno() {
  const texto = readFileSync(new URL("../.env.local", import.meta.url), "utf8");
  for (const linea of texto.split("\n")) {
    if (!linea.trim() || linea.trimStart().startsWith("#")) continue;
    const i = linea.indexOf("=");
    if (i === -1) continue;
    process.env[linea.slice(0, i).trim()] ??= linea.slice(i + 1).trim();
  }
}

/** Pide una contraseña silenciando el eco del terminal. */
function preguntarClave(mensaje) {
  return new Promise((resolver) => {
    const rl = createInterface({
      input: process.stdin,
      output: process.stdout,
      terminal: true,
    });
    process.stdout.write(mensaje);
    // Anula el eco: readline escribe cada carácter tecleado a través de esto.
    rl._writeToOutput = () => {};
    rl.question("", (valor) => {
      rl.close();
      process.stdout.write("\n");
      resolver(valor);
    });
  });
}

const correo = process.argv[2];
if (!correo || !correo.includes("@")) {
  console.error("Uso: pnpm admin:crear correo@ejemplo.com");
  process.exit(1);
}

cargarEntorno();

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const claveSecreta = process.env.SUPABASE_SECRET_KEY;
if (!url || !claveSecreta) {
  console.error(
    "Faltan NEXT_PUBLIC_SUPABASE_URL o SUPABASE_SECRET_KEY en .env.local",
  );
  process.exit(1);
}

const contrasena = await preguntarClave(`Contraseña para ${correo}: `);
if (contrasena.length < 10) {
  console.error("La contraseña debe tener al menos 10 caracteres.");
  process.exit(1);
}
const repetida = await preguntarClave("Repítela: ");
if (contrasena !== repetida) {
  console.error("Las contraseñas no coinciden.");
  process.exit(1);
}

const supabase = createClient(url, claveSecreta, {
  auth: { persistSession: false, autoRefreshToken: false },
});

// Si la cuenta ya existe se reutiliza y se le actualiza la contraseña,
// en vez de fallar y dejar a la persona sin forma de entrar.
let idUsuario;
const creado = await supabase.auth.admin.createUser({
  email: correo,
  password: contrasena,
  email_confirm: true,
});

if (creado.error) {
  const yaExiste = /already been registered|already exists/i.test(
    creado.error.message,
  );
  if (!yaExiste) {
    console.error("No se pudo crear el usuario:", creado.error.message);
    process.exit(1);
  }
  const { data, error } = await supabase.auth.admin.listUsers({ perPage: 1000 });
  if (error) {
    console.error("No se pudo buscar el usuario existente:", error.message);
    process.exit(1);
  }
  const encontrado = data.users.find(
    (u) => u.email?.toLowerCase() === correo.toLowerCase(),
  );
  if (!encontrado) {
    console.error("El usuario existe pero no se pudo localizar.");
    process.exit(1);
  }
  idUsuario = encontrado.id;
  await supabase.auth.admin.updateUserById(idUsuario, { password: contrasena });
  console.log("La cuenta ya existía: se actualizó la contraseña.");
} else {
  idUsuario = creado.data.user.id;
  console.log("Usuario creado en Supabase Auth.");
}

const { error: errorAdmin } = await supabase
  .from("admins")
  .upsert({ user_id: idUsuario }, { onConflict: "user_id" });

if (errorAdmin) {
  console.error("No se pudo autorizar en la tabla admins:", errorAdmin.message);
  process.exit(1);
}

console.log(`\nListo. ${correo} ya puede entrar en /admin/entrar`);

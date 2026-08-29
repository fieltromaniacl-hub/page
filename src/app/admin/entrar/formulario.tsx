"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";

import { BotonPanel } from "@/components/panel/boton-panel";
import { Campo, Entrada } from "@/components/panel/campos";
import { entrar, type EstadoAcceso } from "@/lib/acciones/sesion";

function BotonEnviar() {
  const { pending } = useFormStatus();
  return (
    <BotonPanel type="submit" tamano="lg" className="w-full" disabled={pending}>
      {pending ? "Entrando…" : "Entrar"}
    </BotonPanel>
  );
}

export function FormularioAcceso({ volver }: { volver?: string }) {
  const [estado, accion] = useActionState<EstadoAcceso, FormData>(entrar, {});

  return (
    <form action={accion} className="grid gap-4">
      {volver ? <input type="hidden" name="volver" value={volver} /> : null}

      <Campo etiqueta="Correo" htmlFor="correo" requerido>
        <Entrada
          id="correo"
          name="correo"
          type="email"
          autoComplete="username"
          required
          autoFocus
          aria-invalid={estado.error ? true : undefined}
        />
      </Campo>

      <Campo etiqueta="Contraseña" htmlFor="clave" requerido>
        <Entrada
          id="clave"
          name="clave"
          type="password"
          autoComplete="current-password"
          required
          aria-invalid={estado.error ? true : undefined}
        />
      </Campo>

      {estado.error ? (
        <p
          role="alert"
          className="rounded-control border border-alerta/40 bg-alerta-tenue px-3 py-2 text-sm font-medium text-ink"
        >
          {estado.error}
        </p>
      ) : null}

      <BotonEnviar />
    </form>
  );
}

"use client";

import { Check, RotateCcw } from "lucide-react";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";

import { BotonPanel } from "@/components/panel/boton-panel";
import { AreaTexto, Campo, Entrada } from "@/components/panel/campos";
import {
  guardarAjustes,
  restablecerAjuste,
  type EstadoAjustes,
} from "@/lib/acciones/ajustes";
import { ajustesPorGrupo, type Ajustes } from "@/lib/ajustes";

function BotonGuardar() {
  const { pending } = useFormStatus();
  return (
    <BotonPanel type="submit" disabled={pending}>
      {pending ? "Guardando…" : "Guardar cambios"}
    </BotonPanel>
  );
}

export function FormularioAjustes({ valores }: { valores: Ajustes }) {
  const [estado, accion] = useActionState<EstadoAjustes, FormData>(
    guardarAjustes,
    {},
  );

  const err = estado.errores ?? {};
  const grupos = ajustesPorGrupo();

  return (
    <form action={accion} className="grid gap-8">
      {estado.error ? (
        <p
          role="alert"
          className="rounded-control border border-alerta bg-alerta-tenue px-4 py-3 text-sm font-medium"
        >
          {estado.error}
        </p>
      ) : null}

      {estado.guardado ? (
        <p
          role="status"
          className="inline-flex items-center gap-2 rounded-control border border-line-soft bg-verde-tenue px-4 py-3 text-sm font-medium text-verde-txt"
        >
          <Check className="size-4 shrink-0" aria-hidden="true" />
          Listo. Los cambios ya se ven en la tienda.
        </p>
      ) : null}

      {grupos.map(({ grupo, campos }) => (
        <section key={grupo} className="grid gap-4">
          <h2 className="border-b border-line-soft pb-2 text-base font-bold tracking-tight">
            {grupo}
          </h2>

          {campos.map(({ clave, def }) => {
            // Lo enviado gana sobre lo guardado: si la validación falla, ella
            // no pierde lo que había escrito.
            const valor = estado.valores?.[clave] ?? valores[clave];
            const modificado = valor !== def.porDefecto;

            const comunes = {
              id: clave,
              name: clave,
              defaultValue: valor,
              maxLength: def.maxLargo,
              "aria-invalid": err[clave] ? true : undefined,
              "aria-describedby": err[clave] ? `${clave}-error` : `${clave}-ayuda`,
            };

            return (
              <Campo
                key={clave}
                htmlFor={clave}
                etiqueta={def.etiqueta}
                ayuda={
                  <>
                    {def.ayuda}
                    <span className="mt-1 block text-ink-muted">
                      Se ve en: {def.dondeSeVe}.
                    </span>
                  </>
                }
                error={err[clave]}
              >
                <div className="grid gap-1.5">
                  {def.tipo === "parrafo" ? (
                    <AreaTexto rows={3} {...comunes} />
                  ) : (
                    <Entrada
                      type={def.tipo === "correo" ? "email" : "text"}
                      {...comunes}
                    />
                  )}

                  {/* Solo cuando hay algo que deshacer: un botón permanente
                      sería ruido en un panel que debe explicarse solo. */}
                  {modificado ? (
                    <p>
                      <button
                        type="submit"
                        formAction={restablecerAjuste}
                        name="clave"
                        value={clave}
                        className="inline-flex min-h-11 items-center gap-1.5 rounded-control text-sm font-medium text-ink-muted transition-colors duration-150 hover:text-ink"
                      >
                        <RotateCcw className="size-3.5 shrink-0" aria-hidden="true" />
                        Volver al texto original
                      </button>
                    </p>
                  ) : null}
                </div>
              </Campo>
            );
          })}
        </section>
      ))}

      <div className="sticky bottom-0 -mx-4 flex flex-wrap items-center gap-3 border-t border-line-soft bg-surface-2 px-4 py-3 sm:-mx-6 sm:px-6">
        <BotonGuardar />
        <p className="text-sm text-ink-muted">
          Los cambios se ven en la tienda apenas guardas.
        </p>
      </div>
    </form>
  );
}

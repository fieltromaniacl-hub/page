"use client";

import { Pencil, Plus, Trash2, X } from "lucide-react";
import { useActionState, useState } from "react";
import { useFormStatus } from "react-dom";

import { BotonPanel } from "@/components/panel/boton-panel";
import { AreaTexto, Campo, Entrada, Seleccion } from "@/components/panel/campos";
import { eliminarCampo, guardarCampo, type EstadoCampo } from "@/lib/acciones/campos";

type TipoCampo = "texto" | "parrafo" | "opcion" | "color" | "numero";

type CampoPersonalizacion = {
  id: string;
  etiqueta: string;
  ayuda: string | null;
  tipo: TipoCampo;
  opciones: string[];
  requerido: boolean;
  max_largo: number | null;
  orden: number;
};

const NOMBRE_TIPO: Record<TipoCampo, string> = {
  texto: "Texto corto",
  parrafo: "Texto largo",
  opcion: "Lista de alternativas",
  color: "Color a elegir",
  numero: "Número",
};

function BotonGuardar({ editando }: { editando: boolean }) {
  const { pending } = useFormStatus();
  return (
    <BotonPanel type="submit" disabled={pending}>
      {pending ? "Guardando…" : editando ? "Guardar cambios" : "Agregar pregunta"}
    </BotonPanel>
  );
}

/**
 * El formulario se monta con `key={estado.sello}`, así que cada respuesta del
 * servidor lo reconstruye entero. Eso mantiene el estado de React y el DOM en
 * la misma página: React 19 reinicia el DOM del formulario al terminar una
 * acción, pero no el estado de los componentes, y un `select` controlado
 * quedaba mostrando una opción distinta de la seleccionada.
 */
function FormularioCampo({
  productoId,
  editando,
  estado,
  accion,
  ordenPorDefecto,
  alCerrar,
}: {
  productoId: string;
  editando: CampoPersonalizacion | null;
  estado: EstadoCampo;
  accion: (datos: FormData) => void;
  ordenPorDefecto: number;
  alCerrar: () => void;
}) {
  const previo = estado.valores;
  const [tipo, setTipo] = useState<TipoCampo>(
    (previo?.tipo as TipoCampo) ?? editando?.tipo ?? "texto",
  );

  const err = estado.errores ?? {};
  const necesitaOpciones = tipo === "opcion" || tipo === "color";

  return (
    <form
      action={accion}
      className="mt-4 grid gap-4 rounded-control border border-line-soft bg-surface-2 p-4"
    >
      <input type="hidden" name="producto_id" value={productoId} />
      {editando ? <input type="hidden" name="id" value={editando.id} /> : null}

      <div className="flex items-center justify-between gap-3">
        <h3 className="text-sm font-bold">
          {editando ? `Editando «${editando.etiqueta}»` : "Nueva pregunta"}
        </h3>
        <button
          type="button"
          onClick={alCerrar}
          aria-label="Cerrar"
          className="grid size-8 place-items-center rounded-control text-ink-muted hover:text-ink"
        >
          <X className="size-4" aria-hidden="true" />
        </button>
      </div>

      {err._ ? (
        <p
          role="alert"
          className="rounded-control border border-alerta/40 bg-alerta-tenue px-3 py-2 text-sm font-medium"
        >
          {err._}
        </p>
      ) : null}

      <Campo
        etiqueta="Qué le preguntas"
        htmlFor="etiqueta"
        error={err.etiqueta}
        requerido
        ayuda="Ejemplo: «Nombre a bordar en la portada»"
      >
        <Entrada
          id="etiqueta"
          name="etiqueta"
          defaultValue={previo?.etiqueta ?? editando?.etiqueta ?? ""}
          aria-invalid={err.etiqueta ? true : undefined}
          required
        />
      </Campo>

      <Campo
        etiqueta="Aclaración"
        htmlFor="ayuda"
        error={err.ayuda}
        ayuda="Opcional. Aparece bajo el campo, en letra chica."
      >
        <Entrada
          id="ayuda"
          name="ayuda"
          defaultValue={previo?.ayuda ?? editando?.ayuda ?? ""}
          placeholder="Máximo 12 letras"
        />
      </Campo>

      <div className="grid gap-4 sm:grid-cols-2">
        <Campo etiqueta="Tipo de respuesta" htmlFor="tipo" error={err.tipo}>
          <Seleccion
            id="tipo"
            name="tipo"
            value={tipo}
            onChange={(e) => setTipo(e.target.value as TipoCampo)}
          >
            {Object.entries(NOMBRE_TIPO).map(([valor, texto]) => (
              <option key={valor} value={valor}>
                {texto}
              </option>
            ))}
          </Seleccion>
        </Campo>

        <Campo
          etiqueta="Máximo de caracteres"
          htmlFor="max_largo"
          error={err.max_largo}
          ayuda="Opcional. Útil para lo que se borda."
        >
          <Entrada
            id="max_largo"
            name="max_largo"
            type="number"
            min={1}
            step={1}
            defaultValue={previo?.max_largo ?? editando?.max_largo ?? ""}
          />
        </Campo>
      </div>

      {necesitaOpciones ? (
        <Campo
          etiqueta="Alternativas"
          htmlFor="opciones"
          error={err.opciones}
          requerido
          ayuda="Una por línea."
        >
          <AreaTexto
            id="opciones"
            name="opciones"
            rows={4}
            defaultValue={previo?.opciones ?? editando?.opciones.join("\n") ?? ""}
            placeholder={"Rosado\nCeleste\nVerde\nAmarillo"}
            aria-invalid={err.opciones ? true : undefined}
          />
        </Campo>
      ) : null}

      <label className="flex min-h-11 items-center gap-3">
        <input
          type="checkbox"
          name="requerido"
          defaultChecked={
            previo ? previo.requerido === "true" : (editando?.requerido ?? true)
          }
          className="size-5 shrink-0 rounded border-line-soft accent-[var(--violeta)]"
        />
        <span className="text-sm font-semibold">
          Obligatorio: no puede comprar sin responder
        </span>
      </label>

      <input
        type="hidden"
        name="orden"
        value={editando?.orden ?? ordenPorDefecto}
      />

      <div className="flex justify-end">
        <BotonGuardar editando={Boolean(editando)} />
      </div>
    </form>
  );
}

export function GestorCampos({
  productoId,
  campos,
}: {
  productoId: string;
  campos: CampoPersonalizacion[];
}) {
  const [estado, accion] = useActionState<EstadoCampo, FormData>(guardarCampo, {});
  const [abierto, setAbierto] = useState(false);
  const [editando, setEditando] = useState<CampoPersonalizacion | null>(null);

  /**
   * Al guardar con éxito se cierra el formulario. Se ajusta durante el
   * renderizado en vez de con un efecto: React vuelve a renderizar de
   * inmediato sin llegar a pintar el estado intermedio.
   */
  const [selloVisto, setSelloVisto] = useState(estado.sello);
  if (estado.sello !== selloVisto) {
    setSelloVisto(estado.sello);
    if (estado.exito) {
      setAbierto(false);
      setEditando(null);
    }
  }

  return (
    <section className="rounded-card border border-line-soft bg-surface p-5">
      <h2 className="text-base font-bold tracking-tight">Personalización</h2>
      <p className="mt-1 text-sm text-ink-muted">
        Lo que le vas a preguntar al cliente cuando compre este producto. Las
        respuestas llegan en el correo del pedido, así no tienes que pedirlas
        después por mensaje.
      </p>

      {campos.length ? (
        <ul className="mt-4 divide-y divide-line-soft rounded-control border border-line-soft">
          {campos.map((campo) => (
            <li key={campo.id} className="flex flex-wrap items-start gap-3 p-3">
              <div className="min-w-0 flex-1">
                <p className="font-semibold">
                  {campo.etiqueta}
                  <span className="ml-2 text-xs font-medium text-ink-muted">
                    {campo.requerido ? "obligatorio" : "opcional"}
                  </span>
                </p>
                <p className="mt-0.5 text-sm text-ink-muted">
                  {NOMBRE_TIPO[campo.tipo]}
                  {campo.opciones.length ? ` · ${campo.opciones.join(", ")}` : ""}
                  {campo.max_largo ? ` · máximo ${campo.max_largo} caracteres` : ""}
                </p>
                {campo.ayuda ? (
                  <p className="mt-0.5 text-sm text-ink-muted">«{campo.ayuda}»</p>
                ) : null}
              </div>

              <div className="flex shrink-0 items-center gap-1">
                <button
                  type="button"
                  onClick={() => {
                    setEditando(campo);
                    setAbierto(true);
                  }}
                  aria-label={`Editar ${campo.etiqueta}`}
                  className="grid size-9 place-items-center rounded-control text-ink-muted transition-colors hover:bg-surface-2 hover:text-ink"
                >
                  <Pencil className="size-4" aria-hidden="true" />
                </button>
                <form action={eliminarCampo}>
                  <input type="hidden" name="id" value={campo.id} />
                  <input type="hidden" name="producto_id" value={productoId} />
                  <button
                    type="submit"
                    aria-label={`Eliminar ${campo.etiqueta}`}
                    className="grid size-9 place-items-center rounded-control text-ink-muted transition-colors hover:bg-alerta-tenue hover:text-alerta"
                  >
                    <Trash2 className="size-4" aria-hidden="true" />
                  </button>
                </form>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-4 rounded-control border border-dashed border-line-soft px-4 py-6 text-center text-sm text-ink-muted">
          Sin preguntas de personalización. Si este producto lleva el nombre del
          niño, agrégala aquí.
        </p>
      )}

      {abierto ? (
        <FormularioCampo
          key={estado.sello ?? editando?.id ?? "nuevo"}
          productoId={productoId}
          editando={editando}
          estado={estado}
          accion={accion}
          ordenPorDefecto={campos.length}
          alCerrar={() => {
            setAbierto(false);
            setEditando(null);
          }}
        />
      ) : (
        <BotonPanel
          type="button"
          variante="neutro"
          onClick={() => {
            setEditando(null);
            setAbierto(true);
          }}
          className="mt-4 gap-1.5"
        >
          <Plus className="size-4" aria-hidden="true" />
          Agregar pregunta
        </BotonPanel>
      )}
    </section>
  );
}

import { obtenerAjustes } from "@/lib/contenido";

import { FormularioAjustes } from "./formulario";

export const metadata = { title: "Textos del sitio" };

// Lee siempre lo último: si acaba de guardar, tiene que verlo reflejado.
export const dynamic = "force-dynamic";

export default async function PaginaAjustes() {
  const valores = await obtenerAjustes();

  return (
    <main className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      <h1 className="text-xl font-bold tracking-tight">Textos del sitio</h1>
      <p className="mt-1 text-sm text-ink-muted">
        Frases que se repiten en varias partes de la tienda. Se escriben una vez
        aquí y cambian en todos los lugares donde aparecen.
      </p>

      <div className="mt-6">
        <FormularioAjustes valores={valores} soloGrupos={["Pago y entrega", "Contacto"]} />
      </div>
    </main>
  );
}

import type { Metadata } from "next";

import { PaginaCarrito } from "@/components/tienda/pagina-carrito";
import { obtenerAjustes } from "@/lib/contenido";

export const metadata: Metadata = {
  title: "Tu pedido",
  description: "Revisa tu pedido y déjanos tus datos para que te contactemos.",
  robots: { index: false, follow: true },
};

export default async function Carrito() {
  const ajustes = await obtenerAjustes();

  return (
    <div className="mx-auto max-w-[76rem] px-4 py-10 sm:px-6 lg:py-14">
      <PaginaCarrito
        promesaDePago={ajustes.pago_promesa}
        notaDeDespacho={ajustes.despacho_nota}
      />
    </div>
  );
}

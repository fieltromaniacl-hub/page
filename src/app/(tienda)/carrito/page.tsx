import type { Metadata } from "next";

import { PaginaCarrito } from "@/components/tienda/pagina-carrito";

export const metadata: Metadata = {
  title: "Tu pedido",
  description: "Revisa tu pedido y déjanos tus datos para que te contactemos.",
  robots: { index: false, follow: true },
};

export default function Carrito() {
  return (
    <div className="mx-auto max-w-[76rem] px-4 py-10 sm:px-6 lg:py-14">
      <PaginaCarrito />
    </div>
  );
}

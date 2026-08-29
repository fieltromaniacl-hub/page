import { Hand, Leaf, Sparkles } from "lucide-react";
import Link from "next/link";

import { Encabezado } from "@/components/layout/encabezado";
import { Pie } from "@/components/layout/pie";
import { EscenaFieltro } from "@/components/marca/escena-fieltro";
import { botonVariants } from "@/components/ui/boton";
import { cn } from "@/lib/utils";

const GARANTIAS = [
  {
    Icono: Hand,
    titulo: "Cosido a mano",
    texto: "Cada libro lo corta y cose una persona, pieza por pieza.",
  },
  {
    Icono: Leaf,
    titulo: "Materiales sostenibles",
    texto: "Fieltro sin tóxicos, seguro para la boca y las manos pequeñas.",
  },
  {
    Icono: Sparkles,
    titulo: "Con su nombre",
    texto: "Personalizamos la portada y las páginas con el nombre del niño.",
  },
];

const ETAPAS = [
  {
    edad: "1 a 2 años",
    titulo: "Descubrir con las manos",
    texto:
      "Texturas, solapas y piezas grandes. Trabajan la motricidad gruesa y la permanencia del objeto.",
    fondo: "bg-violeta-tenue",
  },
  {
    edad: "3 a 4 años",
    titulo: "Abrochar, encajar, contar",
    texto:
      "Botones, cierres y cordones. Motricidad fina, secuencias y primeros números.",
    fondo: "bg-verde-tenue",
  },
  {
    edad: "5 a 7 años",
    titulo: "Leer y crear historias",
    texto:
      "Letras, relojes y escenarios completos. Lectura temprana y juego simbólico.",
    fondo: "bg-naranja-tenue",
  },
];

const PASOS = [
  {
    numero: "1",
    titulo: "Eliges y personalizas",
    texto:
      "Escoges el libro, nos dices el nombre del niño y los colores que prefieres.",
  },
  {
    numero: "2",
    titulo: "Recibimos tu pedido",
    texto:
      "Te llega un correo de confirmación al instante y nosotros nos ponemos en contacto contigo.",
  },
  {
    numero: "3",
    titulo: "Acordamos pago y entrega",
    texto:
      "Coordinamos contigo la forma de pago y el despacho. Recién ahí empieza la confección.",
  },
];

export default function Inicio() {
  return (
    <>
      <Encabezado />

      <main id="contenido" className="flex-1">
        {/* Portada */}
        <section className="mx-auto grid max-w-[76rem] items-center gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16 lg:py-20">
          <div>
            <p className="inline-flex items-center rounded-pill border-2 border-line bg-verde-tenue px-4 py-1.5 font-display text-sm font-bold tracking-tight text-verde-txt">
              Hecho a mano en Chile
            </p>

            <h1 className="mt-5 text-[length:var(--text-display)] leading-[0.98]">
              Un libro de fieltro con su nombre en la portada
            </h1>

            <p className="mt-5 max-w-[52ch] text-[length:var(--text-sub)] leading-relaxed text-ink-muted">
              Libros de estimulación para niños de 1 a 7 años, cosidos uno por
              uno y personalizados para tu hijo. Cada página trabaja una
              habilidad distinta.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/libros"
                className={cn(botonVariants({ tamano: "lg" }))}
              >
                Ver los libros
              </Link>
              <Link
                href="/como-funciona"
                className={cn(
                  botonVariants({ variante: "secundario", tamano: "lg" }),
                )}
              >
                Cómo se encarga
              </Link>
            </div>

            <p className="mt-5 text-sm text-ink-muted">
              El pago y la entrega se coordinan contigo por correo o WhatsApp.
              Sin pagar nada por adelantado en el sitio.
            </p>
          </div>

          <EscenaFieltro className="mx-auto w-full max-w-lg" />
        </section>

        {/* Garantías */}
        <section
          aria-label="Por qué comprar en Fieltromanía"
          className="border-y-[3px] border-line bg-surface-2"
        >
          <ul className="mx-auto grid max-w-[76rem] gap-8 px-4 py-10 sm:px-6 md:grid-cols-3">
            {GARANTIAS.map(({ Icono, titulo, texto }) => (
              <li key={titulo} className="flex gap-4">
                <span className="grid size-12 shrink-0 place-items-center rounded-control border-2 border-line bg-surface text-ink">
                  <Icono className="size-6" strokeWidth={2.25} aria-hidden="true" />
                </span>
                <div>
                  <h2 className="font-display text-lg font-bold tracking-tight">
                    {titulo}
                  </h2>
                  <p className="mt-1 text-ink-muted">{texto}</p>
                </div>
              </li>
            ))}
          </ul>
        </section>

        {/* Etapas */}
        <section className="mx-auto max-w-[76rem] px-4 py-16 sm:px-6 lg:py-24">
          <h2 className="max-w-[20ch] text-[length:var(--text-titulo)] leading-[1.05]">
            Cada edad necesita un libro distinto
          </h2>
          <p className="mt-4 max-w-[60ch] text-ink-muted">
            No es el mismo juguete a los dos que a los seis. Elige por la etapa
            en la que está tu hijo y cada página tendrá sentido.
          </p>

          <ul className="mt-10 grid gap-5 md:grid-cols-3">
            {ETAPAS.map((etapa) => (
              <li
                key={etapa.edad}
                className={cn(
                  "rounded-card border-[3px] border-line p-6 transition-[translate,box-shadow] duration-200 ease-[var(--ease-salida)] hover:-translate-x-1 hover:-translate-y-1 hover:shadow-solida-lg motion-reduce:hover:translate-x-0 motion-reduce:hover:translate-y-0",
                  etapa.fondo,
                )}
              >
                <p className="inline-flex items-center rounded-pill border-2 border-line bg-surface px-3 py-1 font-display text-sm font-bold tracking-tight text-ink">
                  {etapa.edad}
                </p>
                <h3 className="mt-2 text-[length:var(--text-sub)] leading-tight">
                  {etapa.titulo}
                </h3>
                <p className="mt-3 text-ink/85">{etapa.texto}</p>
              </li>
            ))}
          </ul>
        </section>

        {/* Cómo funciona */}
        <section
          id="como-funciona"
          className="border-y-[3px] border-line bg-surface-2"
        >
          <div className="mx-auto max-w-[76rem] px-4 py-16 sm:px-6 lg:py-24">
            <h2 className="max-w-[22ch] text-[length:var(--text-titulo)] leading-[1.05]">
              Es un encargo, no una compra al paso
            </h2>
            <p className="mt-4 max-w-[60ch] text-ink-muted">
              Los productos se hacen después de que pides. Por eso conversamos
              contigo antes de cobrar nada.
            </p>

            <ol className="mt-10 grid gap-6 md:grid-cols-3">
              {PASOS.map((paso) => (
                <li key={paso.numero} className="flex gap-4">
                  <span
                    aria-hidden="true"
                    className="grid size-11 shrink-0 place-items-center rounded-pill border-2 border-line bg-naranja font-display text-lg font-extrabold text-[oklch(0.17_0.022_292)]"
                  >
                    {paso.numero}
                  </span>
                  <div>
                    <h3 className="font-display text-lg font-bold tracking-tight">
                      {paso.titulo}
                    </h3>
                    <p className="mt-1 text-ink-muted">{paso.texto}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* Cierre */}
        <section className="mx-auto max-w-[76rem] px-4 py-16 sm:px-6 lg:py-24">
          <div className="rounded-card border-[3px] border-line bg-violeta-tenue p-8 text-center sm:p-12">
            <h2 className="mx-auto max-w-[24ch] text-[length:var(--text-titulo)] leading-[1.05]">
              ¿Buscas un regalo que le dure años?
            </h2>
            <p className="mx-auto mt-4 max-w-[56ch] text-ink/85">
              Cuéntanos la edad del niño y te ayudamos a elegir el libro
              adecuado. Respondemos por correo o por WhatsApp.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Link
                href="/productos"
                className={cn(botonVariants({ tamano: "lg" }))}
              >
                Ver el catálogo
              </Link>
              <Link
                href="/contacto"
                className={cn(
                  botonVariants({ variante: "secundario", tamano: "lg" }),
                )}
              >
                Escribirnos
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Pie />
    </>
  );
}

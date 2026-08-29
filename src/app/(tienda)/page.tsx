import { ArrowRight, Hand, Leaf, Type } from "lucide-react";
import Link from "next/link";

import { EscenaFieltro } from "@/components/marca/escena-fieltro";
import { EnlaceWhatsapp } from "@/components/tienda/enlace-whatsapp";
import { TarjetaProducto } from "@/components/tienda/tarjeta-producto";
import { botonVariants } from "@/components/ui/boton";
import { obtenerDestacados } from "@/lib/consultas";
import { cn } from "@/lib/utils";

// La portada muestra productos, así que se regenera con el catálogo.
export const revalidate = 300;

const ETAPAS = [
  {
    edad: "1 a 2 años",
    rango: "1-2",
    titulo: "Descubrir con las manos",
    texto:
      "Texturas, solapas y piezas grandes. Trabajan la motricidad gruesa y la permanencia del objeto.",
    fondo: "bg-violeta-tenue",
  },
  {
    edad: "3 a 4 años",
    rango: "3-4",
    titulo: "Abrochar, encajar, contar",
    texto:
      "Botones, cierres y cordones. Motricidad fina, secuencias y primeros números.",
    fondo: "bg-verde-tenue",
  },
  {
    edad: "5 a 7 años",
    rango: "5-7",
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

export default async function Inicio() {
  const destacados = await obtenerDestacados(3);

  return (
    <>
      {/* Portada */}
      <section className="mx-auto grid max-w-[76rem] items-center gap-6 px-4 py-6 sm:gap-8 sm:px-6 sm:py-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16 lg:py-20">
        {/*
          En móvil la escena va primero: el público compra en el teléfono y
          pedirle que decida antes de mostrarle el producto es al revés.
          En escritorio van lado a lado y el orden natural se mantiene.
        */}
        <EscenaFieltro className="mx-auto w-full max-w-[17rem] sm:max-w-sm lg:order-2 lg:max-w-lg" />

        <div className="lg:order-1">
          <p className="inline-flex items-center rounded-pill border-2 border-line bg-verde-tenue px-4 py-1.5 font-display text-sm font-bold tracking-tight text-verde-txt">
            Hecho a mano en Chile
          </p>

          <h1 className="mt-5 text-[length:var(--text-display)] leading-[0.98]">
            Un libro de fieltro con su nombre en la portada
          </h1>

          <p className="mt-5 max-w-[52ch] text-[length:var(--text-sub)] leading-relaxed text-ink-muted">
            Libros de estimulación para niños de 1 a 7 años, cosidos uno por uno
            y personalizados para tu hijo. Cada página trabaja una habilidad
            distinta.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <Link
              href="/productos"
              className={cn(botonVariants({ tamano: "lg" }), "justify-center")}
            >
              Ver el catálogo
            </Link>
            <Link
              href="/como-funciona"
              className={cn(
                botonVariants({ variante: "secundario", tamano: "lg" }),
                "justify-center",
              )}
            >
              Cómo se encarga
            </Link>
          </div>

          {/* Es la objeción más cara del negocio: merece peso, no letra chica. */}
          <p className="mt-5 rounded-control border-2 border-line bg-surface-2 px-4 py-3 font-medium">
            No se paga nada por adelantado. Recibimos tu pedido, te escribimos y
            acordamos contigo el pago y la entrega.
          </p>
        </div>
      </section>

      {/* Destacados — solo si hay catálogo publicado */}
      {destacados.length ? (
        <section
          aria-labelledby="titulo-destacados"
          className="border-t-[3px] border-line"
        >
          <div className="mx-auto max-w-[76rem] px-4 py-14 sm:px-6 lg:py-20">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <h2
                id="titulo-destacados"
                className="text-[length:var(--text-titulo)] leading-[1.05]"
              >
                Lo que está saliendo del taller
              </h2>
              <Link
                href="/productos"
                className="inline-flex min-h-11 items-center gap-1.5 font-display font-bold text-violeta-txt hover:underline"
              >
                Ver todo
                <ArrowRight className="size-4" aria-hidden="true" />
              </Link>
            </div>

            <ul className="mt-8 grid gap-6 [grid-template-columns:repeat(auto-fit,minmax(min(280px,100%),1fr))]">
              {destacados.map((producto, i) => (
                <li key={producto.id}>
                  <TarjetaProducto producto={producto} prioridad={i === 0} />
                </li>
              ))}
            </ul>
          </div>
        </section>
      ) : null}

      {/* Por qué cuesta lo que cuesta */}
      <section
        aria-labelledby="titulo-garantias"
        className="border-y-[3px] border-line bg-surface-2"
      >
        <div className="mx-auto grid max-w-[76rem] gap-8 px-4 py-14 sm:px-6 lg:grid-cols-2 lg:gap-14 lg:py-20">
          <div>
            <span className="grid size-14 place-items-center rounded-card border-[3px] border-line bg-naranja text-ink-fijo">
              <Type className="size-7" strokeWidth={2.25} aria-hidden="true" />
            </span>
            <h2
              id="titulo-garantias"
              className="mt-5 text-[length:var(--text-seccion)] leading-tight"
            >
              Lleva su nombre, y eso no se compra en una tienda
            </h2>
            <p className="mt-3 max-w-[46ch] text-ink-muted">
              Bordamos el nombre del niño en la portada y adaptamos los colores a
              lo que ya tiene en su cuarto. Por eso cada libro se hace después de
              que lo pides: no hay dos iguales, y el tuyo todavía no existe.
            </p>
          </div>

          <ul className="grid content-center gap-6">
            <li className="flex gap-4">
              <span className="grid size-11 shrink-0 place-items-center rounded-control border-2 border-line bg-surface text-ink">
                <Hand className="size-5" strokeWidth={2.25} aria-hidden="true" />
              </span>
              <div>
                <h3 className="font-display text-lg font-bold tracking-tight">
                  Cosido a mano
                </h3>
                <p className="mt-1 text-ink-muted">
                  Cada libro lo corta y cose una persona, pieza por pieza.
                </p>
              </div>
            </li>
            <li className="flex gap-4">
              <span className="grid size-11 shrink-0 place-items-center rounded-control border-2 border-line bg-surface text-ink">
                <Leaf className="size-5" strokeWidth={2.25} aria-hidden="true" />
              </span>
              <div>
                <h3 className="font-display text-lg font-bold tracking-tight">
                  Materiales sostenibles
                </h3>
                <p className="mt-1 text-ink-muted">
                  Fieltro sin tóxicos, seguro para la boca y las manos pequeñas.
                </p>
              </div>
            </li>
          </ul>
        </div>
      </section>

      {/* Etapas — la puerta de entrada principal al catálogo */}
      <section
        aria-labelledby="titulo-etapas"
        className="mx-auto max-w-[76rem] px-4 py-16 sm:px-6 lg:py-24"
      >
        <h2
          id="titulo-etapas"
          className="max-w-[20ch] text-[length:var(--text-titulo)] leading-[1.05]"
        >
          Cada edad necesita un libro distinto
        </h2>
        <p className="mt-4 max-w-[60ch] text-ink-muted">
          No es el mismo juguete a los dos que a los seis. Elige la etapa en la
          que está tu hijo y te mostramos lo que le sirve.
        </p>

        <ul className="mt-10 grid gap-5 md:grid-cols-3">
          {ETAPAS.map((etapa) => (
            <li key={etapa.rango}>
              {/*
                Antes eran tarjetas con gesto de elemento accionable que no
                llevaban a ninguna parte. Ahora filtran el catálogo por rango
                de edad, que es como piensa quien compra un regalo.
              */}
              <Link
                href={`/productos?edad=${etapa.rango}`}
                className={cn(
                  "flex h-full flex-col rounded-card border-[3px] border-line p-6 transition-[translate,box-shadow] duration-200 ease-[var(--ease-salida)] hover:-translate-x-1 hover:-translate-y-1 hover:shadow-solida-lg motion-reduce:hover:translate-x-0 motion-reduce:hover:translate-y-0",
                  etapa.fondo,
                )}
              >
                <p className="inline-flex self-start items-center rounded-pill border-2 border-line bg-surface px-3 py-1 font-display text-sm font-bold tracking-tight text-ink">
                  {etapa.edad}
                </p>
                <h3 className="mt-3 text-[length:var(--text-sub)] leading-tight">
                  {etapa.titulo}
                </h3>
                <p className="mt-3 text-ink/85">{etapa.texto}</p>
                <span className="mt-5 inline-flex items-center gap-1.5 font-display font-bold text-ink">
                  Ver los de esta edad
                  <ArrowRight className="size-4" aria-hidden="true" />
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {/* Cómo funciona */}
      <section
        aria-labelledby="titulo-encargo"
        className="border-y-[3px] border-line bg-surface-2"
      >
        <div className="mx-auto max-w-[76rem] px-4 py-16 sm:px-6 lg:py-24">
          <h2
            id="titulo-encargo"
            className="max-w-[22ch] text-[length:var(--text-titulo)] leading-[1.05]"
          >
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
                  className="grid size-11 shrink-0 place-items-center rounded-pill border-2 border-line bg-naranja font-display text-lg font-extrabold text-ink-fijo"
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

      {/* Cierre — con una salida distinta a la de la portada */}
      <section className="mx-auto max-w-[76rem] px-4 py-16 sm:px-6 lg:py-24">
        <div className="rounded-card border-[3px] border-line bg-violeta-tenue p-8 text-center sm:p-12">
          <h2 className="mx-auto max-w-[24ch] text-[length:var(--text-titulo)] leading-[1.05]">
            ¿No sabes cuál elegir?
          </h2>
          <p className="mx-auto mt-4 max-w-[52ch] text-ink/85">
            Dinos la edad del niño y qué le gusta, y te recomendamos el libro que
            le va a durar más tiempo. Respondemos por WhatsApp.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <EnlaceWhatsapp
              variante="fuerte"
              mensaje="Hola, quiero ayuda para elegir un libro. La edad del niño es…"
            >
              Pedir una recomendación
            </EnlaceWhatsapp>
            <Link
              href="/contacto"
              className={cn(botonVariants({ variante: "secundario", tamano: "lg" }))}
            >
              Otras formas de contacto
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

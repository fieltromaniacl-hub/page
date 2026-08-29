-- ============================================================================
-- Fieltromanía · contenido editable desde el panel
--
-- Decisiones que conviene no revertir sin pensarlo:
--   · `ajustes` es clave/valor a propósito, pero el catálogo de claves vive en
--     el CÓDIGO (`src/lib/ajustes.ts`), no en la base. Así el panel muestra
--     etiquetas y ayudas escritas para una persona, no nombres técnicos, y
--     añadir un ajuste es una línea de TypeScript en vez de una migración.
--     La base solo guarda lo que ella escribió; si falta la fila, manda el
--     valor por defecto del código y la tienda nunca sale en blanco.
--   · Las páginas del sistema llevan `del_sistema`. La tienda enlaza a
--     /envios y /terminos desde el pie y desde el carrito: si esas páginas se
--     pudieran borrar, el sitio quedaría con enlaces rotos y ella no tendría
--     forma de recuperarlas. Se pueden vaciar y despublicar, no eliminar.
--   · Los bloques son filas y no un campo de texto largo con marcado. Ella no
--     escribe Markdown, y un editor de bloques con título y párrafo se explica
--     solo desde el teléfono.
-- ============================================================================

-- ─── Ajustes ────────────────────────────────────────────────────────────────

create table public.ajustes (
  clave           text primary key,
  valor           text not null default '',
  actualizado_en  timestamptz not null default now()
);

create trigger ajustes_actualizado_en
  before update on public.ajustes
  for each row execute function public.tocar_actualizado_en();

comment on table public.ajustes is
  'Textos cortos reutilizados por la tienda. El catálogo de claves está en src/lib/ajustes.ts.';

-- ─── Páginas de contenido ───────────────────────────────────────────────────

create table public.paginas (
  id               uuid primary key default gen_random_uuid(),
  slug             text not null unique,
  titulo           text not null,
  bajada           text,
  -- Las que la tienda enlaza siempre: se editan y se despublican, no se borran.
  del_sistema      boolean not null default false,
  publicada        boolean not null default true,
  seo_titulo       text,
  seo_descripcion  text,
  orden            integer not null default 0,
  creado_en        timestamptz not null default now(),
  actualizado_en   timestamptz not null default now()
);

create trigger paginas_actualizado_en
  before update on public.paginas
  for each row execute function public.tocar_actualizado_en();

create table public.pagina_bloques (
  id         uuid primary key default gen_random_uuid(),
  pagina_id  uuid not null references public.paginas(id) on delete cascade,
  titulo     text,
  cuerpo     text not null default '',
  orden      integer not null default 0,
  creado_en  timestamptz not null default now()
);

create index pagina_bloques_pagina_idx on public.pagina_bloques (pagina_id, orden);

-- Impedir el borrado de las páginas que la tienda enlaza siempre.
create or replace function public.proteger_paginas_del_sistema()
returns trigger
language plpgsql
as $$
begin
  if old.del_sistema then
    raise exception
      'La página «%» la enlaza la tienda y no se puede borrar. Despublícala si no quieres mostrarla.',
      old.titulo
      using errcode = 'restrict_violation';
  end if;
  return old;
end;
$$;

create trigger paginas_no_borrar_del_sistema
  before delete on public.paginas
  for each row execute function public.proteger_paginas_del_sistema();

-- ============================================================================
-- Row Level Security
-- ============================================================================

alter table public.ajustes        enable row level security;
alter table public.paginas        enable row level security;
alter table public.pagina_bloques enable row level security;

-- Los ajustes son textos que la tienda muestra a cualquiera: lectura pública.
create policy "ajustes visibles para todos"
  on public.ajustes for select using (true);
create policy "ajustes los administra el panel"
  on public.ajustes for all using (public.es_admin()) with check (public.es_admin());

-- Solo las páginas publicadas. Un borrador no debe verse desde la tienda.
create policy "paginas publicadas visibles para todos"
  on public.paginas for select using (publicada);
create policy "paginas las administra el panel"
  on public.paginas for all using (public.es_admin()) with check (public.es_admin());

create policy "bloques de paginas publicadas visibles"
  on public.pagina_bloques for select using (
    exists (select 1 from public.paginas p
            where p.id = pagina_id and p.publicada)
  );
create policy "bloques los administra el panel"
  on public.pagina_bloques for all using (public.es_admin()) with check (public.es_admin());

-- ============================================================================
-- Contenido inicial
--
-- Es el texto que hoy está escrito a mano en los componentes de React. Se
-- siembra aquí para que ella abra el panel y encuentre su sitio tal como está,
-- listo para editar, en vez de páginas vacías que tendría que redactar de cero.
-- ============================================================================

insert into public.paginas (slug, titulo, bajada, del_sistema, orden, seo_descripcion) values
  ('envios', 'Envíos y plazos',
   'Despachamos a todo Chile. Como cada pieza se hace a mano, el plazo depende de lo que pidas.',
   true, 10,
   'Plazos de confección y despacho de Fieltromanía. Enviamos a todo Chile por encomienda.'),

  ('cuidados', 'Cómo cuidar el fieltro',
   'Un libro de fieltro bien cuidado pasa de un hermano al siguiente. Estas son las reglas básicas.',
   true, 20,
   'Cómo lavar y cuidar los libros de fieltro y juguetes de Fieltromanía para que duren años.'),

  ('nosotros', 'Un taller, no una fábrica',
   'Fieltromanía es un emprendimiento chileno dedicado a los libros de fieltro artesanales y los juguetes educativos para la primera infancia.',
   true, 30,
   'Fieltromanía es un taller chileno que cose a mano libros de fieltro y juguetes educativos para niños de 1 a 7 años.'),

  ('condiciones-de-pago', 'Cómo se paga',
   'No cobramos nada en el sitio. El pago se acuerda contigo después de recibir tu pedido.',
   true, 40,
   'Formas de pago de Fieltromanía: transferencia y efectivo, coordinadas por WhatsApp o correo después del pedido.'),

  ('terminos', 'Términos y condiciones',
   'Las reglas del encargo: qué pasa cuando pides, cuándo se cobra y qué ocurre si algo sale mal.',
   true, 50,
   'Términos y condiciones de compra de Fieltromanía.');

insert into public.pagina_bloques (pagina_id, titulo, cuerpo, orden)
select p.id, b.titulo, b.cuerpo, b.orden
from public.paginas p
join (values
  ('envios', 'Cuánto demora', 'Cada producto indica en su ficha los días de confección aproximados. El plazo empieza a correr cuando acordamos el pedido y el pago, no cuando lo envías desde el sitio.

En temporadas altas, como diciembre o el día de la madre, los plazos se alargan. Si necesitas algo para una fecha concreta, dínoslo al pedirlo y te confirmamos si alcanzamos.', 10),
  ('envios', 'A dónde llega', 'Despachamos a todo Chile por encomienda. El costo depende de tu comuna y se cotiza aparte: te lo confirmamos junto con el total antes de que pagues nada.

También puedes retirar en persona si estás cerca del taller. Coordinamos por WhatsApp.', 20),
  ('envios', 'Seguimiento', 'Cuando el pedido sale del taller te avisamos y te damos el número de seguimiento de la encomienda.', 30),

  ('cuidados', 'Lavado', 'A mano, con agua fría y jabón suave. Nada de lavadora, nada de agua caliente: el fieltro se encoge y las piezas cosidas se deforman.

Para manchas puntuales basta un paño húmedo sobre la zona, sin frotar fuerte.', 10),
  ('cuidados', 'Secado', 'A la sombra y en plano. Colgarlo mojado estira las páginas, y el sol directo apaga los colores.', 20),
  ('cuidados', 'Uso diario', 'Están hechos para jugarse. Las piezas pequeñas van cosidas o con velcro reforzado, pero conviene revisar de vez en cuando que todo siga firme, sobre todo con niños que todavía se llevan cosas a la boca.

Si algo se suelta, escríbenos: lo reparamos.', 30),

  ('nosotros', 'Qué hacemos', 'Cortamos y cosemos a mano libros de estimulación para niños de 1 a 7 años, además de letreros personalizados, sujeta cortinas y recuerdos para eventos.

Cada libro se arma pieza por pieza. No hay dos idénticos, porque casi todos llevan el nombre de un niño en particular y los colores que eligió su familia.', 10),
  ('nosotros', 'Por qué fieltro', 'El fieltro no se deshilacha al cortarlo, aguanta el uso rudo de las manos pequeñas y es suave al tacto. Trabajamos con materiales sin tóxicos, seguros para una edad en que todo termina en la boca.

Además dura años. Un libro de fieltro pasa de un hermano al siguiente.', 20),

  ('condiciones-de-pago', 'Cuándo se paga', 'Nunca en el sitio. Cuando envías tu pedido queda registrado lo que quieres, sin ningún compromiso todavía.

Te escribimos por correo o WhatsApp para confirmar los detalles, cotizar el despacho a tu comuna y acordar la forma de pago. Recién ahí, con todo claro y aceptado por ti, empieza la confección.', 10),
  ('condiciones-de-pago', 'Formas de pago', 'Transferencia bancaria o efectivo al retirar. Te enviamos los datos al confirmar el pedido.

En pedidos grandes o con fecha comprometida podemos pedir un abono para reservar el cupo del taller. Siempre se conversa antes.', 20),
  ('condiciones-de-pago', 'Por qué no se paga en el sitio', 'Porque cada pedido es distinto. El despacho depende de tu comuna, algunos productos llevan modificaciones que conversamos contigo, y preferimos confirmar que todo esté bien antes de que gastes tu dinero.

Es más lento que apretar un botón, pero significa que hay una persona revisando tu pedido.', 30),

  ('terminos', 'Qué es un pedido en este sitio', 'Enviar el formulario no es una compra ni obliga a pagar. Es una solicitud de encargo: queda registrado lo que quieres y nos das tus datos para contactarte.

La compra existe cuando ambas partes confirmamos por escrito el producto, el precio final, el despacho y el plazo.', 10),
  ('terminos', 'Precios', 'Los precios están en pesos chilenos e incluyen impuestos. No incluyen el despacho, que se cotiza aparte según tu comuna.

El precio que vale es el que te confirmamos al acordar el pedido. Si un precio del sitio tuviera un error evidente, te lo avisamos antes de cobrar nada.', 20),
  ('terminos', 'Productos personalizados', 'Un producto con el nombre de un niño bordado no se puede revender. Por eso te pedimos revisar bien los datos de personalización antes de confirmar: la ortografía del nombre, los colores y la edad.

Una vez confirmado el pedido y empezada la confección, los cambios de personalización pueden no ser posibles.', 30),
  ('terminos', 'Si te arrepientes', 'Mientras no hayas pagado, no hay compromiso: nos avisas y listo, sin costo.

Después de pagado y empezado, un producto personalizado no admite devolución por arrepentimiento, según lo que permite la ley del consumidor para bienes hechos a pedido.', 40),
  ('terminos', 'Si algo llega mal', 'Si el producto llega con una falla de confección o distinto a lo acordado, escríbenos dentro de los primeros días con fotos. Lo reparamos o lo reponemos sin costo.

El desgaste por uso normal no es una falla, pero igual escríbenos: muchas cosas se arreglan.', 50),
  ('terminos', 'Tus datos', 'Usamos tu nombre, correo, teléfono y comuna solo para gestionar tu pedido y contactarte. No los vendemos ni los compartimos con terceros para publicidad.

Puedes pedirnos que los borremos escribiéndonos al correo de contacto.', 60)
) as b(slug, titulo, cuerpo, orden) on b.slug = p.slug;

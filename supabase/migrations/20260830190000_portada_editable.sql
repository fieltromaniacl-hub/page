-- ============================================================================
-- Fieltromanía · contenido de la portada editable
--
-- Decisiones que conviene no revertir sin pensarlo:
--   · `etapas` guarda un `tono`, no una clase de Tailwind. Meter
--     «bg-violeta-tenue» en la base acopla los datos a la hoja de estilos y le
--     pide a ella que escriba CSS. El tono se traduce a clase en el código.
--   · `pasos` es UNA tabla para los dos sitios donde se explican. Hasta ahora
--     el proceso estaba escrito dos veces y ya divergía: la portada decía
--     «Recibimos tu pedido / Acordamos pago y entrega» y /como-funciona decía
--     «Envías el pedido / Te contactamos». El sitio se contradecía sobre su
--     propio funcionamiento. `en_portada` elige cuáles se resumen arriba.
--   · Se renombra `tono_aviso` a `tono_marca`. Es el mismo trío de colores de
--     marca y ahora lo usan avisos y etapas; mantener dos enums idénticos con
--     nombres distintos envejece mal.
-- ============================================================================

alter type tono_aviso rename to tono_marca;

-- ─── Etapas por edad ────────────────────────────────────────────────────────

create table public.etapas (
  id       uuid primary key default gen_random_uuid(),
  -- Lo que se lee en la píldora: «1 a 2 años».
  edad     text not null,
  -- Lo que viaja al catálogo: «1-2» arma /productos?edad=1-2.
  rango    text not null,
  titulo   text not null,
  texto    text not null,
  tono     tono_marca not null default 'violeta',
  orden    integer not null default 0,
  activa   boolean not null default true,

  constraint rango_valido check (rango ~ '^[0-9]+(-[0-9]+)?$')
);

comment on column public.etapas.rango is
  'Rango de edad en el formato que entiende /productos?edad= : «3» o «1-2».';

-- ─── Pasos del pedido ───────────────────────────────────────────────────────

create table public.pasos (
  id          uuid primary key default gen_random_uuid(),
  titulo      text not null,
  texto       text not null,
  -- La portada resume; /como-funciona los muestra todos.
  en_portada  boolean not null default false,
  orden       integer not null default 0
);

-- ============================================================================
-- Row Level Security
-- ============================================================================

alter table public.etapas enable row level security;
alter table public.pasos  enable row level security;

create policy "etapas activas visibles para todos"
  on public.etapas for select using (activa);
create policy "etapas las administra el panel"
  on public.etapas for all using (public.es_admin()) with check (public.es_admin());

create policy "pasos visibles para todos"
  on public.pasos for select using (true);
create policy "pasos los administra el panel"
  on public.pasos for all using (public.es_admin()) with check (public.es_admin());

-- ============================================================================
-- Contenido inicial — lo que hoy está escrito a mano en los componentes
-- ============================================================================

insert into public.etapas (edad, rango, titulo, texto, tono, orden) values
  ('1 a 2 años', '1-2', 'Descubrir con las manos',
   'Texturas, solapas y piezas grandes. Trabajan la motricidad gruesa y la permanencia del objeto.',
   'violeta', 10),
  ('3 a 4 años', '3-4', 'Abrochar, encajar, contar',
   'Botones, cierres y cordones. Motricidad fina, secuencias y primeros números.',
   'verde', 20),
  ('5 a 7 años', '5-7', 'Leer y crear historias',
   'Letras, relojes y escenarios completos. Lectura temprana y juego simbólico.',
   'naranja', 30);

-- Se toma la versión de /como-funciona, que era la completa, y se marcan para
-- la portada los tres que sostienen el argumento: eliges, te contactamos, y
-- recién entonces se fabrica. El resumen anterior perdía justamente ese
-- último, que es el que explica por qué no se cobra al instante.
insert into public.pasos (titulo, texto, en_portada, orden) values
  ('Eliges y personalizas',
   'Escoges el producto y nos dices los datos que necesitamos: el nombre que va bordado, los colores, la edad del niño. Todo eso viaja con tu pedido, así no tenemos que preguntártelo después.',
   true, 10),
  ('Envías el pedido',
   'Nos dejas tu nombre, correo y teléfono. En ese momento no se paga nada: solo queda registrado lo que quieres.',
   false, 20),
  ('Te contactamos',
   'Te escribimos por correo o WhatsApp para confirmar los detalles, cotizar el despacho a tu comuna y acordar la forma de pago.',
   true, 30),
  ('Recién ahí empieza la confección',
   'Una vez acordado, se corta y se cose tu pedido. Cada producto indica cuántos días toma aproximadamente.',
   true, 40),
  ('Te lo enviamos',
   'Despachamos a todo Chile. Te avisamos cuando salga y te damos el número de seguimiento.',
   false, 50);

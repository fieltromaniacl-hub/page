-- ============================================================================
-- Fieltromanía · esquema inicial
--
-- Decisiones que conviene no revertir sin pensarlo:
--   · Los precios son enteros en pesos chilenos. El CLP no tiene decimales y
--     guardar plata en punto flotante produce errores de redondeo.
--   · `pedido_items` guarda una instantánea del nombre y del precio. Cambiar el
--     precio de un producto no debe alterar pedidos ya hechos, y borrar un
--     producto no debe dejar un pedido histórico ilegible.
--   · Los pedidos no tienen ninguna política para el rol anónimo. Se insertan
--     desde el servidor con la clave secreta, que salta RLS, para que el total
--     se calcule con precios de la base y no con lo que mande el navegador.
-- ============================================================================

create extension if not exists pgcrypto;

-- ─── Tipos ──────────────────────────────────────────────────────────────────

-- Visible en la tienda / oculto pero conservado / retirado del catálogo.
create type estado_producto as enum ('activo', 'inactivo', 'archivado');

-- 'por_encargo' es el estado habitual en artesanía: se vende sin tener stock.
create type estado_stock as enum ('disponible', 'por_encargo', 'agotado');

create type estado_pedido as enum (
  'recibido', 'contactado', 'confirmado',
  'en_confeccion', 'enviado', 'entregado', 'cancelado'
);

-- Tipo de dato que se le pide al cliente al personalizar.
create type tipo_campo as enum ('texto', 'parrafo', 'opcion', 'color', 'numero');

-- ─── Utilidades ─────────────────────────────────────────────────────────────

create or replace function public.tocar_actualizado_en()
returns trigger
language plpgsql
as $$
begin
  new.actualizado_en := now();
  return new;
end;
$$;

-- ─── Administradores ────────────────────────────────────────────────────────

create table public.admins (
  user_id    uuid primary key references auth.users(id) on delete cascade,
  nombre     text,
  creado_en  timestamptz not null default now()
);

comment on table public.admins is
  'Quién puede entrar al panel. Se agrega a mano tras crear el usuario en Auth.';

-- `security definer` para poder leer public.admins desde políticas RLS sin que
-- el propio usuario necesite permiso de lectura sobre esa tabla. El search_path
-- va fijado: sin eso, un esquema controlado por el usuario podría suplantar las
-- tablas referenciadas.
create or replace function public.es_admin()
returns boolean
language sql
stable
security definer
set search_path = public, pg_temp
as $$
  select exists (
    select 1 from public.admins where user_id = (select auth.uid())
  );
$$;


-- ─── Categorías ─────────────────────────────────────────────────────────────

create table public.categorias (
  id           uuid primary key default gen_random_uuid(),
  slug         text not null unique,
  nombre       text not null,
  descripcion  text,
  orden        integer not null default 0,
  creado_en    timestamptz not null default now()
);

-- ─── Productos ──────────────────────────────────────────────────────────────

create table public.productos (
  id            uuid primary key default gen_random_uuid(),
  slug          text not null unique,
  nombre        text not null,

  -- Una línea para tarjetas y meta description; el largo es para la ficha.
  resumen       text,
  descripcion   text,

  precio        integer not null check (precio >= 0),
  precio_antes  integer check (precio_antes is null or precio_antes > precio),

  categoria_id  uuid references public.categorias(id) on delete set null,

  estado        estado_producto not null default 'activo',
  stock         estado_stock    not null default 'por_encargo',
  -- null significa "no llevo control de unidades", que es lo normal aquí.
  cantidad      integer check (cantidad is null or cantidad >= 0),

  destacado     boolean not null default false,
  orden         integer not null default 0,

  -- Ficha del producto artesanal
  edad_min         integer check (edad_min is null or edad_min >= 0),
  edad_max         integer check (edad_max is null or edad_max >= 0),
  materiales       text,
  medidas          text,
  cuidados         text,
  dias_confeccion  integer check (dias_confeccion is null or dias_confeccion > 0),
  -- Qué habilidad trabaja: alimenta la ficha y los datos estructurados.
  habilidades      text[] not null default '{}',

  seo_titulo       text,
  seo_descripcion  text,

  creado_en      timestamptz not null default now(),
  actualizado_en timestamptz not null default now(),

  constraint edades_coherentes
    check (edad_min is null or edad_max is null or edad_min <= edad_max)
);

create trigger productos_actualizado_en
  before update on public.productos
  for each row execute function public.tocar_actualizado_en();

create index productos_visibles_idx
  on public.productos (estado, destacado desc, orden, creado_en desc);
create index productos_categoria_idx on public.productos (categoria_id);
create index productos_edad_idx on public.productos (edad_min, edad_max);

-- ─── Imágenes ───────────────────────────────────────────────────────────────

create table public.producto_imagenes (
  id           uuid primary key default gen_random_uuid(),
  producto_id  uuid not null references public.productos(id) on delete cascade,
  url          text not null,
  -- Obligatorio por accesibilidad y por SEO de imágenes: se valida en el panel.
  alt          text not null default '',
  orden        integer not null default 0,
  creado_en    timestamptz not null default now()
);

create index producto_imagenes_idx on public.producto_imagenes (producto_id, orden);

-- ─── Campos de personalización ──────────────────────────────────────────────

create table public.producto_campos (
  id           uuid primary key default gen_random_uuid(),
  producto_id  uuid not null references public.productos(id) on delete cascade,
  etiqueta     text not null,
  ayuda        text,
  tipo         tipo_campo not null default 'texto',
  -- Alternativas para 'opcion' y 'color'. Vacío para los demás tipos.
  opciones     text[] not null default '{}',
  requerido    boolean not null default true,
  max_largo    integer check (max_largo is null or max_largo > 0),
  orden        integer not null default 0,

  constraint opciones_solo_donde_aplican check (
    (tipo in ('opcion', 'color') and array_length(opciones, 1) >= 1)
    or (tipo not in ('opcion', 'color') and opciones = '{}')
  )
);

comment on table public.producto_campos is
  'Lo que se le pregunta al cliente al personalizar: nombre a bordar, colores, '
  'edad del niño. Configurable por producto desde el panel, sin tocar código.';

create index producto_campos_idx on public.producto_campos (producto_id, orden);

-- ─── Pedidos ────────────────────────────────────────────────────────────────

create sequence public.pedidos_numero_seq;

create table public.pedidos (
  id      uuid primary key default gen_random_uuid(),
  numero  text not null unique,

  cliente_nombre    text not null,
  cliente_email     text not null,
  cliente_telefono  text,
  comuna            text,
  region            text,
  notas             text,

  total   integer not null check (total >= 0),
  estado  estado_pedido not null default 'recibido',

  -- Si el correo falla, el pedido igual queda registrado y visible en el panel.
  correo_enviado     boolean not null default false,
  correo_error       text,

  creado_en      timestamptz not null default now(),
  actualizado_en timestamptz not null default now()
);

create trigger pedidos_actualizado_en
  before update on public.pedidos
  for each row execute function public.tocar_actualizado_en();

create or replace function public.asignar_numero_pedido()
returns trigger
language plpgsql
as $$
begin
  if new.numero is null or new.numero = '' then
    new.numero := 'FM-' || to_char(now(), 'YYYY') || '-'
                  || lpad(nextval('public.pedidos_numero_seq')::text, 4, '0');
  end if;
  return new;
end;
$$;

create trigger pedidos_numero
  before insert on public.pedidos
  for each row execute function public.asignar_numero_pedido();

create index pedidos_bandeja_idx on public.pedidos (estado, creado_en desc);

create table public.pedido_items (
  id           uuid primary key default gen_random_uuid(),
  pedido_id    uuid not null references public.pedidos(id) on delete cascade,
  -- Se conserva el pedido aunque el producto se borre del catálogo.
  producto_id  uuid references public.productos(id) on delete set null,

  -- Instantánea al momento del pedido.
  nombre           text not null,
  slug             text,
  precio_unitario  integer not null check (precio_unitario >= 0),
  cantidad         integer not null check (cantidad > 0),

  -- { "Nombre a bordar": "Emilia", "Color de portada": "Verde" }
  personalizacion  jsonb not null default '{}'::jsonb
);

create index pedido_items_idx on public.pedido_items (pedido_id);

-- ============================================================================
-- Row Level Security
-- Todo empieza denegado. Cada permiso se concede explícitamente.
-- ============================================================================

alter table public.admins            enable row level security;
alter table public.categorias        enable row level security;
alter table public.productos         enable row level security;
alter table public.producto_imagenes enable row level security;
alter table public.producto_campos   enable row level security;
alter table public.pedidos           enable row level security;
alter table public.pedido_items      enable row level security;

-- Catálogo: lectura pública, escritura solo del panel.

create policy "categorias visibles para todos"
  on public.categorias for select using (true);
create policy "categorias las administra el panel"
  on public.categorias for all using (public.es_admin()) with check (public.es_admin());

-- Solo productos activos. Inactivos y archivados quedan invisibles al público.
create policy "productos activos visibles para todos"
  on public.productos for select using (estado = 'activo');
create policy "productos los administra el panel"
  on public.productos for all using (public.es_admin()) with check (public.es_admin());

create policy "imagenes de productos activos visibles"
  on public.producto_imagenes for select using (
    exists (select 1 from public.productos p
            where p.id = producto_id and p.estado = 'activo')
  );
create policy "imagenes las administra el panel"
  on public.producto_imagenes for all using (public.es_admin()) with check (public.es_admin());

create policy "campos de productos activos visibles"
  on public.producto_campos for select using (
    exists (select 1 from public.productos p
            where p.id = producto_id and p.estado = 'activo')
  );
create policy "campos los administra el panel"
  on public.producto_campos for all using (public.es_admin()) with check (public.es_admin());

-- Pedidos: sin política para el rol anónimo, a propósito. Se crean desde el
-- servidor con la clave secreta; nadie puede leerlos desde el navegador.

create policy "pedidos los ve el panel"
  on public.pedidos for select using (public.es_admin());
create policy "pedidos los actualiza el panel"
  on public.pedidos for update using (public.es_admin()) with check (public.es_admin());

create policy "items los ve el panel"
  on public.pedido_items for select using (public.es_admin());

-- Cada admin puede comprobar su propia fila; nadie puede listar el resto.
create policy "admin se ve a si mismo"
  on public.admins for select using (user_id = (select auth.uid()));

-- ─── Almacenamiento de imágenes ─────────────────────────────────────────────

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'productos', 'productos', true, 5242880,
  array['image/jpeg', 'image/png', 'image/webp', 'image/avif']
)
on conflict (id) do nothing;

create policy "imagenes de productos son publicas"
  on storage.objects for select using (bucket_id = 'productos');
create policy "solo el panel sube imagenes"
  on storage.objects for insert to authenticated
  with check (bucket_id = 'productos' and public.es_admin());
create policy "solo el panel reemplaza imagenes"
  on storage.objects for update to authenticated
  using (bucket_id = 'productos' and public.es_admin());
create policy "solo el panel borra imagenes"
  on storage.objects for delete to authenticated
  using (bucket_id = 'productos' and public.es_admin());

-- ─── Categorías iniciales ───────────────────────────────────────────────────

insert into public.categorias (slug, nombre, descripcion, orden) values
  ('libros-personalizados', 'Libros personalizados',
   'Libros de estimulación en fieltro, cosidos a mano y personalizados con el nombre del niño.', 1),
  ('letreros', 'Letreros',
   'Letreros de fieltro con nombre, para la puerta de la pieza o la decoración del cuarto.', 2),
  ('sujeta-cortinas', 'Sujeta cortinas',
   'Sujeta cortinas en fieltro para dormitorios infantiles.', 3),
  ('recuerdos', 'Recuerdos para eventos',
   'Souvenirs artesanales para cumpleaños, bautizos y nacimientos.', 4)
on conflict (slug) do nothing;

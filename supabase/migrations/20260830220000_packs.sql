-- ============================================================================
-- Fieltromanía · packs
--
-- Un pack NO es una entidad nueva: es un producto que declara qué incluye.
--
-- `productos` ya tiene precio, precio anterior, fotos, campos de
-- personalización, stock, destacado, categoría y SEO. Un pack necesita
-- exactamente eso. Con una tabla paralela habría que duplicarlo todo, y además
-- enseñarle al carrito, a `pedido_items` y a las plantillas de correo que una
-- línea puede ser varios productos. Así no cambia nada de eso.
--
-- La personalización tampoco se hereda a propósito: «libro + letrero con el
-- mismo nombre» se pregunta UNA vez. Si el pack reuniera los campos de sus
-- componentes, la clienta escribiría el nombre del niño dos veces y el pedido
-- llegaría con dos respuestas que podrían no coincidir.
--
-- Decisiones que conviene no revertir sin pensarlo:
--   · Sin anidar. Un pack no puede contener otro pack. Lo impide un disparador
--     y no una convención, porque anidar abre recursión infinita al pintar la
--     ficha y al sumar el precio por separado.
--   · El precio del pack es suyo, no una suma. Ella pone lo que cobra; el
--     «valor por separado» se calcula para mostrar el ahorro, y por eso no se
--     guarda: si mañana sube el precio de un componente, el ahorro se recalcula
--     solo en vez de quedar mintiendo.
-- ============================================================================

create table public.producto_incluye (
  producto_id  uuid not null references public.productos(id) on delete cascade,
  incluido_id  uuid not null references public.productos(id) on delete cascade,
  cantidad     integer not null default 1 check (cantidad > 0),
  orden        integer not null default 0,

  primary key (producto_id, incluido_id),
  constraint no_se_incluye_a_si_mismo check (producto_id <> incluido_id)
);

create index producto_incluye_incluido_idx on public.producto_incluye (incluido_id);

comment on table public.producto_incluye is
  'Qué productos vienen dentro de otro. Un producto con filas aquí es un pack.';

-- Sin anidar, en los dos sentidos: ni meter un pack dentro de otro, ni
-- convertir en pack algo que ya está dentro de uno.
create or replace function public.packs_sin_anidar()
returns trigger
language plpgsql
as $$
begin
  if exists (select 1 from public.producto_incluye
             where producto_id = new.incluido_id) then
    raise exception
      'Ese producto ya es un pack y los packs no se pueden anidar. Agrega sus productos por separado.'
      using errcode = 'check_violation';
  end if;

  if exists (select 1 from public.producto_incluye
             where incluido_id = new.producto_id) then
    raise exception
      'Este producto ya viene dentro de otro pack, así que no puede ser un pack a su vez.'
      using errcode = 'check_violation';
  end if;

  return new;
end;
$$;

create trigger producto_incluye_sin_anidar
  before insert or update on public.producto_incluye
  for each row execute function public.packs_sin_anidar();

alter table public.producto_incluye enable row level security;

-- Solo se ve lo que hay dentro de un pack publicado, y solo los componentes
-- que estén publicados: un pack no debe delatar un producto sin publicar.
create policy "contenido de packs activos visible"
  on public.producto_incluye for select using (
    exists (select 1 from public.productos p
            where p.id = producto_id and p.estado = 'activo')
    and exists (select 1 from public.productos c
                where c.id = incluido_id and c.estado = 'activo')
  );

create policy "el contenido lo administra el panel"
  on public.producto_incluye for all
  using (public.es_admin()) with check (public.es_admin());

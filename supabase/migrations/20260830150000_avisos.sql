-- ============================================================================
-- Fieltromanía · aviso programado en la tienda
--
-- Decisiones que conviene no revertir sin pensarlo:
--   · Las fechas son `date`, no `timestamptz`. Una promoción de taller dura
--     «hasta el domingo», no «hasta las 18:47». Con granularidad de día
--     desaparece la trampa de zona horaria de un `datetime-local`, que llega
--     sin huso y el servidor interpretaría en UTC: un aviso que ella programa
--     hasta el domingo se apagaría el sábado a las 21:00 hora de Chile.
--   · La vigencia la impone RLS, no la aplicación. Un aviso apagado o vencido
--     no es que se oculte al pintarlo: el público literalmente no puede leerlo.
--     Así un borrador de promoción no se filtra por la API aunque alguien
--     consulte la tabla a mano.
--   · La comparación va en America/Santiago. El servidor corre en UTC y en
--     Chile eso son 3 o 4 horas de diferencia según el horario de verano:
--     comparar contra `current_date` a secas apagaría los avisos antes de
--     tiempo cada noche.
-- ============================================================================

create type tono_aviso as enum ('naranja', 'verde', 'violeta');

create table public.avisos (
  id             uuid primary key default gen_random_uuid(),
  texto          text not null,
  -- Enlace opcional. Los dos van juntos o no va ninguno.
  enlace_texto   text,
  enlace_href    text,
  desde          date,
  hasta          date,
  activo         boolean not null default true,
  tono           tono_aviso not null default 'naranja',
  orden          integer not null default 0,
  creado_en      timestamptz not null default now(),
  actualizado_en timestamptz not null default now(),

  constraint enlace_completo check (
    (enlace_texto is null and enlace_href is null)
    or (enlace_texto is not null and enlace_href is not null)
  ),
  constraint fechas_coherentes check (desde is null or hasta is null or desde <= hasta)
);

create trigger avisos_actualizado_en
  before update on public.avisos
  for each row execute function public.tocar_actualizado_en();

comment on table public.avisos is
  'Franja programable sobre el encabezado de la tienda. La vigencia la filtra RLS.';

-- Hoy en Chile, que es lo que decide si un aviso está vigente.
create or replace function public.hoy_en_chile()
returns date
language sql
stable
as $$
  select (now() at time zone 'America/Santiago')::date;
$$;

alter table public.avisos enable row level security;

-- El público solo ve lo encendido y dentro de fechas. Sin fecha = sin límite.
create policy "avisos vigentes visibles para todos"
  on public.avisos for select using (
    activo
    and (desde is null or desde <= public.hoy_en_chile())
    and (hasta is null or hasta >= public.hoy_en_chile())
  );

create policy "avisos los administra el panel"
  on public.avisos for all using (public.es_admin()) with check (public.es_admin());

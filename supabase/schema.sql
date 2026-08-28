-- Esquema inicial del centro de consultas jurídicas.
-- Ejecutar este archivo desde el editor SQL de Supabase.

create extension if not exists pgcrypto;

create table if not exists public.categorias (
  id uuid primary key default gen_random_uuid(),
  nombre text not null unique,
  slug text not null unique,
  descripcion text not null,
  activa boolean not null default true,
  creada_en timestamptz not null default now()
);

create table if not exists public.consultas (
  id uuid primary key default gen_random_uuid(),
  categoria_id uuid not null references public.categorias(id),
  nombre text not null check (char_length(nombre) between 2 and 120),
  correo text not null check (char_length(correo) <= 254),
  whatsapp text not null check (char_length(whatsapp) between 7 and 30),
  titulo text not null check (char_length(titulo) between 8 and 180),
  detalle text not null check (char_length(detalle) between 20 and 5000),
  slug text unique,
  estado text not null default 'pendiente'
    check (estado in ('pendiente', 'publicada', 'rechazada')),
  publicada_en timestamptz,
  creada_en timestamptz not null default now(),
  actualizada_en timestamptz not null default now()
);

create table if not exists public.respuestas (
  id uuid primary key default gen_random_uuid(),
  consulta_id uuid not null references public.consultas(id) on delete cascade,
  contenido text not null check (char_length(contenido) between 20 and 10000),
  autor text not null default 'Equipo Defensa Jurídica Sur',
  publicada boolean not null default false,
  creada_en timestamptz not null default now(),
  actualizada_en timestamptz not null default now()
);

create index if not exists consultas_estado_publicada_idx
  on public.consultas (estado, publicada_en desc);
create index if not exists consultas_categoria_idx
  on public.consultas (categoria_id);
create index if not exists respuestas_consulta_idx
  on public.respuestas (consulta_id, creada_en);

alter table public.categorias enable row level security;
alter table public.consultas enable row level security;
alter table public.respuestas enable row level security;

-- El sitio usa exclusivamente la clave de servicio desde el servidor.
-- No se crean políticas para anon: los datos personales quedan cerrados por defecto.
grant usage on schema public to service_role;
grant select, insert, update, delete on table public.categorias to service_role;
grant select, insert, update, delete on table public.consultas to service_role;
grant select, insert, update, delete on table public.respuestas to service_role;

insert into public.categorias (nombre, slug, descripcion)
values
  ('Derecho Laboral', 'derecho-laboral', 'Consultas sobre despidos, finiquitos, licencias médicas, sueldos y derechos laborales.'),
  ('Derecho de Familia', 'derecho-familia', 'Consultas sobre pensión de alimentos, cuidado personal, visitas y causas de familia.'),
  ('Derecho Penal', 'derecho-penal', 'Orientación general sobre denuncias, delitos, audiencias y defensa penal.'),
  ('Derecho Civil', 'derecho-civil', 'Consultas sobre contratos, deudas, arriendos, herencias y conflictos civiles.'),
  ('Otras Consultas', 'otras-consultas', 'Preguntas jurídicas generales que no pertenecen a una categoría específica.')
on conflict (slug) do update set
  nombre = excluded.nombre,
  descripcion = excluded.descripcion,
  activa = true;

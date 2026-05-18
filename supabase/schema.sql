create extension if not exists pgcrypto;

create type public.plan_tier as enum ('free', 'premium');
create type public.job_status as enum (
  'created',
  'uploading',
  'queued',
  'processing',
  'completed',
  'downloaded',
  'expired',
  'failed',
  'deleted'
);

create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  plan public.plan_tier not null default 'free',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.jobs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  operation text not null check (
    operation in (
      'merge',
      'split',
      'remove-pages',
      'extract-pages',
      'compress',
      'repair',
      'jpg-to-pdf',
      'pdf-to-word',
      'pdf-to-powerpoint',
      'pdf-to-excel',
      'pdf-to-jpg',
      'word-to-pdf',
      'powerpoint-to-pdf',
      'excel-to-pdf',
      'rotate',
      'watermark',
      'page-numbers',
      'crop',
      'sign',
      'redact',
      'protect',
      'unlock',
      'compare',
      'ocr',
      'summarize'
    )
  ),
  status public.job_status not null default 'created',
  file_count integer not null default 0 check (file_count >= 0),
  file_names text[] not null default '{}',
  upload_object_ref text,
  result_object_ref text,
  expires_at timestamptz not null default now() + interval '15 minutes',
  processing_duration_ms integer,
  safe_error_code text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  completed_at timestamptz,
  downloaded_at timestamptz,
  deleted_at timestamptz,
  constraint upload_ref_is_temporary check (
    upload_object_ref is null or upload_object_ref like '/temp/uploads/%'
  ),
  constraint result_ref_is_temporary check (
    result_object_ref is null or result_object_ref like '/temp/results/%'
  )
);

create table public.processing_logs (
  id bigint generated always as identity primary key,
  job_id uuid references public.jobs (id) on delete cascade,
  user_id uuid references auth.users (id) on delete set null,
  event text not null,
  duration_ms integer,
  safe_error_code text,
  metric_name text,
  metric_value numeric,
  created_at timestamptz not null default now()
);

create table public.download_tokens (
  id uuid primary key default gen_random_uuid(),
  job_id uuid not null references public.jobs (id) on delete cascade,
  user_id uuid not null references auth.users (id) on delete cascade,
  token_hash text not null unique,
  result_object_ref text not null check (result_object_ref like '/temp/results/%'),
  expires_at timestamptz not null default now() + interval '3 minutes',
  used_at timestamptz,
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;
alter table public.jobs enable row level security;
alter table public.processing_logs enable row level security;
alter table public.download_tokens enable row level security;

create policy "profiles are user scoped"
  on public.profiles for select
  using (auth.uid() = id);

create policy "jobs are user scoped"
  on public.jobs for select
  using (auth.uid() = user_id);

create policy "users can create their own job metadata"
  on public.jobs for insert
  with check (auth.uid() = user_id);

create policy "download tokens are user scoped"
  on public.download_tokens for select
  using (auth.uid() = user_id);

create policy "processing logs are user scoped"
  on public.processing_logs for select
  using (auth.uid() = user_id);

create or replace function public.reject_document_persistence()
returns trigger
language plpgsql
as $$
begin
  if row_to_json(new)::text ~* '(uploaded_file_bytes|generated_file_bytes|pdf_content|ocr_text|image_content|preview_content|thumbnail_bytes|permanent_file_url|archive_path)' then
    raise exception 'document persistence fields are forbidden';
  end if;

  return new;
end;
$$;

create trigger jobs_zero_persistence_guard
  before insert or update on public.jobs
  for each row execute function public.reject_document_persistence();

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id)
  values (new.id)
  on conflict (id) do nothing;

  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

create index jobs_user_status_idx on public.jobs (user_id, status, created_at desc);
create index jobs_expiry_idx on public.jobs (expires_at) where deleted_at is null;
create index download_tokens_expiry_idx on public.download_tokens (expires_at) where used_at is null;

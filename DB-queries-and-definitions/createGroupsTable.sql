create table
  public.groups (
    id uuid not null default gen_random_uuid (),
    created_at timestamp with time zone not null default now(),
    avatar_url text null,
    name text null,
    code numeric null,
    members jsonb null,
    constraint groups_pkey primary key (id),
    constraint groups_code_key unique (code)
  ) tablespace pg_default;

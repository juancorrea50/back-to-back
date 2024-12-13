create table
  public.lifts (
    lift_id uuid not null default gen_random_uuid (),
    created_at timestamp with time zone not null default now(),
    lift_name text null default 'NULL'::text,
    reps smallint null default '0'::smallint,
    weight_lb smallint null default '0'::smallint,
    is_body boolean null default false,
    constraint lifts_pkey primary key (lift_id)
  ) tablespace pg_default;

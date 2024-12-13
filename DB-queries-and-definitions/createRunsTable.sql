create table
  public.runs (
    run_id uuid not null default gen_random_uuid (),
    created_at timestamp with time zone not null default now(),
    run_data jsonb null,
    run_distance real null,
    run_time real null,
    user_id uuid null default auth.uid (),
    constraint runs_pkey primary key (run_id),
    constraint runs_user_id_fkey foreign key (user_id) references auth.users (id) on update cascade on delete cascade
  ) tablespace pg_default;

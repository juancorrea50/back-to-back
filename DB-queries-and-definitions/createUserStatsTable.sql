create table
  public.userstats (
    id uuid not null,
    created_at timestamp with time zone not null default now(),
    overall_score double precision null default '0'::double precision,
    str_score double precision null default '0'::double precision,
    end_score double precision null default '0'::double precision,
    spd_score double precision null default '0'::double precision,
    flex_score double precision null default '0'::double precision,
    constraint userstats_pkey primary key (id),
    constraint userstats_id_fkey foreign key (id) references auth.users (id) on update cascade on delete cascade
  ) tablespace pg_default;

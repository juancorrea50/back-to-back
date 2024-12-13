create table
  public.profiles (
    id uuid not null,
    updated_at timestamp with time zone null default (now() at time zone 'utc'::text),
    username text null,
    avatar_url text null,
    phone_number text null,
    email text null,
    constraint profiles_pkey primary key (id),
    constraint profiles_id_key unique (id),
    constraint profiles_username_key unique (username),
    constraint profiles_id_fkey foreign key (id) references auth.users (id) on update cascade on delete cascade,
    constraint username_length check ((char_length(username) >= 3))
  ) tablespace pg_default;

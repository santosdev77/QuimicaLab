create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  name text,
  avatar_url text,
  xp integer not null default 0,
  level integer not null default 1,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.profiles enable row level security;
create policy "Profiles are visible only to their owner" on public.profiles for select using (auth.uid() = id);
create policy "Profiles can be updated only by their owner" on public.profiles for update using (auth.uid() = id) with check (auth.uid() = id and xp = (select xp from public.profiles where id = auth.uid()) and level = (select level from public.profiles where id = auth.uid()));
create policy "Profiles can be inserted only by their owner" on public.profiles for insert with check (auth.uid() = id and xp = 0 and level = 1);
create or replace function public.handle_new_user() returns trigger language plpgsql security definer set search_path = public as $$ begin insert into public.profiles (id, name) values (new.id, coalesce(new.raw_user_meta_data ->> 'name', 'Estudante QuímicaLab')); return new; end; $$;
create or replace trigger on_auth_user_created after insert on auth.users for each row execute procedure public.handle_new_user();

create table if not exists public.quiz_attempts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  total_questions integer not null check (total_questions > 0),
  correct_answers integer not null check (correct_answers >= 0 and correct_answers <= total_questions),
  xp_earned integer not null check (xp_earned >= 0),
  completed_at timestamptz not null default now()
);

create index if not exists quiz_attempts_user_completed_at_idx
  on public.quiz_attempts (user_id, completed_at desc);

alter table public.quiz_attempts enable row level security;

create policy "Quiz attempts are visible only to their owner"
  on public.quiz_attempts for select
  using (auth.uid() = user_id);

create or replace function public.record_quiz_attempt(
  p_total_questions integer,
  p_correct_answers integer,
  p_xp_earned integer
)
returns table (xp integer, level integer)
language plpgsql
security definer
set search_path = public
as $$
declare
  current_xp integer;
  current_level integer;
begin
  if auth.uid() is null then
    raise exception 'Authentication is required to save quiz progress.';
  end if;

  if p_total_questions <= 0 or p_correct_answers < 0 or p_correct_answers > p_total_questions or p_xp_earned < 0 then
    raise exception 'Invalid quiz result.';
  end if;

  insert into public.quiz_attempts (user_id, total_questions, correct_answers, xp_earned)
  values (auth.uid(), p_total_questions, p_correct_answers, p_xp_earned);

  update public.profiles
  set xp = xp + p_xp_earned,
      level = greatest(1, floor((xp + p_xp_earned) / 250.0)::integer + 1),
      updated_at = now()
  where id = auth.uid()
  returning profiles.xp, profiles.level into current_xp, current_level;

  return query select current_xp, current_level;
end;
$$;

revoke all on function public.record_quiz_attempt(integer, integer, integer) from public;
grant execute on function public.record_quiz_attempt(integer, integer, integer) to authenticated;

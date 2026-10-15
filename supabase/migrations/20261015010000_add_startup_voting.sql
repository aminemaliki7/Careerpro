alter table public.startups
  add column if not exists vote_score integer not null default 0;

create table if not exists public.startup_votes (
  startup_id text not null,
  user_id text not null,
  vote_value smallint not null check (vote_value in (-1, 1)),
  created_at timestamptz not null default now(),
  primary key (startup_id, user_id)
);

alter table public.startup_votes enable row level security;

create or replace function public.refresh_startup_vote_score()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  target_startup_id text;
begin
  if tg_op = 'DELETE' then
    target_startup_id := old.startup_id;
  else
    target_startup_id := new.startup_id;
  end if;

  update public.startups
  set vote_score = coalesce(
    (select sum(vote_value)::integer
     from public.startup_votes
     where startup_id = target_startup_id),
    0
  )
  where id::text = target_startup_id;

  if tg_op = 'DELETE' then
    return old;
  end if;
  return new;
end;
$$;

drop trigger if exists startup_votes_refresh_score on public.startup_votes;
create trigger startup_votes_refresh_score
after insert or update or delete on public.startup_votes
for each row execute function public.refresh_startup_vote_score();
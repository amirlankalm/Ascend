create extension if not exists vector;
create extension if not exists pgcrypto;

create type graph_node_type as enum ('goal','career','skill','quest','proof','grant','portfolio','milestone','competition');
create type graph_node_status as enum ('locked','available','in_progress','completed');
create type graph_edge_relation as enum ('requires','unlocks','proves','improves','funds','depends_on');
create type quest_status as enum ('available','in_progress','submitted','completed');
create type proof_status as enum ('pending','passed','needs_work');

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  age integer check (age between 10 and 25),
  city text not null default '',
  country text not null default '',
  school text not null default '',
  grade text not null default '',
  interests text[] not null default '{}',
  daily_available_time integer not null default 30 check (daily_available_time between 5 and 300),
  confidence_level text not null default 'beginner',
  onboarding_completed boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.goals (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  user_goal text not null,
  target_role text not null,
  motivation text not null default '',
  constraints text not null default '',
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.graph_nodes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  goal_id uuid references public.goals(id) on delete cascade,
  temp_id text,
  type graph_node_type not null,
  title text not null,
  description text not null default '',
  status graph_node_status not null default 'locked',
  x double precision not null default 0,
  y double precision not null default 0,
  difficulty integer not null default 1 check (difficulty between 1 and 5),
  xp integer not null default 0,
  metadata jsonb not null default '{}',
  created_at timestamptz not null default now()
);

create table public.graph_edges (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  goal_id uuid references public.goals(id) on delete cascade,
  source_node_id uuid not null references public.graph_nodes(id) on delete cascade,
  target_node_id uuid not null references public.graph_nodes(id) on delete cascade,
  relation graph_edge_relation not null,
  weight double precision not null default 1,
  metadata jsonb not null default '{}',
  created_at timestamptz not null default now()
);

create table public.quests (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  goal_id uuid references public.goals(id) on delete cascade,
  graph_node_id uuid references public.graph_nodes(id) on delete set null,
  temp_id text,
  title text not null,
  instructions text not null,
  expected_output text not null,
  time_estimate integer not null,
  difficulty integer not null check (difficulty between 1 and 5),
  xp_reward integer not null default 0,
  status quest_status not null default 'available',
  evaluation_rubric jsonb not null default '[]',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.proofs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  quest_id uuid not null references public.quests(id) on delete cascade,
  text_proof text,
  file_proof_path text,
  external_url text,
  ai_validation_scores jsonb not null default '{}',
  extracted_skills text[] not null default '{}',
  feedback text not null default '',
  status proof_status not null default 'pending',
  created_at timestamptz not null default now()
);

create table public.portfolio_items (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  proof_id uuid references public.proofs(id) on delete cascade,
  title text not null,
  summary text not null,
  cv_bullet text not null,
  long_description text not null,
  skills text[] not null default '{}',
  tags text[] not null default '{}',
  polish_score integer not null default 0,
  impact_score integer not null default 0,
  created_at timestamptz not null default now()
);

create table public.grants (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  provider text not null,
  country_region text not null,
  eligibility text not null,
  deadline date,
  amount text not null default '',
  tags text[] not null default '{}',
  url text,
  embedding vector(1536),
  created_at timestamptz not null default now()
);

create table public.grant_matches (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  grant_id uuid not null references public.grants(id) on delete cascade,
  match_score double precision not null,
  reason text not null,
  missing_requirements text[] not null default '{}',
  next_action text not null,
  created_at timestamptz not null default now(),
  unique (user_id, grant_id)
);

create table public.embeddings (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  owner_table text not null,
  owner_id uuid not null,
  content text not null,
  embedding vector(1536) not null,
  created_at timestamptz not null default now()
);

create table public.activity_log (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  event_type text not null,
  message text not null,
  metadata jsonb not null default '{}',
  created_at timestamptz not null default now()
);

create index graph_nodes_user_goal_temp_idx on public.graph_nodes (user_id, goal_id, temp_id);
create index graph_edges_user_goal_idx on public.graph_edges (user_id, goal_id);
create index quests_user_goal_temp_idx on public.quests (user_id, goal_id, temp_id);
create index proofs_user_quest_idx on public.proofs (user_id, quest_id);
create index portfolio_items_user_created_idx on public.portfolio_items (user_id, created_at desc);
create index grant_matches_user_score_idx on public.grant_matches (user_id, match_score desc);
create index grants_deadline_idx on public.grants (deadline);

create or replace function public.touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger touch_profiles_updated_at before update on public.profiles
for each row execute function public.touch_updated_at();

create trigger touch_goals_updated_at before update on public.goals
for each row execute function public.touch_updated_at();

create trigger touch_quests_updated_at before update on public.quests
for each row execute function public.touch_updated_at();

alter table public.profiles enable row level security;
alter table public.goals enable row level security;
alter table public.graph_nodes enable row level security;
alter table public.graph_edges enable row level security;
alter table public.quests enable row level security;
alter table public.proofs enable row level security;
alter table public.portfolio_items enable row level security;
alter table public.grants enable row level security;
alter table public.grant_matches enable row level security;
alter table public.embeddings enable row level security;
alter table public.activity_log enable row level security;

create policy "profiles own rows" on public.profiles for all using (auth.uid() = id) with check (auth.uid() = id);
create policy "goals own rows" on public.goals for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "graph_nodes own rows" on public.graph_nodes for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "graph_edges own rows" on public.graph_edges for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "quests own rows" on public.quests for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "proofs own rows" on public.proofs for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "portfolio own rows" on public.portfolio_items for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "grants public read" on public.grants for select using (true);
create policy "grant_matches own rows" on public.grant_matches for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "embeddings own rows" on public.embeddings for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "activity own rows" on public.activity_log for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

insert into storage.buckets (id, name, public)
values ('proofs', 'proofs', false)
on conflict (id) do nothing;

create policy "proof files readable by owner" on storage.objects
for select using (bucket_id = 'proofs' and auth.uid()::text = (storage.foldername(name))[1]);

create policy "proof files writable by owner" on storage.objects
for insert with check (bucket_id = 'proofs' and auth.uid()::text = (storage.foldername(name))[1]);

create or replace function public.match_grants(query_embedding vector(1536), match_threshold float, match_count int)
returns table (
  id uuid,
  title text,
  provider text,
  country_region text,
  eligibility text,
  deadline date,
  amount text,
  tags text[],
  url text,
  similarity float
)
language sql
stable
as $$
  select
    grants.id,
    grants.title,
    grants.provider,
    grants.country_region,
    grants.eligibility,
    grants.deadline,
    grants.amount,
    grants.tags,
    grants.url,
    1 - (grants.embedding <=> query_embedding) as similarity
  from public.grants
  where grants.embedding is not null
    and 1 - (grants.embedding <=> query_embedding) > match_threshold
  order by grants.embedding <=> query_embedding
  limit match_count;
$$;

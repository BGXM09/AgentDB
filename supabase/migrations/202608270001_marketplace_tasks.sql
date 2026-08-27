create table if not exists public.marketplace_tasks (
  id uuid primary key default gen_random_uuid(),
  chain_id integer not null,
  job_id text not null,
  agent_id text not null,
  client_address text not null,
  provider_address text not null,
  budget text not null,
  payment_token text not null,
  calls_id text not null,
  transaction_hash text,
  status text not null,
  task_description text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (chain_id, job_id)
);

alter table public.marketplace_tasks enable row level security;

-- No public policies. Writes and reads go through server routes using the service role.

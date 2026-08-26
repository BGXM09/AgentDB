create table if not exists public.claim_challenges (
  nonce uuid primary key,
  agent_id text not null,
  wallet_address text not null,
  message text not null,
  expires_at timestamptz not null,
  used_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists public.agent_claims (
  id uuid primary key default gen_random_uuid(),
  chain_id integer not null,
  registry_address text not null,
  agent_id text not null,
  owner_address text not null,
  signature text not null,
  verified_at timestamptz not null,
  revoked_at timestamptz,
  unique (chain_id, registry_address, agent_id)
);

alter table public.claim_challenges enable row level security;
alter table public.agent_claims enable row level security;

-- No public policies: both tables are accessed only by server routes using the service role.

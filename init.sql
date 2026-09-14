create table if not exists expenses (
  id          uuid primary key default gen_random_uuid(),
  amount      numeric(10, 2)  not null check (amount > 0),
  category    text            not null,
  description text,
  date        date            not null default current_date,
  created_at  timestamptz     not null default now()
);

create table if not exists budgets (
  id            uuid primary key default gen_random_uuid(),
  category      text            not null unique,
  monthly_limit numeric(10, 2)  not null check (monthly_limit > 0),
  created_at    timestamptz     not null default now()
);

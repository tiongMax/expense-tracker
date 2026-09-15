create table if not exists expenses (
  id          uuid primary key default gen_random_uuid(),
  amount      numeric(10, 2)  not null check (amount > 0),
  currency    text            not null default 'USD',
  category    text            not null,
  description text,
  date        date            not null default current_date,
  created_at  timestamptz     not null default now()
);

create table if not exists budgets (
  id            uuid primary key default gen_random_uuid(),
  category      text            not null,
  monthly_limit numeric(10, 2)  not null check (monthly_limit > 0),
  currency      text            not null default 'USD',
  created_at    timestamptz     not null default now()
);

create unique index if not exists budgets_category_currency_unique
  on budgets (category, currency);

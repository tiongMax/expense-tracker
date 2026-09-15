alter table expenses add column if not exists currency text;
update expenses set currency = 'USD' where currency is null;
alter table expenses alter column currency set default 'USD';
alter table expenses alter column currency set not null;

alter table budgets add column if not exists currency text;
update budgets set currency = 'USD' where currency is null;
alter table budgets alter column currency set default 'USD';
alter table budgets alter column currency set not null;

alter table budgets drop constraint if exists budgets_category_key;
alter table budgets drop constraint if exists budgets_category_unique;
drop index if exists budgets_category_unique;
create unique index if not exists budgets_category_currency_unique
  on budgets (category, currency);

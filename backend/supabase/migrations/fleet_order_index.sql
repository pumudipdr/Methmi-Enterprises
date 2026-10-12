-- Supports the public fleet query; apply through the database migration process.
create index if not exists vehicles_fleet_order_idx
  on public.vehicles (sort_order, slug);

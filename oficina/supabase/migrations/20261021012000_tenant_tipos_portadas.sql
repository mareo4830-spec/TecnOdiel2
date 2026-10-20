-- Tipos de negocio de los tenants del SaaS: solo los cuatro grupos de portadas.
-- barberia → barber · peluqueria (femenina) → women · estetica (salón de belleza) → beauty · unisex → unisex
update public.tenants set business_type = case business_type
  when 'salon' then 'peluqueria'
  when 'clinica' then 'estetica'
  else 'unisex'
end
where business_type is not null and business_type not in ('barberia', 'peluqueria', 'estetica', 'unisex');

alter table public.tenants drop constraint if exists tenants_business_type_check;
alter table public.tenants add constraint tenants_business_type_check
  check (business_type is null or business_type in ('barberia', 'peluqueria', 'estetica', 'unisex'));

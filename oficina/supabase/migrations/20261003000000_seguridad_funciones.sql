-- =====================================================================
-- Seguridad: las funciones de trigger no se exponen como RPC.
-- Solo las ejecutan los triggers; nadie (ni anon ni socios) debe llamarlas
-- por /rest/v1/rpc. Avisos del Security Advisor de Supabase.
-- =====================================================================

revoke execute on function public.link_partner_user() from public, anon, authenticated;
revoke execute on function public.tenant_billing_generate_payments() from public, anon, authenticated;
revoke execute on function public.tenants_check_project_kind() from public, anon, authenticated;
revoke execute on function public.tenants_create_integrations() from public, anon, authenticated;
revoke execute on function public.tenants_check_go_live() from public, anon, authenticated;
revoke execute on function public.tenants_live_to_done() from public, anon, authenticated;
revoke execute on function public.projects_check_kind_change() from public, anon, authenticated;
revoke execute on function public.saas_project_config_check_kind() from public, anon, authenticated;
revoke execute on function public.touch_updated_at() from public, anon, authenticated;

alter function public.touch_updated_at() set search_path = public;

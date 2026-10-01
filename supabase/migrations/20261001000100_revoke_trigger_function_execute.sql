-- Trigger functions are not meant to be called through the REST API.
-- (Supabase advisor lint 0028/0029.) username_available stays callable by
-- anon on purpose: the sign-up form checks names before an account exists.
revoke execute on function public.handle_new_user() from public, anon, authenticated;
revoke execute on function public.handle_user_email_change() from public, anon, authenticated;
revoke execute on function public.username_available(text) from public;
grant execute on function public.username_available(text) to anon, authenticated;

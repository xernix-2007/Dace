# DACE Authentication setup

## 1. Create a Supabase project
Create a project at https://supabase.com.

## 2. Environment variables
In Vercel and local .env.local, add:
- NEXT_PUBLIC_SUPABASE_URL
- NEXT_PUBLIC_SUPABASE_ANON_KEY

Use the project's public URL and publishable/anon key from Supabase.

## 3. Run the database schema
Open Supabase SQL Editor and run sde/supabase/schema.sql.

This creates profiles, stores email/name/username, and automatically creates a profile when a new Auth user signs up.

## 4. Enable email/password
Supabase Dashboard -> Authentication -> Providers -> Email.

## 5. Enable Google
Supabase Dashboard -> Authentication -> Providers -> Google.
Create/configure a Google OAuth app in Google Cloud and use the Supabase callback URL shown by Supabase.

## 6. Enable GitHub
Supabase Dashboard -> Authentication -> Providers -> GitHub.
Create a GitHub OAuth App and use the Supabase callback URL shown by Supabase.

The DACE login page sends OAuth users back to /auth/callback.

## 7. Auth redirect URL
In Supabase Authentication URL Configuration, add your deployed DACE URL plus /auth/callback, and your local URL if testing locally.

## 8. User count
Supabase Authentication -> Users shows registered Auth users.
After running the schema, public.profiles also contains one row per account and can be counted with:
select count(*) from public.profiles;

## 9. Admin
After creating your own account, run:
update public.profiles set role='admin' where email='YOUR_EMAIL@example.com';

Do not expose the service-role key in Next.js client code.

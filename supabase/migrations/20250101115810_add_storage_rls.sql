-- Set up storage for assets
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
  values ('assets', 'assets', true, 52428800, '{"image/png","image/jpeg"}');

-- Set up access controls for storage.
-- See https://supabase.com/docs/guides/storage#policy-examples for more details.
create policy "Assets are publicly accessible." on storage.objects
for select 
using (bucket_id = 'assets');

create policy "Anyone can upload an assets." on storage.objects
for insert
to authenticated
with check (bucket_id = 'assets');

create policy "A user can update their own assets." on storage.objects
for update 
using (auth.uid() = owner) 
with check (bucket_id = 'assets');

create policy "A user can delete their own assets." on storage.objects 
for delete 
to authenticated 
using (bucket_id = 'assets' and (storage.foldername(name))[1] = auth.uid()::text);
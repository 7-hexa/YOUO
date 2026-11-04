create table if not exists public.music_settings (
  id smallint primary key check (id = 1),
  title text not null check (char_length(title) between 1 and 160),
  artist text not null check (char_length(artist) between 1 and 160),
  audio_url text not null,
  cover_url text not null,
  updated_at timestamptz not null default now()
);

alter table public.music_settings enable row level security;

grant select on public.music_settings to anon, authenticated;
grant insert, update on public.music_settings to authenticated;

drop policy if exists "Public can read the current song" on public.music_settings;
create policy "Public can read the current song"
  on public.music_settings for select
  to anon, authenticated
  using (true);

drop policy if exists "Owner can insert the current song" on public.music_settings;
create policy "Owner can insert the current song"
  on public.music_settings for insert
  to authenticated
  with check ((select auth.jwt() ->> 'email') = 'OWNER_EMAIL_HERE');

drop policy if exists "Owner can update the current song" on public.music_settings;
create policy "Owner can update the current song"
  on public.music_settings for update
  to authenticated
  using ((select auth.jwt() ->> 'email') = 'OWNER_EMAIL_HERE')
  with check ((select auth.jwt() ->> 'email') = 'OWNER_EMAIL_HERE');

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'youo-music',
  'youo-music',
  true,
  52428800,
  array['audio/mpeg', 'audio/mp4', 'audio/aac', 'audio/ogg', 'audio/wav', 'audio/x-wav', 'audio/flac', 'image/jpeg', 'image/png', 'image/webp']
)
on conflict (id) do update
  set public = excluded.public,
      file_size_limit = excluded.file_size_limit,
      allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "Public can read YOUO music files" on storage.objects;
create policy "Public can read YOUO music files"
  on storage.objects for select
  to anon, authenticated
  using (bucket_id = 'youo-music');

drop policy if exists "Owner can upload YOUO music files" on storage.objects;
create policy "Owner can upload YOUO music files"
  on storage.objects for insert
  to authenticated
  with check (
    bucket_id = 'youo-music'
    and (select auth.jwt() ->> 'email') = 'OWNER_EMAIL_HERE'
  );

drop policy if exists "Owner can update YOUO music files" on storage.objects;
create policy "Owner can update YOUO music files"
  on storage.objects for update
  to authenticated
  using (
    bucket_id = 'youo-music'
    and (select auth.jwt() ->> 'email') = 'OWNER_EMAIL_HERE'
  )
  with check (
    bucket_id = 'youo-music'
    and (select auth.jwt() ->> 'email') = 'OWNER_EMAIL_HERE'
  );

drop policy if exists "Owner can delete YOUO music files" on storage.objects;
create policy "Owner can delete YOUO music files"
  on storage.objects for delete
  to authenticated
  using (
    bucket_id = 'youo-music'
    and (select auth.jwt() ->> 'email') = 'OWNER_EMAIL_HERE'
  );

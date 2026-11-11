-- ============================================================
-- SQL Setup untuk Supabase Comments / Guestbook
-- Jalankan script ini di: Supabase Dashboard -> SQL Editor -> New Query -> Run
-- ============================================================

-- 1. Buat Tabel Comments
create table if not exists public.comments (
    id text primary key,
    name text not null,
    comment text not null,
    created_at timestamp with time zone default now() not null,
    formatted_date text not null
);

-- 2. Aktifkan Row Level Security (RLS)
alter table public.comments enable row level security;

-- 3. Policy: Izinkan siapa saja (publik / anon) untuk membaca komentar
drop policy if exists "Allow public read access" on public.comments;
create policy "Allow public read access"
on public.comments for select
to anon
using (true);

-- 4. Policy: Izinkan siapa saja (publik / anon) untuk mengirim komentar
drop policy if exists "Allow public insert access" on public.comments;
create policy "Allow public insert access"
on public.comments for insert
to anon
with check (true);

-- 5. Masukkan komentar awal (migrasi dari data sebelumnya)
insert into public.comments (id, name, comment, created_at, formatted_date) values
('cmt_f6b165a75ceb', 'CEO PT LAGUNA', 'anjayy', '2026-11-07T19:11:38+07:00', '7 Nov 2026'),
('cmt_7a9b07f2382a', 'timothy ronald', 'bagus anak muda', '2026-11-06T11:52:53+07:00', '6 Nov 2026'),
('cmt_78f7e9a5537e', 'prikitiw', 'bjirrrrr boboiboy halilintar', '2026-11-06T11:51:51+07:00', '6 Nov 2026'),
('cmt_3163edfcaab6', 'gusj', 'mantap bang', '2026-11-06T11:51:17+07:00', '6 Nov 2026'),
('cmt_8d8f62be9c5c', 'renky.', 'bagi source code bg', '2026-11-06T11:30:49+07:00', '6 Nov 2026'),
('cmt_e059818d7ad6', 'ticanddzzz', 'alamak', '2026-11-06T11:30:18+07:00', '6 Nov 2026')
on conflict (id) do nothing;

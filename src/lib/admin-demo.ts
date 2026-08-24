/**
 * Stand-in rows for the panel.
 *
 * Every name here is a role rather than a person, and every address a role
 * address: nothing in this file should ever be mistaken for a record of
 * somebody real. It goes when the panel is given a database.
 */

export type DemoUser = {
  name: string;
  email: string;
  role: string;
  scope: string;
  seen: string;
  active: boolean;
};

export const DEMO_USERS: DemoUser[] = [
  {
    name: "Admin Utama",
    email: "admin@iconzbaznas.com",
    role: "Administrator",
    scope: "Seluruh panel",
    seen: "Hari ini, 08.42",
    active: true,
  },
  {
    name: "Editor Konten",
    email: "konten@iconzbaznas.com",
    role: "Editor",
    scope: "Semua halaman situs",
    seen: "Kemarin, 16.10",
    active: true,
  },
  {
    name: "Editor Media",
    email: "media@iconzbaznas.com",
    role: "Editor",
    scope: "Gambar, logo, rekaman",
    seen: "3 hari lalu",
    active: true,
  },
  {
    name: "Peninjau",
    email: "peninjau@iconzbaznas.com",
    role: "Peninjau",
    scope: "Hanya membaca",
    seen: "2 minggu lalu",
    active: false,
  },
];

export type DemoLog = {
  at: string;
  who: string;
  did: string;
  target: string;
};

export const DEMO_LOG: DemoLog[] = [
  { at: "24 Agu 2026, 08.41", who: "Admin Utama", did: "Masuk ke panel", target: "—" },
  { at: "24 Agu 2026, 08.20", who: "Editor Media", did: "Mengunggah logo", target: "Masyarakat Ekonomi Syariah (MES)" },
  { at: "23 Agu 2026, 17.05", who: "Editor Konten", did: "Menyunting teks", target: "Proceedings · procText" },
  { at: "23 Agu 2026, 16.48", who: "Editor Konten", did: "Menyunting teks", target: "Home · heroCta1" },
  { at: "23 Agu 2026, 11.12", who: "Admin Utama", did: "Menambah pengguna", target: "Peninjau" },
  { at: "22 Agu 2026, 09.30", who: "Editor Media", did: "Mengganti rekaman", target: "Previous ICONZ · edisi 2025" },
  { at: "21 Agu 2026, 15.02", who: "Editor Konten", did: "Menyunting sub-tema", target: "Call for Paper" },
  { at: "21 Agu 2026, 10.44", who: "Admin Utama", did: "Masuk ke panel", target: "—" },
];

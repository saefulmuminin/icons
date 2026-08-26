# Catatan Rilis

Situs ICONZ 10. Format tanggal: YYYY-MM-DD.

---

## 0.2.0 — 2026-08-26

Standarisasi proyek terhadap SOP mutu Direktorat Inovasi dan Teknologi
Informasi (SD-104 kode, SD-106 pengujian, SD-111 antarmuka).

### Ditambahkan

- **Pengujian.** Vitest dengan 17 unit test di `src/tests/`: kesamaan kunci
  antara kamus Inggris dan Indonesia, keutuhan navigasi, keabsahan seluruh
  tautan keluar, urutan arsip edisi, dan keterhubungan tiap lembaga dengan
  berkas logonya.
- **`run-all-checks.sh`.** Menjalankan lint, pemeriksaan tipe, unit test dan
  build sekaligus, dengan ringkasan berstatus GO / NO GO dan *exit code*.
  Dipanggil lewat `npm run check`.
- **Kontainer.** `Dockerfile` bertahap (deps → build → runtime standalone,
  dijalankan pengguna non-root), `docker-compose.yml` dengan nginx sebagai
  peladen di depan pada porta 9797, dan `nginx/nginx.conf`.
- **Health check** di `/api/health`, mengikuti bentuk yang distandarkan.
- **`README.md`** sesuai `readme_specification.md`, memuat kebutuhan server,
  instalasi, panduan pengujian, struktur folder, cara mengganti isi, dan
  daftar butir SOP yang tidak berlaku beserta alasannya.
- **Animasi angka** pada pita fakta beranda — berjalan naik saat masuk layar,
  diam untuk pembaca yang meminta gerak seminimalnya.

### Diubah

- **Warna.** 30 warna yang tertulis langsung di komponen dipindahkan menjadi
  24 token tema di `globals.css` (QUI2-2). Yang tersisa hanya lambang pihak
  lain — logo Google dan dua bendera negara — dan itu memang tidak boleh
  diseragamkan ke palet kita.
- **Lockfile** dibangkitkan ulang di lingkungan Linux agar `npm ci` di dalam
  kontainer memperoleh pohon dependensi yang sama.
- `next.config.ts` menghasilkan keluaran `standalone`.

### Dihapus

- **Panel admin** beserta halaman masuknya. Situs ini statis dan tidak memiliki
  peladen untuk memeriksa kata sandi; panel tanpa penjagaan di sisi peladen
  adalah pintu yang tampak terkunci padahal tidak.
- Aturan `Disallow: /admin` pada `robots.txt`, karena alamatnya sudah tiada.

### Belum terpenuhi

- QSC1-6 / QUI1-7 batas 500 baris: `content.ts` (875) dan
  `submission/page.tsx` (603).
- QSC1-8 batas 120 karakter: 146 baris.
- QUI3-5 larangan ukuran font 15px/17px: 41 kemunculan — menunggu keputusan
  desain.
- QUI7-4 radius kartu 8px: 35 kartu memakai 12/16px — menunggu keputusan
  desain.
- QT1-1 integration, system, dan acceptance testing.

---

## 0.1.0 — 2026-08-22

Rilis awal situs.

- Beranda: sampul video, hitung mundur, latar belakang, tujuan, pembicara,
  tanggal penting, penyelenggara dan pendukung.
- Halaman Conference, Paper Submission (Call for Papers dan Call for
  International Book Chapter), Previous ICONZ, Proceedings, dan Register.
- Dua bahasa penuh dengan *canonical*, *hreflang*, kartu berbagi, dan data
  terstruktur Event.
- Layar pembuka bervideo yang menyesuaikan arah layar, serta layar transisi
  antar halaman.
- Halaman 404 dan halaman gagal muat dengan tampilan sendiri.

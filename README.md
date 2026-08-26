# ICONZ 10 — Situs Konferensi

Situs publik **The 10th International Conference on Zakat**, diselenggarakan
BAZNAS RI bersama IPB University dan Kementerian Agama.

Dua bahasa (Inggris dan Indonesia), seluruhnya di-*prerender* menjadi HTML
statis saat build — tidak ada basis data, tidak ada API, tidak ada proses
server yang berjalan saat pengunjung membuka halaman.

- **Produksi**: <https://iconzbaznas.com>
- **Catatan rilis**: [release.md](./release.md)

---

## Kebutuhan Server

Situs ini statis. Yang dibutuhkan hanyalah lingkungan untuk **membangun**-nya;
hasil build berupa berkas statis yang disajikan CDN.

| Kebutuhan | Versi | Catatan |
|---|---|---|
| Node.js | 25.2.1 (min. 20) | Bahasa pemrograman |
| npm | 11.6.2 | Manajer paket |
| Sistem operasi | macOS / Linux | Build berjalan di keduanya |
| Web server | — | Disajikan Vercel Edge Network |
| Docker | 29.x | Kontainer |
| Docker Compose | 2.40.x | Orkestrasi |
| nginx | 1.27-alpine | Peladen di depan aplikasi |
| Basis data | — | Tidak ada. Isi situs berada di berkas TypeScript |

### Pustaka utama

| Pustaka | Versi | Kegunaan |
|---|---|---|
| next | 16.3.1 | Kerangka kerja, App Router, optimasi gambar |
| react / react-dom | 19.2.8 | Pustaka antarmuka |
| tailwindcss | 4.x | Sistem gaya, token warna dan tipografi |
| animejs | 4.5.0 | Animasi masuk, layar pembuka, korsel |
| typescript | 5.x | Pemeriksaan tipe |
| eslint / eslint-config-next | 9.x / 16.3.1 | Pemeriksaan mutu kode |
| vitest | 4.1.11 | Unit testing |

---

## Instalasi

```bash
git clone <repositori>
cd icons
npm install
npm run dev            # http://localhost:3000
```

Salin `.env.example` menjadi `.env.local` bila perlu menimpa alamat situs:

```bash
NEXT_PUBLIC_SITE_URL=https://iconzbaznas.com
```

Variabel ini menyetir *canonical*, *hreflang*, dan kartu berbagi. Bila tidak
diisi, nilai bawaannya sudah alamat produksi.

## Membangun & menjalankan

```bash
npm run build          # menghasilkan HTML statis
npm start              # menjalankan hasil build secara lokal
```

## Pengujian

```bash
npm run check          # semua gate sekaligus, keluaran GO / NO GO
```

Atau satu per satu:

```bash
npm run lint           # ESLint
npm run typecheck      # tsc --noEmit
npm test               # unit test (vitest)
npm run build          # build produksi
```

`npm run check` menjalankan `src/tests/run-all-checks.sh` dan menampilkan
ringkasan berstatus **GO / NO GO** untuk setiap gate, dengan *exit code* 0 bila
seluruhnya lolos — siap dipakai di CI.

### Unit testing

Berkas uji berada di `src/tests/`, dijalankan Vitest di lingkungan Node.
Yang diuji adalah data dan fungsi murni: keutuhan kamus dua bahasa, navigasi,
dan keterhubungan isi situs dengan berkas gambarnya.

### Integration testing

Belum tersedia. Untuk situs statis, pengganti yang setara adalah **smoke test**
— memastikan setiap halaman hasil build menjawab HTTP 200 — dan belum
dikerjakan. Lihat *Pengecualian* di bawah.

---

## Menjalankan dengan Docker

```bash
docker compose up -d --build     # bangun dan nyalakan
open http://localhost:9797       # nginx → aplikasi
docker compose logs -f           # ikuti log
docker compose down              # matikan
```

Dua kontainer:

| Kontainer | Peran | Porta |
|---|---|---|
| `iconz-fe` | Peladen Next.js (keluaran `standalone`) | 3000, internal |
| `iconz-nginx` | Peladen di depan: gzip, cache aset, satu-satunya porta publik | **9797** |

nginx menunggu `iconz-fe` dinyatakan sehat sebelum menyala, sehingga tidak ada
jendela waktu ketika porta sudah terbuka tetapi aplikasinya belum siap.

### Health check

```bash
curl http://localhost:9797/api/health
```

```json
{
  "status": "success",
  "message": "Connection is working properly!",
  "timestamp": "2026-08-26T01:45:33.253Z",
  "version": "0.1.0",
  "service": "The 10th ICONZ Website"
}
```

Alamat ini juga dipakai Docker sendiri sebagai `HEALTHCHECK`, sehingga
kontainer yang tidak sehat terlihat pada `docker ps`.

### Catatan lockfile

`package-lock.json` dibangkitkan di lingkungan Linux. npm merekam dependensi
opsional menurut platform tempat ia dijalankan, sehingga lockfile yang dibuat
di macOS membuat `npm ci` di dalam kontainer gagal. Bila lockfile perlu
diperbarui:

```bash
docker run --rm -v "$PWD":/w -w /w node:22-alpine \
  npm install --package-lock-only --include=optional
```

---

## Pembaruan versi

```bash
npm outdated                  # melihat yang tertinggal
npm update                    # pembaruan minor & patch
npm install next@latest       # pembaruan mayor, satu per satu
npm run check                 # wajib GO sebelum dilanjutkan
```

Setelah pembaruan mayor Next.js, baca panduan di
`node_modules/next/dist/docs/` — versi ini kerap membawa perubahan yang
memutus kompatibilitas.

Catat setiap rilis di [release.md](./release.md).

---

## Struktur folder

```
icons/
├── public/                  Aset yang disajikan apa adanya
│   ├── editor/              Foto editor buku
│   ├── logo/                Logo lembaga
│   │   └── edition/         Logo tiap edisi ICONZ
│   ├── proceedings/         Sampul prosiding per tahun
│   ├── pembicara/           Foto pembicara
│   ├── publisher/           Logo penerbit
│   └── loader/              Video layar pembuka
│
├── src/
│   ├── app/                 Rute (Next.js App Router)
│   │   ├── [lang]/          Halaman publik, per bahasa
│   │   ├── globals.css      Token warna, tipografi, animasi
│   │   ├── robots.ts        robots.txt
│   │   └── sitemap.ts       sitemap.xml
│   │
│   ├── components/          Komponen antarmuka
│   ├── lib/                 Data dan fungsi murni
│   │   ├── content.ts       Isi konferensi (pembicara, edisi, tautan)
│   │   ├── i18n.ts          Kamus dua bahasa
│   │   ├── edition.ts       Identitas edisi
│   │   ├── nav.ts           Daftar navigasi
│   │   └── seo.ts           Canonical, hreflang, JSON-LD
│   │
│   └── tests/               Unit test + run-all-checks.sh
│
├── template-ai-agent/       Salinan SOP mutu (SD-104, SD-106, SD-111)
├── release.md               Catatan rilis
└── README.md
```

### Rute

| Alamat | Halaman |
|---|---|
| `/en`, `/id` | Beranda |
| `/{lang}/conference` | Konferensi |
| `/{lang}/submission` | Call for Papers & Book Chapter |
| `/{lang}/previous` | Arsip ICONZ sebelumnya |
| `/{lang}/proceedings` | Arsip prosiding |
| `/{lang}/register` | Pendaftaran |

`/` mengalihkan ke `/en`. `/{lang}/call-for-paper` mengalihkan permanen ke
`/{lang}/submission`.

---

## Cara mengganti isi

Sebagian besar perubahan tidak memerlukan penyuntingan kode.

| Yang diganti | Caranya |
|---|---|
| Tulisan di halaman | `src/lib/i18n.ts` — dua bahasa, kunci sama |
| Pembicara, edisi, tautan | `src/lib/content.ts` |
| Nomor edisi & nama | `src/lib/edition.ts` |
| Logo lembaga | Taruh di `public/logo/`, **beri nama persis seperti nama lembaganya** |
| Logo edisi | `public/logo/edition/2025.png` — bernama tahun |
| Sampul prosiding | `public/proceedings/2025.png` — bernama tahun |
| Foto editor buku | `public/editor/nama-editor.png` |
| Logo penerbit | `public/publisher/springer.svg` |

Pencocokan nama berkas bersifat longgar: tanda baca, spasi, dan besar-kecil
huruf diabaikan. Unit test menjaga agar tiap lembaga yang disebut benar-benar
punya berkas logonya — mengganti nama lembaga tanpa mengganti nama berkas akan
membuat gate gagal, bukan diam-diam menghilangkan logonya.

---

## Pengecualian terhadap SOP

SOP `template-ai-agent` disusun untuk **service/API yang tayang di Cloud Run**.
Situs ini statis, sehingga sebagian butir tidak dapat diterapkan. Dicatat di
sini agar dapat ditelusuri saat audit.

| Butir | Alasan |
|---|---|
| QSC1-1 OOP, QSC2 ketentuan class | React modern berbasis fungsi; tidak ada class |
| QSC1-3 camelCase untuk fungsi | Komponen React wajib PascalCase — aturan bahasa, bukan gaya |
| QSC1-2 indentasi 4 spasi | Prettier (2 spasi) berjalan otomatis dan menjaga konsistensi |
| QSC7-1 struktur MVC | Next App Router menentukan struktur folder; letak berkas menentukan rute |
| QSC1-15 controller tanpa query, QSC8 exception | Tidak ada controller, tidak ada basis data |
| QT3-2…7 HTTP 400/422/403, SQL & XSS | Tidak ada API dan tidak ada input yang diterima server |
| QT6-2 login sesuai role | Tidak ada autentikasi; situs sepenuhnya publik |
| Cloud Run | Situs tayang di Vercel; berkas kontainer disediakan untuk lingkungan yang membutuhkannya |
| QUI8 peta | Tidak ada komponen peta |

### Butir yang belum terpenuhi

| Butir | Keadaan |
|---|---|
| QSC1-6 / QUI1-7 maks 500 baris | `content.ts` 875, `submission/page.tsx` 603 |
| QSC1-8 maks 120 karakter | 146 baris |
| QUI3-5 dilarang font 15px/17px | 41 kemunculan — menunggu keputusan desain |
| QUI7-4 radius kartu 8px | 35 kartu memakai 12/16px — menunggu keputusan desain |
| QT1-1 integration, system, acceptance testing | Belum ada; smoke test direncanakan |

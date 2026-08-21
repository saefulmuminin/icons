# The 10th ICONZ — Website

Situs resmi **The 10th International Conference on Zakat** (24 – 26 November 2026,
Faculty of Economics and Management, IPB Dramaga Campus, Bogor).

Dibangun ulang dari `ICONZ 10 Website.html` (satu file HTML dengan template engine
bawaan) menjadi aplikasi Next.js dengan Tailwind CSS.

## Stack

| | |
|---|---|
| Framework | Next.js 16 (App Router, Turbopack) |
| UI | React 19 |
| Styling | Tailwind CSS v4 (konfigurasi via `@theme` di CSS, tanpa `tailwind.config`) |
| Bahasa | TypeScript |
| Font | `next/font/google` — Instrument Sans + Plus Jakarta Sans (self-hosted otomatis) |

## Menjalankan

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # build produksi
npm run start    # jalankan hasil build
npm run lint
```

## Struktur

```
src/
├─ app/
│  ├─ [lang]/                  # segmen bahasa: "en" | "id"
│  │  ├─ layout.tsx            # root layout: <html lang>, font, header, footer, metadata
│  │  ├─ page.tsx              # Beranda
│  │  ├─ conference/           # Konferensi
│  │  ├─ call-for-paper/       # Call for Paper
│  │  ├─ submission/           # Submisi
│  │  ├─ previous/             # ICONZ Sebelumnya
│  │  └─ proceedings/          # Prosiding
│  ├─ globals.css              # design token Tailwind (@theme) + base style
│  ├─ icon.png, apple-icon.png # favicon, diambil dari logo "10"
│  ├─ robots.ts, sitemap.ts
├─ components/
│  ├─ site-header.tsx          # navigasi + menu mobile + tombol ganti bahasa (client)
│  ├─ site-footer.tsx
│  ├─ countdown.tsx            # hitung mundur (client)
│  └─ ui.tsx                   # Container, Eyebrow, SectionTitle, PageTitle, Cta
└─ lib/
   ├─ i18n.ts                  # kamus EN/ID
   ├─ content.ts               # data konferensi: tujuan, pembicara, sub-tema, jurnal, dll
   ├─ nav.ts                   # daftar menu + helper URL berbahasa
   ├─ clock.ts                 # sumber waktu untuk countdown
   └─ site.ts                  # base URL untuk canonical/hreflang
```

## Perbedaan dari versi HTML

Versi lama adalah satu halaman yang berganti "halaman" lewat state dan `localStorage`.
Versi ini memakai routing sungguhan:

- **URL per halaman dan per bahasa** — `/en`, `/id/call-for-paper`, dst. Bisa
  di-bookmark, dibagikan, dan diindeks mesin pencari. `/` diarahkan ke `/en`
  (lihat `next.config.ts`).
- **Dirender di server (SSG)** — seluruh 12 halaman di-prerender jadi HTML statis
  saat build, jadi isinya terbaca crawler tanpa menjalankan JavaScript.
- **Metadata lengkap** — `<title>` per halaman, canonical, `hreflang` EN/ID,
  Open Graph, `sitemap.xml`, dan `robots.txt`.
- **Responsif** — layout lama memakai grid dengan kolom tetap sehingga pecah di
  layar kecil. Semua bagian kini punya breakpoint, dan navigasi berubah menjadi
  menu hamburger di bawah 1024px.
- **Tailwind menggantikan inline style** — palet, jenis huruf, dan animasi
  didefinisikan sekali sebagai token di `globals.css`.
- **Gambar dioptimalkan** — logo diproses `next/image`; font di-host sendiri lewat
  `next/font` sehingga tidak ada permintaan ke Google Fonts saat halaman dibuka.

Ganti bahasa kini menukar segmen URL (`/id/previous` ⇄ `/en/previous`), bukan
menyimpan pilihan di `localStorage`.

## Mengubah konten

Semua teks dan data ada di dua berkas, tidak tercampur dengan markup:

- `src/lib/i18n.ts` — semua label dan paragraf, berpasangan EN/ID.
- `src/lib/content.ts` — tanggal, tautan, tujuan, pembicara, sub-tema, jurnal,
  penyelenggara, pendukung, dan arsip ICONZ terdahulu.

Tanggal dan tautan penting terkumpul di `CONFERENCE` dan `LINKS` pada
`src/lib/content.ts`. Target hitung mundur diambil dari `CONFERENCE.startsAt`.

## Konfigurasi

| Env | Default | Keterangan |
|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | `https://iconzbaznas.com` | Base URL untuk canonical, `hreflang`, Open Graph, dan `sitemap.xml`. **Setel sesuai domain produksi sebelum rilis.** |

Menambah bahasa: tambahkan kode bahasa di `LANGS` dan kamusnya di `dictionaries`
(`src/lib/i18n.ts`), lalu lengkapi varian data di `src/lib/content.ts`. Routing,
sitemap, dan tombol ganti bahasa mengikuti otomatis.

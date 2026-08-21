# Ilustrasi spot — bagian 04 Tanggal Penting

Kartu tanggal penting kini bergaya mendatar dengan **ilustrasi kecil di pojok
kanan bawah**, mengikuti gaya kartu aplikasi BAZNAS. Ilustrasi lama yang
berukuran penuh tidak cocok untuk slot ini — yang dibutuhkan adalah *spot
illustration*: satu objek atau adegan kecil, tanpa latar.

## Spesifikasi berkas

| Hal | Ketentuan |
| --- | --- |
| Latar | **Transparan** (PNG dengan alpha, atau SVG). Bukan putih. |
| Ukuran | Persegi, 600 × 600 px sudah cukup |
| Komposisi | Objek menempel ke **tepi kanan dan bawah** kanvas, sisi kiri-atas dibiarkan kosong |
| Gaya | Vektor datar, garis bersih, bayangan minim — seragam dengan kartu aplikasi |
| Warna | Dominan hijau BAZNAS (#1e7a45 / #3aa85f), boleh satu aksen hangat (oranye atau emas) |
| Larangan | Tidak ada teks, tidak ada logo, tidak ada bingkai kotak |
| Hindari | **Bidang putih besar berbentuk kotak** — layar proyektor, papan tulis, kanvas, lembar kertas melebar. Di atas kartu berwarna pucat, bidang seperti itu terbaca sebagai sisa latar yang belum terpotong, walau berkasnya sudah transparan sempurna. Kalau butuh layar atau papan, beri warna hijau tua, abu gelap, atau krem bertepi tegas |

Simpan di `public/ilutasi/` dan **beri nama sesuai label langkahnya** —
nama berkas itulah yang menyambungkan gambar ke langkahnya. Nama ekspor bawaan
seperti `ChatGPT Image ....png` tidak akan terpasang. Pencocokannya sendiri
longgar: tanda baca, spasi, dan ekstensi diabaikan, jadi tidak perlu persis.

## Prop tiap langkah

### 01 — `Batas waktu pengiriman full paper.png`
Setumpuk naskah dengan penjepit, di sebelahnya jam pasir yang pasirnya hampir
habis. Boleh ditambah satu lembar melayang yang baru masuk ke dalam tumpukan.
Nada: mendesak tapi rapi — hindari wajah panik.

### 02 — `Pemberitahuan penerimaan full paper.png`
Amplop terbuka dengan surat setengah keluar, dan tanda centang hijau melayang
di atasnya. Boleh diganti sertifikat kecil bersegel emas.
Nada: lega, kabar baik.

### 03 — `Technical meeting presentasi paper.png`
Laptop terbuka menampilkan kotak-kotak peserta rapat daring, dengan ikon
mikrofon dan headset kecil di sekitarnya. Layarnya jangan diberi teks terbaca —
cukup bentuk abstrak.
Nada: persiapan, koordinasi.

### 04 — `Presentasi paper.png`
Podium kecil dengan mikrofon dan layar proyektor di belakangnya berisi grafik
batang sederhana. Boleh ditambah pointer laser atau setumpuk kartu catatan.
Nada: tampil, berbagi temuan.

> **Perlu dibuat ulang.** Versi yang ada sekarang layar proyektornya putih polos
> dan lebar, sehingga tampak seperti kotak latar yang tertinggal. Minta layarnya
> berlatar **hijau tua** dengan grafik terang di atasnya, atau perkecil layarnya
> dan miringkan supaya tidak jadi bidang persegi yang mendominasi.

### 05 — `Konferensi ICONZ ke-10.png`
Gedung konferensi bergaya ikon dengan bola dunia di sisinya dan bendera kecil
di puncaknya — atau lanyard peserta dengan bola dunia. Ini kartu terakhir yang
berlatar **hijau tua**, jadi ilustrasinya harus terbaca di atas gelap:
perbanyak warna terang (mint, putih, emas) dan hindari garis hijau tua.
Nada: puncak acara, skala internasional.

## Catatan

Kartu langkah 05 melebar penuh dan warnanya terbalik (latar hijau tua, teks
putih). Empat kartu lainnya berlatar putih. Karena itu ilustrasi 05 perlu
palet yang berbeda dari empat lainnya.

## Warna aksen tiap kartu

Tiap kartu punya satu warna sendiri. Warnanya tidak dipakai sebagai bilah tegas,
melainkan sebagai **wash samar** di seluruh badan kartu (8%), garis tepi rambut
(22%), nomor langkah, tanggal, dan titik penanda di rel.

| Langkah | Aksen | Latar kartu |
| --- | --- | --- |
| 01 Batas waktu | `#b45309` amber | wash amber |
| 02 Pemberitahuan | `#1e7a45` hijau BAZNAS | wash hijau |
| 03 Technical meeting | `#0e7490` teal | wash teal |
| 04 Presentasi paper | `#4d7c0f` olive | wash olive |
| 05 Konferensi ICONZ | `#7fd3a2` mint | hijau tua penuh |

Wash-nya dihitung dari warna aksen, bukan ditulis tangan — ganti satu warna di
`ACCENTS` dan seluruh kartu ikut menyesuaikan.

## Transparansi

**Kelima ilustrasi sekarang bertransparansi penuh.** Dua di antaranya semula
digambar di atas latar padat (`Presentasi paper` putih, `Konferensi ICONZ ke-10`
hijau tua) dan sudah diganti dengan versi yang latarnya dipotong bersih.

Untuk ilustrasi baru, tetap minta latar transparan sejak awal. Kartu kini
berwarna samar dan berbeda-beda, jadi ilustrasi berlatar padat akan tampak
sebagai kotak yang warnanya tidak nyambung — masalah yang tidak bisa diakali
lagi dengan menyamakan warna kartu.

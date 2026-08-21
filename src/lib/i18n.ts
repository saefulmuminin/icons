export type Lang = "en" | "id";

export const LANGS: Lang[] = ["en", "id"];

const en = {
  navHome: "Home",
  navConference: "Conference",
  navCfp: "Call for Paper",
  navSubmission: "Submission",
  navPrevious: "Previous ICONZ",
  navProceedings: "Proceedings",
  register: "Register",
  langSwitch: "ID",
  menu: "Menu",
  closeMenu: "Close menu",
  toTop: "Back to top",

  heroBadge: "Bogor, Indonesia · 2026",
  heroCta1: "Register now",
  heroCta2: "Submit a paper",
  heroSoundOn: "Turn on the video sound",
  heroSoundOff: "Mute the video",
  heroComingSoon: "Coming soon",
  dateLabel: "Date & Venue",
  dateOnly: "Date",
  venueLabel: "Venue",
  calendarCta: "Add to Google Calendar",
  mapCta: "Open in Google Maps",
  themeLabel: "Theme",
  countdownLabel: "Counting down to day one",
  cdD: "Days",
  cdH: "Hours",
  cdM: "Min",
  cdS: "Sec",

  factParticipants: "Participants targeted",
  factSubevents: "Sub-events",
  factDays: "Conference days",
  factJournals: "Publication outlets",

  bgTitle: "Background",
  bgIntro:
    "Why the tenth edition turns from what zakat has achieved at home to what it could achieve together.",
  bgKey1: "Local progress",
  bgKey2: "A global challenge",
  bgKey3: "Why this theme",
  bgKey4: "Toward collaboration",
  imageZoom: "Enlarge the picture",
  imageClose: "Close the picture",
  videoClose: "Close the video",
  registerClose: "Close the registration form",
  registerNewTab: "Open in a new tab",
  splashSkip: "Skip",
  loading: "Loading",
  speakerProfile: "View profile",
  profileEducation: "Education",
  profileWork: "Professional experience",
  profileEntrepreneur: "Entrepreneurship",
  profileCommunity: "Community empowerment",
  profilePolitics: "Public office & policy",
  profileDakwah: "Da'wah",
  profileSchooling: "Education leadership",
  bg1: "The development of zakat management and philanthropy over the past two decades has shown significant progress at the local level. Many countries, including Indonesia, have successfully built zakat collection and distribution systems that are more structured, transparent, and directly impactful for society. Various economic empowerment, education, and social service programs based on zakat have yielded tangible results in increasing the income of mustahik (zakat recipients) and strengthening social resilience at the community level.",
  bg2: "However, this impact is still dominated by local and national approaches, while the challenges faced by humanity are becoming increasingly global. Transnational poverty, humanitarian crises, conflicts, disasters, and the impacts of climate change cannot be resolved in isolation by individual nations. In this context, zakat and philanthropy hold immense potential to serve as instruments of global solidarity capable of bridging gaps and collectively responding to humanitarian issues.",
  bg3: "The theme “From Local Impact to Global Solidarity: The Future of Zakat and Philanthropy” is chosen to emphasize the need to transform the role of zakat and philanthropy from locally impactful instruments into a collaborative force on a global scale. This transformation demands the integration of management innovation, robust governance, and the alignment of humanitarian values across countries. Without a framework for global solidarity, the impact of zakat and philanthropy will remain fragmented and suboptimal in addressing shared challenges.",
  bg4: "This theme also reflects the urgent need to strengthen collaboration among zakat institutions, philanthropic organizations, governments, academics, and the private sector at the international level. Through structured cooperation, zakat and philanthropy can contribute to human development, inequality reduction, and the creation of a more sustainable shared prosperity. Ultimately, the future of zakat and philanthropy will not only be determined by local success, but by its capacity to build global solidarity rooted in the values of justice and humanity.",

  objTitle: "Objectives of the 10th ICONZ",
  objIntro:
    "Formulated to address the need to strengthen the role of zakat and philanthropy within an increasingly complex and interconnected global context.",

  speakersTitle: "Invited speakers",
  speakersNote:
    "Confirmed and invited figures listed in the conference term of reference.",

  datesTitle: "Key dates",
  orgTitle: "Organizers & supporters",
  orgLabel: "Organizers",
  supLabel: "Event supporters",

  confTitle: "A three-day international forum on zakat and philanthropy",
  partTitle: "Participants",
  partIntro:
    "The conference aims to invite 300 participants from both domestic and international backgrounds, including:",
  eventsTitle: "Conference events",
  eventsIntro: "The conference will feature various sub-events, including:",
  regTitle: "Event registration",
  regText: "Registration is handled through the official conference form.",
  regCta: "Open registration form",

  cfpTitle: "Call for Paper: scientific journal presentation",
  cfpIntro:
    "Papers are invited across ten sub-themes. Accepted and selected papers will be presented during the conference and considered for publication.",
  cfpCta1: "Paper submission",
  cfpCta2: "Download paper template",
  subthemesTitle: "Sub-themes",
  timelineTitle: "Timeline",
  pubTitle: "Publication opportunity",
  pubIntro:
    "Accepted and selected papers will have the opportunity to be published in the following journals:",

  subTitle: "Submission",
  loginTitle: "Submission login",
  loginText:
    "Submissions and reviews are managed on the ICONZ proceedings site.",
  loginCta: "Go to submission site",
  guideTitle: "Author guidelines",
  guideText: "Prepare your manuscript using the official ICONZ paper template.",
  guideCta: "Open template",

  prevTitle: "Previous ICONZ",
  prevIntro:
    "Documentation and recordings from the first nine editions of the International Conference on Zakat.",
  noArchive: "No archive available",

  procTitle: "Conference Proceedings",
  procText:
    "Proceedings of the International Conference on Zakat are published and archived on the ICONZ proceedings site.",
  procCta: "Browse proceedings archive",

  footOrg:
    "Organized by BAZNAS RI, IPB University and the Ministry of Religious Affairs",
} as const;

export type Dict = { [K in keyof typeof en]: string };

const id: Dict = {
  navHome: "Beranda",
  navConference: "Konferensi",
  navCfp: "Call for Paper",
  navSubmission: "Submisi",
  navPrevious: "ICONZ Sebelumnya",
  navProceedings: "Prosiding",
  register: "Daftar",
  langSwitch: "EN",
  menu: "Menu",
  closeMenu: "Tutup menu",
  toTop: "Kembali ke atas",

  heroBadge: "Bogor, Indonesia · 2026",
  heroCta1: "Daftar sekarang",
  heroCta2: "Kirim makalah",
  heroSoundOn: "Nyalakan suara video",
  heroSoundOff: "Matikan suara video",
  heroComingSoon: "Segera hadir",
  dateLabel: "Tanggal & Tempat",
  dateOnly: "Tanggal",
  venueLabel: "Tempat",
  calendarCta: "Tambah ke Google Calendar",
  mapCta: "Buka di Google Maps",
  themeLabel: "Tema",
  countdownLabel: "Hitung mundur menuju hari pertama",
  cdD: "Hari",
  cdH: "Jam",
  cdM: "Menit",
  cdS: "Detik",

  factParticipants: "Target peserta",
  factSubevents: "Sub-acara",
  factDays: "Hari konferensi",
  factJournals: "Peluang publikasi",

  bgTitle: "Latar Belakang",
  bgIntro:
    "Mengapa penyelenggaraan kesepuluh beralih dari capaian zakat di dalam negeri menuju capaian yang dibangun bersama.",
  bgKey1: "Capaian di tingkat lokal",
  bgKey2: "Tantangan yang mengglobal",
  bgKey3: "Mengapa tema ini",
  bgKey4: "Menuju kolaborasi",
  imageZoom: "Perbesar gambar",
  imageClose: "Tutup gambar",
  videoClose: "Tutup video",
  registerClose: "Tutup formulir pendaftaran",
  registerNewTab: "Buka di tab baru",
  splashSkip: "Lewati",
  loading: "Memuat",
  speakerProfile: "Lihat profil",
  profileEducation: "Pendidikan",
  profileWork: "Pengalaman kerja",
  profileEntrepreneur: "Pengalaman entrepreneur",
  profileCommunity: "Dedikasi pemberdayaan masyarakat",
  profilePolitics: "Dedikasi politik & kebijakan nasional",
  profileDakwah: "Dedikasi dakwah",
  profileSchooling: "Dedikasi pendidikan",
  bg1: "Perkembangan pengelolaan zakat dan filantropi selama dua dekade terakhir menunjukkan kemajuan signifikan di tingkat lokal. Banyak negara, termasuk Indonesia, berhasil membangun sistem penghimpunan dan penyaluran zakat yang lebih terstruktur, transparan, dan berdampak langsung bagi masyarakat. Berbagai program pemberdayaan ekonomi, pendidikan, dan layanan sosial berbasis zakat telah menghasilkan capaian nyata dalam meningkatkan pendapatan mustahik dan memperkuat ketahanan sosial di tingkat komunitas.",
  bg2: "Namun, dampak tersebut masih didominasi pendekatan lokal dan nasional, sementara tantangan yang dihadapi umat manusia semakin bersifat global. Kemiskinan transnasional, krisis kemanusiaan, konflik, bencana, dan dampak perubahan iklim tidak dapat diselesaikan sendiri oleh masing-masing negara. Dalam konteks ini, zakat dan filantropi memiliki potensi besar sebagai instrumen solidaritas global yang mampu menjembatani kesenjangan dan merespons persoalan kemanusiaan secara kolektif.",
  bg3: "Tema “From Local Impact to Global Solidarity: The Future of Zakat and Philanthropy” dipilih untuk menegaskan perlunya transformasi peran zakat dan filantropi dari instrumen berdampak lokal menjadi kekuatan kolaboratif berskala global. Transformasi ini menuntut integrasi inovasi pengelolaan, tata kelola yang kuat, dan penyelarasan nilai kemanusiaan antarnegara. Tanpa kerangka solidaritas global, dampak zakat dan filantropi akan tetap terfragmentasi dan belum optimal dalam menjawab tantangan bersama.",
  bg4: "Tema ini juga mencerminkan kebutuhan mendesak untuk memperkuat kolaborasi antara lembaga zakat, organisasi filantropi, pemerintah, akademisi, dan sektor swasta di tingkat internasional. Melalui kerja sama yang terstruktur, zakat dan filantropi dapat berkontribusi pada pembangunan manusia, pengurangan ketimpangan, dan terciptanya kesejahteraan bersama yang lebih berkelanjutan. Pada akhirnya, masa depan zakat dan filantropi tidak hanya ditentukan oleh keberhasilan lokal, tetapi oleh kapasitasnya membangun solidaritas global yang berakar pada nilai keadilan dan kemanusiaan.",

  objTitle: "Tujuan ICONZ ke-10",
  objIntro:
    "Dirumuskan untuk menjawab kebutuhan penguatan peran zakat dan filantropi dalam konteks global yang semakin kompleks dan saling terhubung.",

  speakersTitle: "Pembicara yang diundang",
  speakersNote: "Tokoh yang tercantum dalam kerangka acuan konferensi.",

  datesTitle: "Tanggal penting",
  orgTitle: "Penyelenggara & pendukung",
  orgLabel: "Penyelenggara",
  supLabel: "Pendukung acara",

  confTitle: "Forum internasional tiga hari tentang zakat dan filantropi",
  partTitle: "Peserta",
  partIntro:
    "Konferensi ini menargetkan 300 peserta dari dalam dan luar negeri, meliputi:",
  eventsTitle: "Rangkaian acara",
  eventsIntro: "Konferensi akan menghadirkan berbagai sub-acara, meliputi:",
  regTitle: "Pendaftaran acara",
  regText: "Pendaftaran dilakukan melalui formulir resmi konferensi.",
  regCta: "Buka formulir pendaftaran",

  cfpTitle: "Call for Paper: presentasi jurnal ilmiah",
  cfpIntro:
    "Makalah diundang untuk sepuluh sub-tema. Makalah yang diterima dan terpilih akan dipresentasikan pada konferensi serta dipertimbangkan untuk publikasi.",
  cfpCta1: "Pengiriman makalah",
  cfpCta2: "Unduh templat makalah",
  subthemesTitle: "Sub-tema",
  timelineTitle: "Jadwal",
  pubTitle: "Peluang publikasi",
  pubIntro:
    "Makalah yang diterima dan terpilih akan memiliki kesempatan untuk dipublikasikan di jurnal-jurnal berikut:",

  subTitle: "Submisi",
  loginTitle: "Login submisi",
  loginText:
    "Pengiriman dan penelaahan makalah dikelola di situs prosiding ICONZ.",
  loginCta: "Buka situs submisi",
  guideTitle: "Panduan penulis",
  guideText: "Susun naskah Anda menggunakan templat makalah resmi ICONZ.",
  guideCta: "Buka templat",

  prevTitle: "ICONZ Sebelumnya",
  prevIntro:
    "Dokumentasi dan rekaman sembilan penyelenggaraan International Conference on Zakat sebelumnya.",
  noArchive: "Tidak ada arsip",

  procTitle: "Prosiding Konferensi",
  procText:
    "Prosiding International Conference on Zakat diterbitkan dan diarsipkan di situs prosiding ICONZ.",
  procCta: "Lihat arsip prosiding",

  footOrg:
    "Diselenggarakan oleh BAZNAS RI, IPB University dan Kementerian Agama",
};

export const dictionaries: Record<Lang, Dict> = { en, id };

export function getDictionary(lang: Lang): Dict {
  return dictionaries[lang];
}

export function isLang(value: string): value is Lang {
  return (LANGS as string[]).includes(value);
}

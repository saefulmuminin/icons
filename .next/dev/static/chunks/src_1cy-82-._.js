(globalThis["TURBOPACK"] || (globalThis["TURBOPACK"] = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/src/app/[lang]/error.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>RouteError
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$i18n$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/i18n.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$nav$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/nav.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$use$2d$route$2d$lang$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/use-route-lang.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
;
function RouteError(param) {
    let { error, retry } = param;
    _s();
    const lang = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$use$2d$route$2d$lang$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouteLang"])();
    const t = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$i18n$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getDictionary"])(lang);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "RouteError.useEffect": ()=>{
            // The browser console is the only reporter this site has; the digest below
            // is what ties this to the server log for the same failure.
            console.error(error);
        }
    }["RouteError.useEffect"], [
        error
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Container"], {
        className: "flex min-h-[60vh] flex-col items-center justify-center py-24 text-center sm:py-32",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Eyebrow"], {
                children: t.errorCode
            }, void 0, false, {
                fileName: "[project]/src/app/[lang]/error.tsx",
                lineNumber: 35,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PageTitle"], {
                className: "max-w-2xl text-ink",
                children: t.errorTitle
            }, void 0, false, {
                fileName: "[project]/src/app/[lang]/error.tsx",
                lineNumber: 36,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "mt-5 max-w-xl font-sans text-[0.9375rem] leading-relaxed text-body",
                children: t.errorText
            }, void 0, false, {
                fileName: "[project]/src/app/[lang]/error.tsx",
                lineNumber: 38,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "mt-9 flex flex-wrap justify-center gap-3",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        type: "button",
                        onClick: ()=>retry(),
                        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ctaClasses"])({
                            size: "lg"
                        }),
                        children: t.errorRetry
                    }, void 0, false, {
                        fileName: "[project]/src/app/[lang]/error.tsx",
                        lineNumber: 43,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Cta"], {
                        href: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$nav$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["localizedHref"])(lang, ""),
                        variant: "outline",
                        size: "lg",
                        children: t.errorHome
                    }, void 0, false, {
                        fileName: "[project]/src/app/[lang]/error.tsx",
                        lineNumber: 51,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/[lang]/error.tsx",
                lineNumber: 42,
                columnNumber: 7
            }, this),
            error.digest ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "mt-12 font-sans text-xs tracking-wide text-faint",
                children: [
                    t.errorRef,
                    " ",
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "font-mono",
                        children: error.digest
                    }, void 0, false, {
                        fileName: "[project]/src/app/[lang]/error.tsx",
                        lineNumber: 60,
                        columnNumber: 24
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/[lang]/error.tsx",
                lineNumber: 59,
                columnNumber: 9
            }, this) : null
        ]
    }, void 0, true, {
        fileName: "[project]/src/app/[lang]/error.tsx",
        lineNumber: 34,
        columnNumber: 5
    }, this);
}
_s(RouteError, "vG6Z0nzqWnSGiEcaInLLmGyOVoI=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$use$2d$route$2d$lang$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouteLang"]
    ];
});
_c = RouteError;
var _c;
__turbopack_context__.k.register(_c, "RouteError");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/lib/i18n.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "LANGS",
    ()=>LANGS,
    "dictionaries",
    ()=>dictionaries,
    "getDictionary",
    ()=>getDictionary,
    "isLang",
    ()=>isLang
]);
const LANGS = [
    "en",
    "id"
];
const en = {
    navHome: "Home",
    navConference: "Conference",
    navSubmission: "Paper Submission",
    navPrevious: "Previous ICONZ",
    navProceedings: "Proceedings",
    register: "Register",
    langSwitch: "ID",
    langSwitchTo: "Switch to Indonesian",
    menu: "Menu",
    closeMenu: "Close menu",
    toTop: "Back to top",
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
    countdownLabel: "Counting Down to ICONZ 10",
    cdD: "Days",
    cdH: "Hours",
    cdM: "Min",
    cdS: "Sec",
    factParticipants: "Participants targeted",
    factSubevents: "Sub-events",
    factDays: "Conference days",
    factJournals: "Publication outlets",
    bgTitle: "Background",
    bgIntro: "Why the tenth edition turns from what zakat has achieved at home to what it could achieve together.",
    bgKey1: "Local progress",
    bgKey2: "A global challenge",
    bgKey3: "Why this theme",
    bgKey4: "Toward collaboration",
    imageZoom: "Enlarge the picture",
    imageClose: "Close the picture",
    videoClose: "Close the video",
    registerClose: "Close the registration form",
    splashSkip: "Skip",
    loading: "Loading",
    notFoundCode: "Error 404",
    notFoundTitle: "This page could not be found",
    notFoundText: "The address may have been mistyped, or the page has moved since it was linked. Everything the site holds is one of the links below.",
    notFoundHome: "Back to home",
    notFoundElse: "Or go straight to",
    errorCode: "Something went wrong",
    errorTitle: "This page could not be loaded",
    errorText: "Something gave way on our side rather than yours. Trying again usually clears it; if it does not, the home page is a safe place to land.",
    errorRetry: "Try again",
    errorHome: "Back to home",
    errorRef: "Reference",
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
    jumpLabel: "On this page",
    jumpBackground: "Background",
    jumpObjectives: "Objectives",
    jumpSpeakers: "Invited Speakers",
    jumpDates: "Key Dates",
    jumpOrganizers: "Organizers & Supporters",
    objTitle: "Objectives of the 10th ICONZ",
    objLabel: "Objective",
    objOf: "of",
    objPrev: "Previous objective",
    objNext: "Next objective",
    objIntro: "Formulated to address the need to strengthen the role of zakat and philanthropy within an increasingly complex and interconnected global context.",
    speakersTitle: "Invited speakers",
    speakersNote: "Figures listed in the conference term of reference.",
    datesTitle: "Key dates",
    orgTitle: "Organizers & supporters",
    orgLabel: "Organizers",
    supLabel: "Event supporters",
    confTitle: "A three-day international forum on zakat and philanthropy",
    partTitle: "Participants",
    partIntro: "The conference aims to invite 300 participants from both domestic and international backgrounds, including:",
    eventsTitle: "Conference events",
    eventsIntro: "The conference will feature various sub-events, including:",
    regTitle: "Event registration",
    regText: "Fill in the form below and your place at the conference is booked. It takes about two minutes.",
    regCta: "Open registration form",
    regFormTitle: "Registration form",
    regFormNote: "Every question is required.",
    regEmail: "Email",
    regPrefix: "Prefix",
    regFullName: "Full name",
    regSex: "Sex",
    regWhatsapp: "WhatsApp number",
    regWhatsappHelp: "With your country code, so the committee can reach you.",
    regInstitution: "Name of institution",
    regContinent: "Origin/residency",
    regCountry: "Country of origin/residency",
    regProvince: "Province of origin/residency",
    regCity: "Current city of residency",
    regProfession: "Profession",
    regProfessionOther: "Please say which",
    regPaper: "Did you submit to the Call for Papers or the International Book Chapter?",
    regDays: "Which days of the international seminar will you attend?",
    regDaysHelp: "Choose one or both.",
    regChoose: "Choose one",
    regContinentFirst: "Choose a continent first",
    regSubmit: "Send registration",
    regSubmitting: "Sending…",
    regDoneTitle: "Registration received",
    regDoneText: "Thank you for registering. The committee will write to the address you gave with the details you need before the conference.",
    regDoneAgain: "Register someone else",
    regErrRequired: "This one is needed.",
    regErrEmail: "That does not look like an email address.",
    regErrWhatsapp: "Write a number the committee can reach, country code and all.",
    regErrLong: "That is longer than the form takes.",
    regErrForm: "A few answers still need attention.",
    regErrSend: "The registration could not be sent. Please try once more.",
    regContact: "Contact person",
    galleryPrev: "Previous picture",
    galleryNext: "Next picture",
    galleryGo: "Show picture",
    submitTitle: "Submit to the 10th ICONZ",
    submitIntro: "Two ways to take part: submit a paper for the conference proceedings or a chapter for the international edited book. Both deadlines are in November 2026.",
    pickPapers: "Call for Papers",
    pickPapersNote: "Present a paper at the conference and publish it in IJAZ, selected journals, or proceedings.",
    pickBook: "Call for International Book Chapter",
    pickBookNote: "Contribute a chapter to an edited volume on zakat and well-being.",
    bookTitle: "Call for International Book Chapter",
    bookLead: "Are you exploring the role of zakat in improving human well-being? We invite scholars, researchers, practitioners, policymakers and students to contribute a book chapter for the 10th International Conference on Zakat.",
    bookBody: "This edited volume aims to advance discussions on how zakat can promote holistic well-being through economic resilience, social inclusion, human development and spiritual prosperity. We welcome innovative ideas, empirical research and policy perspectives that strengthen the role of zakat in creating sustainable well-being.",
    bookThemeLabel: "Theme",
    bookEditorsLabel: "Book editors",
    bookDatesLabel: "Important dates",
    bookFree: "Submission is free of charge",
    bookCta1: "Submit a chapter",
    bookCta2: "Author guidelines",
    bookCta3: "Download template",
    bookPublishers: "Selected chapters will be considered for publication in an edited book from a reputable international publisher:",
    cfpTitle: "Call for Paper: scientific journal presentation",
    cfpIntro: "Papers are invited across ten sub-themes. Accepted and selected papers will be presented during the conference and considered for publication.",
    cfpCta1: "Paper submission",
    cfpCta2: "Download paper template",
    cfpFree: "Submission is free of charge",
    subthemesTitle: "Sub-themes",
    timelineTitle: "Timeline",
    pubTitle: "Publication opportunity",
    pubIntro: "Accepted and selected papers will have the opportunity to be published in the following journals:",
    prevTitle: "Previous ICONZ",
    prevIntro: "Documentation and recordings from the first nine editions of the International Conference on Zakat.",
    noArchive: "No archive available",
    archiveFilms: "recordings",
    archivePosters: "posters",
    procTitle: "Conference Proceedings",
    procText: "Proceedings of the International Conference on Zakat are published and archived on the ICONZ proceedings site.",
    procCta: "Browse proceedings archive",
    procOpen: "View proceedings",
    procSoon: "Not yet linked",
    footOrg: "10th ICONZ Organized by BAZNAS RI, IPB University and the Ministry of Religious Affairs"
};
const id = {
    navHome: "Beranda",
    navConference: "Konferensi",
    navSubmission: "Paper Submission",
    navPrevious: "ICONZ Sebelumnya",
    navProceedings: "Prosiding",
    register: "Daftar",
    langSwitch: "EN",
    langSwitchTo: "Ganti ke bahasa Inggris",
    menu: "Menu",
    closeMenu: "Tutup menu",
    toTop: "Kembali ke atas",
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
    countdownLabel: "Hitung mundur menuju ICONZ 10",
    cdD: "Hari",
    cdH: "Jam",
    cdM: "Menit",
    cdS: "Detik",
    factParticipants: "Target peserta",
    factSubevents: "Sub-acara",
    factDays: "Hari konferensi",
    factJournals: "Peluang publikasi",
    bgTitle: "Latar Belakang",
    bgIntro: "Mengapa penyelenggaraan kesepuluh beralih dari capaian zakat di dalam negeri menuju capaian yang dibangun bersama.",
    bgKey1: "Capaian di tingkat lokal",
    bgKey2: "Tantangan yang mengglobal",
    bgKey3: "Mengapa tema ini",
    bgKey4: "Menuju kolaborasi",
    imageZoom: "Perbesar gambar",
    imageClose: "Tutup gambar",
    videoClose: "Tutup video",
    registerClose: "Tutup formulir pendaftaran",
    splashSkip: "Lewati",
    loading: "Memuat",
    notFoundCode: "Eror 404",
    notFoundTitle: "Halaman ini tidak ditemukan",
    notFoundText: "Alamatnya mungkin salah ketik, atau halamannya sudah dipindahkan sejak ditautkan. Seluruh isi situs ada di tautan-tautan di bawah ini.",
    notFoundHome: "Kembali ke beranda",
    notFoundElse: "Atau langsung ke",
    errorCode: "Terjadi kesalahan",
    errorTitle: "Halaman ini gagal dimuat",
    errorText: "Ada yang bermasalah di sisi kami, bukan di sisi Anda. Biasanya cukup dicoba lagi; kalau masih sama, beranda adalah tempat yang aman untuk kembali.",
    errorRetry: "Coba lagi",
    errorHome: "Kembali ke beranda",
    errorRef: "Kode rujukan",
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
    jumpLabel: "Di halaman ini",
    jumpBackground: "Latar Belakang",
    jumpObjectives: "Tujuan",
    jumpSpeakers: "Pembicara Undangan",
    jumpDates: "Tanggal Penting",
    jumpOrganizers: "Penyelenggara & Pendukung",
    objTitle: "Tujuan ICONZ ke-10",
    objLabel: "Tujuan",
    objOf: "dari",
    objPrev: "Tujuan sebelumnya",
    objNext: "Tujuan berikutnya",
    objIntro: "Dirumuskan untuk menjawab kebutuhan penguatan peran zakat dan filantropi dalam konteks global yang semakin kompleks dan saling terhubung.",
    speakersTitle: "Pembicara yang diundang",
    speakersNote: "Tokoh yang tercantum dalam kerangka acuan konferensi.",
    datesTitle: "Tanggal penting",
    orgTitle: "Penyelenggara & pendukung",
    orgLabel: "Penyelenggara",
    supLabel: "Pendukung acara",
    confTitle: "Forum internasional tiga hari tentang zakat dan filantropi",
    partTitle: "Peserta",
    partIntro: "Konferensi ini menargetkan 300 peserta dari dalam dan luar negeri, meliputi:",
    eventsTitle: "Rangkaian acara",
    eventsIntro: "Konferensi akan menghadirkan berbagai sub-acara, meliputi:",
    regTitle: "Pendaftaran acara",
    regText: "Isi formulir di bawah ini dan tempat Anda di konferensi langsung tercatat. Kira-kira dua menit saja.",
    regCta: "Buka formulir pendaftaran",
    regFormTitle: "Formulir pendaftaran",
    regFormNote: "Semua pertanyaan wajib diisi.",
    regEmail: "Email",
    regPrefix: "Sapaan",
    regFullName: "Nama lengkap",
    regSex: "Jenis kelamin",
    regWhatsapp: "Nomor WhatsApp",
    regWhatsappHelp: "Sertakan kode negara agar panitia dapat menghubungi Anda.",
    regInstitution: "Nama institusi",
    regContinent: "Asal benua",
    regCountry: "Asal negara",
    regProvince: "Asal provinsi",
    regCity: "Kota/kabupaten domisili saat ini",
    regProfession: "Profesi/pekerjaan",
    regProfessionOther: "Mohon sebutkan",
    regPaper: "Apakah Anda mengirimkan naskah pada Call for Papers atau International Book Chapter?",
    regDays: "Hari seminar internasional mana yang akan Anda hadiri?",
    regDaysHelp: "Pilih salah satu atau keduanya.",
    regChoose: "Pilih salah satu",
    regContinentFirst: "Pilih benua dulu",
    regSubmit: "Kirim pendaftaran",
    regSubmitting: "Mengirim…",
    regDoneTitle: "Pendaftaran diterima",
    regDoneText: "Terima kasih telah mendaftar. Panitia akan mengirim keterangan yang Anda perlukan menjelang konferensi ke alamat email tersebut.",
    regDoneAgain: "Daftarkan orang lain",
    regErrRequired: "Bagian ini wajib diisi.",
    regErrEmail: "Sepertinya ini bukan alamat email.",
    regErrWhatsapp: "Tulis nomor yang bisa dihubungi, lengkap dengan kode negara.",
    regErrLong: "Isian ini melebihi batas panjang formulir.",
    regErrForm: "Masih ada beberapa jawaban yang perlu diperiksa.",
    regErrSend: "Pendaftaran belum dapat dikirim. Silakan coba sekali lagi.",
    regContact: "Narahubung",
    galleryPrev: "Gambar sebelumnya",
    galleryNext: "Gambar berikutnya",
    galleryGo: "Tampilkan gambar",
    submitTitle: "Kirim karya ke ICONZ ke-10",
    submitIntro: "Dua jalur untuk ikut serta: makalah untuk prosiding konferensi, atau bab untuk buku suntingan internasional. Keduanya ditutup November 2026.",
    pickPapers: "Call for Papers",
    pickPapersNote: "Presentasikan makalah di konferensi dan terbitkan di IJAZ, jurnal terpilih, atau prosiding.",
    pickBook: "Call for International Book Chapter",
    pickBookNote: "Sumbangkan satu bab untuk buku suntingan bertema zakat dan kesejahteraan.",
    bookTitle: "Call for International Book Chapter",
    bookLead: "Sedang menelaah peran zakat dalam meningkatkan kesejahteraan manusia? Kami mengundang akademisi, peneliti, praktisi, pengambil kebijakan dan mahasiswa untuk menyumbang satu bab buku bagi International Conference on Zakat ke-10.",
    bookBody: "Buku suntingan ini bertujuan memperluas pembahasan tentang bagaimana zakat mendorong kesejahteraan yang menyeluruh melalui ketahanan ekonomi, inklusi sosial, pembangunan manusia dan kemakmuran spiritual. Kami menerima gagasan baru, riset empiris dan perspektif kebijakan yang memperkuat peran zakat dalam menciptakan kesejahteraan berkelanjutan.",
    bookThemeLabel: "Tema",
    bookEditorsLabel: "Editor buku",
    bookDatesLabel: "Tanggal penting",
    bookFree: "Pengiriman tidak dipungut biaya",
    bookCta1: "Kirim bab",
    bookCta2: "Panduan penulis",
    bookCta3: "Unduh templat",
    bookPublishers: "Bab terpilih akan dipertimbangkan untuk terbit dalam buku suntingan oleh penerbit internasional bereputasi:",
    cfpTitle: "Call for Paper: presentasi jurnal ilmiah",
    cfpIntro: "Makalah diundang untuk sepuluh sub-tema. Makalah yang diterima dan terpilih akan dipresentasikan pada konferensi serta dipertimbangkan untuk publikasi.",
    cfpCta1: "Pengiriman makalah",
    cfpCta2: "Unduh templat makalah",
    cfpFree: "Pengiriman tidak dipungut biaya",
    subthemesTitle: "Sub-tema",
    timelineTitle: "Jadwal",
    pubTitle: "Peluang publikasi",
    pubIntro: "Makalah yang diterima dan terpilih akan memiliki kesempatan untuk dipublikasikan di jurnal-jurnal berikut:",
    prevTitle: "ICONZ Sebelumnya",
    prevIntro: "Dokumentasi dan rekaman sembilan penyelenggaraan International Conference on Zakat sebelumnya.",
    noArchive: "Tidak ada arsip",
    archiveFilms: "rekaman",
    archivePosters: "poster",
    procTitle: "Prosiding Konferensi",
    procText: "Prosiding International Conference on Zakat diterbitkan dan diarsipkan di situs prosiding ICONZ.",
    procCta: "Lihat arsip prosiding",
    procOpen: "Lihat prosiding",
    procSoon: "Belum ditautkan",
    footOrg: "10th ICONZ Organized by BAZNAS RI, IPB University and the Ministry of Religious Affairs"
};
const dictionaries = {
    en,
    id
};
function getDictionary(lang) {
    return dictionaries[lang];
}
function isLang(value) {
    return LANGS.includes(value);
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/lib/use-route-lang.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useRouteLang",
    ()=>useRouteLang
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$i18n$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/i18n.ts [app-client] (ecmascript)");
var _s = __turbopack_context__.k.signature();
"use client";
;
;
function useRouteLang() {
    _s();
    const first = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePathname"])().split("/")[1] ?? "";
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$i18n$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isLang"])(first) ? first : "en";
}
_s(useRouteLang, "wVXOWZKWdId76kQQO0KX6Oz3JDA=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePathname"]
    ];
});
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=src_1cy-82-._.js.map
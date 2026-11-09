/**
 * Dataset Projek Portofolio - ALDI
 * Berisi data asli projek yang dikerjakan beserta galeri screenshot.
 */
export const projectsData = {
    'catara': {
        slug: 'catara',
        title: 'CATARA: Computer Assisted Test Polri & ASN',
        category: 'Aplikasi Web & Ujian Online',
        badge: 'Sistem Unggulan',
        period: '2024 - 2025',
        role: 'Lead Fullstack Developer',
        status: 'Production Ready',
        summary: 'Platform simulasi ujian interaktif Computer-Assisted Test (CAT) untuk persiapan seleksi Casis Polri (Akpol, Bintara, Tamtama). Dilengkapi bank soal terstruktur, timer otomatis, kalkulasi skor akurat, modul kolom kecermatan, dan perankingan nasional secara langsung.',
        thumbnail: 'assets/images/projects/catara/thumbnail.webp',
        tech_stack: ['Laravel 12', 'Tailwind CSS', 'Alpine.js', 'MySQL', 'Redis', 'Chart.js'],
        highlights: [
            'Sistem ujian berbasis batas waktu dan acak soal otomatis',
            'Modul latihan spesifik: TPA, Kecerdasan, Kepribadian, dan Tes Kecermatan',
            'Dashboard analitik perkembangan nilai dan histori skor peserta',
            'Panel admin untuk manajemen ribuan bank soal dan export laporan'
        ],
        screenshots: [
            { url: 'assets/images/projects/catara/1.webp', title: 'Dashboard Utama & Simulasi CAT', description: 'Tampilan beranda dan ringkasan fitur utama platform simulasi ujian seleksi Polri.' },
            { url: 'assets/images/projects/catara/2.webp', title: 'Bank Soal & Pengaturan Ujian', description: 'Visualisasi modul materi latihan, bank soal, dan evaluasi capaian belajar casis.' },
            { url: 'assets/images/projects/catara/3.webp', title: 'Tampilan Lembar Ujian Tryout', description: 'Akses pengerjaan simulasi ujian yang nyaman langsung dari smartphone atau desktop.' },
            { url: 'assets/images/projects/catara/4.webp', title: 'Perhitungan Skor & Peringkat Nasional', description: 'Evaluasi nilai yang langsung keluar saat ujian berakhir dengan ranking nasional.' },
            { url: 'assets/images/projects/catara/5.webp', title: 'Modul Tes Kolom Kecermatan', description: 'Modul pengujian kecepatan dan ketelitian dengan batas waktu per kolom angka.' },
            { url: 'assets/images/projects/catara/6.webp', title: 'Dashboard Evaluasi Casis', description: 'Statistik kekuatan dan kelemahan materi belajar casis secara visual.' },
            { url: 'assets/images/projects/catara/7.webp', title: 'Analisis Statistik & Riwayat Ujian', description: 'Histori capaian nilai dari setiap sesi simulasi tryout yang telah dikerjakan.' },
            { url: 'assets/images/projects/catara/8.webp', title: 'Panel Manajemen Soal Admin', description: 'Pengelolaan bank soal, kunci jawaban, dan pembahasan materi ujian terpadu.' },
            { url: 'assets/images/projects/catara/9.webp', title: 'Laporan Hasil Ujian & Rekapitulasi', description: 'Rekapitulasi nilai peserta dalam format siap ekspor untuk evaluasi pembina.' }
        ],
        github_url: 'https://github.com',
        live_url: '#'
    },
    'balihfilm': {
        slug: 'balihfilm',
        title: 'BalihFilm: Platform Tiket Bioskop Online & E-Tiket',
        category: 'E-Commerce & Entertainment Booking',
        badge: 'Sistem Bioskop',
        period: '2025 - 2026',
        role: 'Fullstack Developer',
        status: 'Aktif Digunakan',
        summary: 'Platform pemesanan tiket bioskop daring modern. Pengguna dapat memilih jadwal film, menentukan kursi studio secara visual dan interaktif, memesan paket makanan dan minuman, serta menerima e-tiket dengan barcode otomatis untuk verifikasi di tempat.',
        thumbnail: 'assets/images/projects/balihfilm/thumbnail.webp',
        tech_stack: ['Laravel', 'Tailwind CSS', 'Alpine.js', 'MySQL', 'QR/Barcode Engine'],
        highlights: [
            'Pemilihan kursi studio visual secara interaktif real-time',
            'Katalog film tayang dan segera tayang dengan trailer info',
            'Sistem pemesanan makanan dan snack bioskop terintegrasi',
            'Penerbitan e-tiket otomatis dengan verifikasi barcode'
        ],
        screenshots: [
            { url: 'assets/images/projects/balihfilm/1.webp', title: 'Beranda Utama & Film Sedang Tayang', description: 'Tampilan beranda balihfilm dengan sorotan film unggulan dan promo terkini.' },
            { url: 'assets/images/projects/balihfilm/2.webp', title: 'Daftar Film Tayang & Jadwal Bioskop', description: 'Katalog film yang sedang diputar beserta info rating usia dan durasi.' },
            { url: 'assets/images/projects/balihfilm/3.png', title: 'Detail Film & Sinopsis Lengkap', description: 'Informasi sinopsis, sutradara, deretan aktor, dan trailer resmi film.' },
            { url: 'assets/images/projects/balihfilm/4.png', title: 'Pemilihan Jadwal & Jam Tayang Studio', description: 'Pilihan studio, tipe layar (Reguler / Deluxe), dan waktu penayangan.' },
            { url: 'assets/images/projects/balihfilm/5.webp', title: 'Denah Kursi Studio Interaktif', description: 'Visualisasi tata letak bangku studio bioskop dengan penanda kursi terisi.' },
            { url: 'assets/images/projects/balihfilm/6.png', title: 'Pemilihan Kursi Studio Real-time', description: 'Pemilihan nomor kursi favorit secara langsung dengan kalkulasi total biaya.' },
            { url: 'assets/images/projects/balihfilm/7.webp', title: 'Pemesanan Makanan & Minuman Bioskop', description: 'Katalog popcorn, minuman segar, dan combo snack pendamping nonton.' },
            { url: 'assets/images/projects/balihfilm/8.png', title: 'Ringkasan Pembayaran & Konfirmasi', description: 'Rincian total belanja tiket dan pilihan metode pembayaran instan.' },
            { url: 'assets/images/projects/balihfilm/9.webp', title: 'E-Tiket dengan Barcode Verifikasi', description: 'Tiket digital siap scan saat memasuki pintu studio bioskop.' },
            { url: 'assets/images/projects/balihfilm/10.webp', title: 'Cek Status & Cari Pesanan Tiket', description: 'Fitur pencarian kode booking untuk melihat status tiket yang telah dibeli.' },
            { url: 'assets/images/projects/balihfilm/11.png', title: 'Detail Transaksi Pemesanan Tiket', description: 'Bukti transaksi lengkap dengan nomor studio dan kode barcode.' },
            { url: 'assets/images/projects/balihfilm/12.png', title: 'Panel Pengelolaan Bioskop & Studio', description: 'Manajemen jadwal tayang, penetapan harga tiket, dan kontrol studio.' }
        ],
        github_url: 'https://github.com',
        live_url: '#'
    },
    'aldigamestation': {
        slug: 'aldigamestation',
        title: 'AldiGameStation: Rental & Reservasi Playstation',
        category: 'Rental & Booking Management',
        badge: 'Rental System',
        period: '2025 - 2026',
        role: 'Fullstack Developer',
        status: 'Production Ready',
        summary: 'Platform reservasi dan persewaan unit konsol PlayStation 3, PlayStation 4, dan PlayStation 5 secara daring. Menyediakan katalog game lengkap, pemilihan unit rental, booking jadwal main di tempat, dan perhitungan tarif transparan.',
        thumbnail: 'assets/images/projects/aldigamestation/thumbnail.webp',
        tech_stack: ['Laravel', 'Tailwind CSS', 'Livewire', 'MySQL', 'JavaScript'],
        highlights: [
            'Katalog konsol PS3, PS4, PS5 beserta daftar game populer',
            'Sistem booking jadwal main di tempat atau rental bawa pulang',
            'Kalkulasi tarif sewa otomatis berdasarkan durasi waktu',
            'Pelacakan ketersediaan unit rental secara transparan'
        ],
        screenshots: [
            { url: 'assets/images/projects/aldigamestation/1.png', title: 'Beranda Utama Aldi Game Station', description: 'Halaman muka platform rental PlayStation dengan informasi paket main hemat.' },
            { url: 'assets/images/projects/aldigamestation/2.webp', title: 'Katalog Konsol PlayStation 3, 4, 5', description: 'Pilihan unit rental PS3, PS4, dan PS5 lengkap dengan spesifikasi aksesoris.' },
            { url: 'assets/images/projects/aldigamestation/3.png', title: 'Daftar Koleksi Game Terlengkap', description: 'Ratusan game terpopuler mulai dari genre sepak bola, action, hingga adventure.' },
            { url: 'assets/images/projects/aldigamestation/4.png', title: 'Formulir Booking & Reservasi Unit', description: 'Pengisian jadwal tanggal main, pemilihan durasi jam, dan metode pengambilan unit.' },
            { url: 'assets/images/projects/aldigamestation/5.png', title: 'Pelacakan Status Booking & Tarif Rental', description: 'Monitoring status ketersediaan unit dan transparansi rincian biaya sewa.' }
        ],
        github_url: 'https://github.com',
        live_url: '#'
    },
    'attendanceweb': {
        slug: 'attendanceweb',
        title: 'Attendance System: Presensi & Logbook Berbasis Web',
        category: 'Enterprise / HR Management',
        badge: 'Sistem Presensi',
        period: '2025 - 2026',
        role: 'Backend & Fullstack Developer',
        status: 'Operasional',
        summary: 'Sistem absensi digital dan pencatatan logbook kegiatan harian peserta magang atau karyawan. Dilengkapi verifikasi presensi, pelaporan aktivitas mandiri, rekap kehadiran bulanan, dan ekspor laporan terpadu untuk pembimbing.',
        thumbnail: 'assets/images/projects/attendanceweb/thumbnail.webp',
        tech_stack: ['Laravel', 'Bootstrap / Tailwind', 'MySQL', 'Excel / PDF Export'],
        highlights: [
            'Pencatatan absensi masuk dan pulang secara akurat',
            'Formulir logbook kegiatan harian dengan upload berkas bukti',
            'Rekapitulasi persentase kehadiran bulanan otomatis',
            'Panel verifikasi dan persetujuan tugas oleh pembimbing'
        ],
        screenshots: [
            { url: 'assets/images/projects/attendanceweb/1.png', title: 'Dashboard Presensi Magang & Karyawan', description: 'Ringkasan kehadiran hari ini, status check-in, dan grafik keaktifan kerja.' },
            { url: 'assets/images/projects/attendanceweb/2.png', title: 'Pencatatan Absensi Masuk & Pulang', description: 'Antarmuka presensi tepat waktu dengan timestamp terverifikasi sistem.' },
            { url: 'assets/images/projects/attendanceweb/3.png', title: 'Input Logbook Kegiatan Harian', description: 'Pencatatan uraian tugas yang dikerjakan beserta dokumentasi foto pendukung.' },
            { url: 'assets/images/projects/attendanceweb/4.png', title: 'Riwayat & Rekapitulasi Presensi Bulanan', description: 'Tabel riwayat kehadiran lengkap dengan keterangan hadir, izin, atau sakit.' },
            { url: 'assets/images/projects/attendanceweb/5.png', title: 'Persetujuan Logbook oleh Pembimbing', description: 'Panel kontrol bagi supervisor untuk meninjau dan memberi nilai laporan magang.' },
            { url: 'assets/images/projects/attendanceweb/6.png', title: 'Laporan Kehadiran & Rekap PDF', description: 'Fitur cetak laporan rekap presensi dan logbook siap tandatangan pimpinan.' }
        ],
        github_url: 'https://github.com',
        live_url: '#'
    },
    'ngopisamakamu': {
        slug: 'ngopisamakamu',
        title: 'NgopiSamaKamu: Website & Katalog Kafe Modern',
        category: 'Food & Beverage / Coffee Shop',
        badge: 'Coffee Catalog',
        period: '2025 - 2026',
        role: 'Frontend & Fullstack Developer',
        status: 'Live / Siap Pakai',
        summary: 'Website kafe estetik dengan katalog menu minuman kopi, makanan ringan, dan reservasi meja santai. Mengusung konsep visual hangat dan nyaman, dilengkapi daftar menu terperinci, informasi lokasi, dan pemesanan online.',
        thumbnail: 'assets/images/projects/ngopisamakamu/thumbnail.webp',
        tech_stack: ['Laravel', 'Tailwind CSS', 'Alpine.js', 'MySQL', 'Responsive UI'],
        highlights: [
            'Katalog menu kopi signature, manual brew, dan cemilan',
            'Informasi komposisi, catatan rasa (flavor notes), dan harga',
            'Pemesanan online dan reservasi meja santai kafe',
            'Desain visual hangat, estetik, dan nyaman di semua perangkat'
        ],
        screenshots: [
            { url: 'assets/images/projects/ngopisamakamu/1.webp', title: 'Beranda Hangat Ngopi Sama Kamu', description: 'Tampilan beranda yang mengundang dengan nuansa hangat dan ramah pengunjung.' },
            { url: 'assets/images/projects/ngopisamakamu/2.webp', title: 'Filosofi & Cerita Kedai Kopi', description: 'Kisah dibalik berdirinya kedai kopi dan komitmen biji kopi pilihan.' },
            { url: 'assets/images/projects/ngopisamakamu/3.webp', title: 'Katalog Menu Kopi Signature', description: 'Koleksi menu racikan kopi khas dengan varian rasa unik dan favorit.' },
            { url: 'assets/images/projects/ngopisamakamu/4.png', title: 'Menu Manual Brew & Minuman Non-Kopi', description: 'Pilihan single origin, pour over V60, artisan tea, dan cokelat murni.' },
            { url: 'assets/images/projects/ngopisamakamu/5.webp', title: 'Pilihan Makanan Ringan & Cemilan', description: 'Aneka kudapan lezat seperti croissant, toast, dan kentang goreng renyah.' },
            { url: 'assets/images/projects/ngopisamakamu/6.webp', title: 'Detail Menu & Catatan Rasa Kopi', description: 'Informasi profil acidity, body, dan aroma dari setiap sajian kopi.' },
            { url: 'assets/images/projects/ngopisamakamu/7.png', title: 'Reservasi Meja & Pemesanan Online', description: 'Fasilitas booking tempat untuk temu komunitas, nongkrong, atau kerja santai.' },
            { url: 'assets/images/projects/ngopisamakamu/8.png', title: 'Informasi Lokasi & Jam Operasional', description: 'Petunjuk peta kedai, akses parkir, dan jadwal buka setiap hari.' },
            { url: 'assets/images/projects/ngopisamakamu/9.png', title: 'Kontak & Media Sosial Kedai', description: 'Kanal komunikasi pelanggan untuk pemesanan katering atau event khusus.' }
        ],
        github_url: 'https://github.com',
        live_url: '#'
    },
    'pusaka': {
        slug: 'pusaka',
        title: 'Disdukcapil (PUSAKA): Pelayanan Kependudukan',
        category: 'Sistem Layanan Publik / E-Gov',
        badge: 'Pelayanan Publik',
        period: '2024 - 2025',
        role: 'Full Stack & Integration Specialist',
        status: 'Terverifikasi Instansi',
        summary: 'Sistem gateway integrasi administrasi kependudukan dan pencatatan sipil (PUSAKA) Disdukcapil Kabupaten Klungkung. Menghubungkan 61 desa dengan notifikasi WhatsApp gateway otomatis, manajemen mutasi kepindahan penduduk, verifikasi berkas SKPWNI, dan monitoring data terpadu.',
        thumbnail: 'assets/images/projects/pusaka/thumbnail.webp',
        tech_stack: ['Laravel', 'PostgreSQL', 'Tailwind CSS', 'REST API', 'Storage Engine'],
        highlights: [
            'Integrasi WhatsApp Gateway untuk notifikasi otomatis desa asal & desa tujuan',
            'Sistem pemantauan mutasi perpindahan penduduk antar 61 desa se-Kabupaten Klungkung',
            'Manajemen master data desa, kredensial staf, dan validasi berkas SKPWNI & KK',
            'Audit log pengiriman notifikasi dan pelacakan status kependudukan transparan'
        ],
        screenshots: [
            { url: 'assets/images/projects/pusaka/1.png', title: 'Portal Login & Autentikasi Petugas', description: 'Halaman autentikasi aman untuk petugas dinas dan operator desa dengan proteksi sesi.' },
            { url: 'assets/images/projects/pusaka/2.png', title: 'Konfirmasi Autentikasi Sistem', description: 'Umpan balik modal interaktif saat operator berhasil memverifikasi kredensial akun.' },
            { url: 'assets/images/projects/pusaka/3.png', title: 'Dashboard Utama & Statistik Gateway', description: 'Ringkasan operasional mencakup 61 desa terhubung, metrik kepindahan, dan status pesan WhatsApp.' },
            { url: 'assets/images/projects/pusaka/4.png', title: 'Manajemen Data Desa & Kontak Staf', description: 'Direktori master 61 desa lengkap dengan nomor WhatsApp dinas dan manajemen akses staf.' },
            { url: 'assets/images/projects/pusaka/5.png', title: 'Monitoring Perpindahan Penduduk', description: 'Tabel data mutasi kependudukan real-time dengan filter tanggal, pencarian NIK, dan nomor KK.' },
            { url: 'assets/images/projects/pusaka/6.webp', title: 'Log Gateway WhatsApp Otomatis', description: 'Riwayat pengiriman notifikasi instan ke desa terkait saat terjadi mutasi data warga.' },
            { url: 'assets/images/projects/pusaka/7.png', title: 'Formulir Registrasi Desa & Akun', description: 'Antarmuka pendaftaran entitas desa baru beserta konfigurasi kontak gateway resmi.' },
            { url: 'assets/images/projects/pusaka/8.png', title: 'Pencatatan Data Kepindahan Warga', description: 'Formulir input mutasi kependudukan dengan integrasi unggah berkas KK dan SKPWNI.' },
            { url: 'assets/images/projects/pusaka/9.png', title: 'Detail Kependudukan & Arsip Berkas', description: 'Tampilan komprehensif data mutasi warga, status validasi dokumen, dan opsi unduh arsip.' }
        ],
        github_url: 'https://github.com',
        live_url: '#'
    },
    'attendanceflutter': {
        slug: 'attendanceflutter',
        title: 'Smart Attendance Mobile: Presensi Versi Mobile',
        category: 'Aplikasi Mobile & Face Recognition',
        badge: 'Mobile App',
        period: '2025 - 2026',
        role: 'Mobile & Frontend Developer',
        status: 'Production Ready',
        summary: 'Aplikasi mobile presensi cerdas berbasis pengenalan wajah (Face Recognition) untuk siswa magang. Dilengkapi sensor kamera dengan verifikasi wajah real-time, kiosk scan presensi otomatis, formulir input presensi manual, serta pemantauan statistik kehadiran harian.',
        thumbnail: 'assets/images/projects/attendanceflutter/thumbnail.webp',
        tech_stack: ['Flutter', 'Dart', 'Face Recognition', 'REST API', 'Camera Engine'],
        highlights: [
            'Kiosk scan presensi wajah real-time dengan sensor verifikasi otomatis',
            'Dashboard statistik kehadiran siswa magang (hadir tepat waktu, terlambat, izin, sakit)',
            'Pengelolaan data siswa magang, status pendaftaran wajah, dan input presensi manual',
            'Riwayat presensi terpadu lengkap dengan filter tanggal dan status kehadiran'
        ],
        screenshots: [
            { url: 'assets/images/projects/attendanceflutter/1.jpeg', title: 'Dashboard Utama & Statistik Presensi', description: 'Ringkasan kehadiran harian siswa magang, tingkat kehadiran, dan aktivitas check-in terbaru.' },
            { url: 'assets/images/projects/attendanceflutter/2.jpeg', title: 'Riwayat Presensi & Filter Kehadiran', description: 'Daftar riwayat presensi masuk dan pulang dengan filter status tepat waktu, terlambat, izin, atau sakit.' },
            { url: 'assets/images/projects/attendanceflutter/3.jpeg', title: 'Data Siswa Magang & Status Wajah', description: 'Daftar nama siswa magang beserta status registrasi sensor wajah dan pencarian data terpadu.' },
            { url: 'assets/images/projects/attendanceflutter/4.jpeg', title: 'Kiosk Scan Presensi & Sensor Wajah', description: 'Antarmuka kamera kiosk dengan pendeteksi bingkai wajah otomatis untuk verifikasi kehadiran cepat.' },
            { url: 'assets/images/projects/attendanceflutter/5.jpeg', title: 'Formulir Input Presensi Manual', description: 'Modal penginputan presensi manual jika terjadi kendala teknis atau izin di luar kantor.' },
            { url: 'assets/images/projects/attendanceflutter/6.jpeg', title: 'Registrasi Siswa Magang Baru', description: 'Formulir penambahan data siswa magang lengkap dengan NIM, asal kampus, dan divisi kerja.' }
        ],
        github_url: 'https://github.com',
        live_url: '#'
    },
    'moneytracker': {
        slug: 'moneytracker',
        title: 'Money Tracker: Aplikasi Manajemen Keuangan Mahasiswa',
        category: 'Aplikasi Mobile & Personal Finance',
        badge: 'Fintech Mobile',
        period: '2025 - 2026',
        role: 'Mobile Developer',
        status: 'Production Ready',
        summary: 'Aplikasi manajemen keuangan pribadi yang dirancang khusus untuk kebutuhan mahasiswa. Membantu menjaga disiplin finansial dengan fitur kalkulasi batas aman belanja harian ("Aman Hari Ini"), alokasi target budget bulanan, pencatatan transaksi cepat, dan analisis visual breakdown pengeluaran.',
        thumbnail: 'assets/images/projects/moneytracker/thumbnail.webp',
        tech_stack: ['Flutter', 'Dart', 'Local Database', 'State Management', 'Chart Engine'],
        highlights: [
            'Pencatatan kilat transaksi pemasukan dan pengeluaran dengan kategori spesifik mahasiswa',
            'Kalkulasi otomatis batas belanja aman per hari ("Aman Hari Ini") agar tidak boros',
            'Target budget bulanan dengan visual progress bar sisa saldo dan persentase terpakai',
            'Statistik dan breakdown pengeluaran (kos, makan, nongkrong, kuliah & print, transport)'
        ],
        screenshots: [
            { url: 'assets/images/projects/moneytracker/1.jpeg', title: 'Beranda Utama & Indikator Saldo Aman', description: 'Tampilan sisa saldo bulanan, progress budget, batas belanja aman harian, dan mutasi terkini.' },
            { url: 'assets/images/projects/moneytracker/2.jpeg', title: 'Pencatatan Cepat Pemasukan', description: 'Modal input pemasukan dengan pilihan kategori kiriman ortu, freelance/part-time, atau beasiswa.' },
            { url: 'assets/images/projects/moneytracker/3.jpeg', title: 'Pencatatan Transaksi Pengeluaran', description: 'Input nominal pengeluaran cepat dengan preset tombol nominal dan kategori kebutuhan mahasiswa.' },
            { url: 'assets/images/projects/moneytracker/4.jpeg', title: 'Statistik & Breakdown Pengeluaran Bulanan', description: 'Grafik persentase alokasi pengeluaran per kategori untuk evaluasi kebiasaan belanja.' },
            { url: 'assets/images/projects/moneytracker/5.jpeg', title: 'Monitoring Target Budget Bulanan', description: 'Pemantauan batas pengeluaran maksimal per bulan dengan indikator warna peringatan.' },
            { url: 'assets/images/projects/moneytracker/6.jpeg', title: 'Rekapitulasi Sumber Pemasukan Mahasiswa', description: 'Distribusi sumber dana masuk mulai dari kiriman orang tua hingga pendapatan freelance.' }
        ],
        github_url: 'https://github.com',
        live_url: '#'
    },
    'antreandigital': {
        slug: 'antreandigital',
        title: 'Antrean Digital: System Manajemen Antrean & Panggilan Loket',
        category: 'Aplikasi Mobile & Layanan Publik',
        badge: 'Sistem Antrean',
        period: '2025 - 2026',
        role: 'Fullstack & Mobile Developer',
        status: 'Aktif Digunakan',
        summary: 'Sistem antrean digital cerdas untuk kantor pelayanan publik dengan pembagian loket terpadu (Layanan Umum & CS, Kasir & Pembayaran, Konsultasi & Pengaduan). Pengunjung dapat mengambil nomor tiket digital mandiri dan memantau estimasi giliran secara real-time, sementara petugas mengontrol panggilan antrean melalui panel loket interaktif.',
        thumbnail: 'assets/images/projects/antreandigital/thumbnail.webp',
        tech_stack: ['Flutter', 'Dart', 'REST API', 'Real-time Queue', 'WebSockets'],
        highlights: [
            'Pengambilan tiket antrean digital mandiri berdasarkan jenis kebutuhan layanan',
            'Panel petugas loket interaktif: panggil berikutnya, ulang panggilan, lewati, dan selesaikan',
            'Monitoring tiket aktif pengunjung dengan nomor loket tujuan, sisa antrean, dan estimasi waktu',
            'Papan panggilan loket real-time dan rekapitulasi riwayat antrean harian'
        ],
        screenshots: [
            { url: 'assets/images/projects/antreandigital/1.jpeg', title: 'Tiket Digital Aktif & Papan Status Loket', description: 'Tampilan nomor antrean aktif pengunjung, loket tujuan, estimasi waktu tunggu, dan status panggilan.' },
            { url: 'assets/images/projects/antreandigital/2.jpeg', title: 'Menu Pemilihan Layanan Antrean', description: 'Kategori pilihan loket: Kode A (Layanan Umum & CS), Kode B (Kasir), dan Kode C (Konsultasi).' },
            { url: 'assets/images/projects/antreandigital/3.jpeg', title: 'Panel Kontrol Petugas Loket', description: 'Dashboard petugas untuk memanggil nomor antrean, menyelesaikan layanan, atau melewati nomor.' },
            { url: 'assets/images/projects/antreandigital/4.jpeg', title: 'Formulir Pengambilan Nomor Antrean', description: 'Pengambilan tiket dengan estimasi waktu tunggu dan informasi jumlah antrean yang sedang menunggu.' },
            { url: 'assets/images/projects/antreandigital/5.jpeg', title: 'Riwayat & Log Antrean Harian', description: 'Rekapitulasi tiket yang telah selesai dilayani maupun yang terlewat sepanjang hari operasional.' }
        ],
        github_url: 'https://github.com',
        live_url: '#'
    }
};


# 🎓 SiHadir - Sistem Absensi & Presensi Murid Sekolah Modern

Aplikasi web presensi dan absensi murid sekolah yang lengkap, interaktif, responsif, dan siap pakai tanpa memerlukan instalasi database maupun runtime pihak ketiga (Node.js/Python). Seluruh data tersimpan secara mandiri di penyimpanan lokal peramban (*LocalStorage*).

---

## 🚀 Cara Menjalankan Aplikasi

Terdapat dua cara mudah untuk membuka aplikasi:

### Cara 1: Menggunakan Launcher `start.bat` (Sangat Direkomendasikan ⭐)
1. Buka folder `aplikasi-absensi-murid`.
2. Klik dua kali (double-click) pada file **`start.bat`**.
3. Server lokal ringan bawaan Windows akan aktif pada `http://localhost:8080` dan peramban web (Google Chrome / Edge) akan otomatis terbuka.
4. **Kelebihan:** Pada alamat `localhost`, izin kamera peramban untuk memindai QR Code siswa dapat bekerja 100% tanpa batasan keamanan sistem file.

### Cara 2: Buka Langsung `index.html`
1. Klik dua kali pada file **`index.html`** untuk langsung membukanya di browser Anda.
2. Semua fitur checklist manual, cetak kartu siswa, ekspor Excel, rekapitulasi, dan manajemen data berfungsi penuh.
3. *Catatan untuk scan QR:* Pada mode `file://`, Anda dapat menggunakan fitur **"Pilih Gambar QR"** untuk scan via foto, atau gunakan Cara 1 untuk live kamera webcam.

---

## ✨ Fitur-Fitur Utama

### 1. 📊 Dashboard Ringkasan Kehadiran
- Kartu metrik: Total Siswa, Hadir, Sakit, Izin, Alpha, Belum Absen.
- Persentase kehadiran langsung (*real-time attendance rate*).
- Bilah perkembangan visual (*progress bar*) status kehadiran.
- Grafik perbandingan performa per kelas.
- Log aktivitas presensi terbaru secara berurutan.

### 2. 📝 Absensi Harian (Checklist Kelas)
- Pemilihan tanggal absensi dan filter kelas fleksibel.
- Tombol praktis **"⚡ Hadirkan Semua"** untuk efisiensi guru.
- Tombol status instan: **Hadir (H)**, **Sakit (S)**, **Izin (I)**, dan **Alpha (A)**.
- Input catatan / surat keterangan (misal: "Demam", "Acara keluarga").
- Input dan auto-set waktu jam check-in.
- Ekspor rekap presensi hari ini ke format Excel (.xlsx).

### 3. 📷 Scanner QR Code Murid
- Pemindaian langsung menggunakan kamera laptop / webcam / kamera HP.
- Pilihan perangkat kamera (kamera depan / belakang).
- Opsi alternatif: scan dari file gambar / screenshot barcode siswa.
- Mode presensi: **Presensi Masuk** dan **Presensi Pulang**.
- Deteksi otomatis status **Tepat Waktu** vs **Terlambat** berdasarkan aturan jam sekolah.
- Efek suara konfirmasi beep yang menyenangkan (*Web Audio API*).
- Animasi umpan balik hasil scan kartu siswa.

### 4. 🪪 Generator & Cetak Kartu Pelajar (ID Card)
- ID Card standar CR80 (8.5 x 5.4 cm) dengan desain profesional bernuansa sekolah.
- Dilengkapi foto/avatar, nama siswa, NISN, kelas, dan QR Code verifikasi unik.
- Filter per kelas atau preview per siswa.
- Siap cetak langsung ke printer atau simpan ke PDF (**Ctrl + P** / tombol cetak).

### 5. 👥 Manajemen Data Murid & Kelas
- Tambah, Edit, dan Hapus data murid (NISN, Nama, Kelas, JK, No HP/WA Orang Tua).
- Kelola data Kelas dan nama Wali Kelas.
- **Impor Massal:** Unggah file Excel (.xlsx / .csv) berisi daftar ratusan siswa sekaligus.
- Tombol unduh template format file Excel untuk impor.
- Ekspor seluruh data siswa aktif ke file Excel.

### 6. 📈 Rekapitulasi & Laporan Bulanan Resmi
- Format matriks kalender tanggal 1 sampai 31 sesuai standar administrasi sekolah di Indonesia.
- Kolom akhir ringkasan: Total Hadir, Sakit, Izin, Alpha, dan % Kehadiran per murid.
- **Ekspor Excel (.xlsx):** Unduh lembar rekap bulanan kelas siap arsip dinas.
- **Format Cetak Resmi (Print / PDF):**
  - Dilengkapi Kop Surat Sekolah.
  - Lembar pengesahan tanda tangan Wali Kelas dan Kepala Sekolah beserta NIP.

### 7. ⚙️ Pengaturan & Manajemen Cadangan
- Profil Sekolah: Nama Sekolah, NPSN, Tahun Ajaran, Alamat, Nama Kepala Sekolah & NIP.
- Aturan Jam Masuk & Batas Toleransi Terlambat.
- **Cadangan Data (Backup):** Unduh salinan database lengkap dalam format `.json`.
- **Pemulihan Data (Restore):** Unggah file backup `.json` untuk memulihkan seluruh data saat berganti perangkat.
- Opsi Muat Ulang Data Contoh Demo atau Reset Data.

---

## 📁 Struktur Berkas

```
aplikasi-absensi-murid/
├── index.html            # Antarmuka utama aplikasi web
├── app.js                # Logika inti, state, QR scanner, & kalkulasi rekap
├── styles.css            # Desain kustom, animasi, tata letak kartu & cetak
├── server.ps1            # Server web lokal ringan berbasis PowerShell .NET
├── start.bat             # Peluncur satu klik untuk pengguna Windows
├── README.md             # Dokumentasi panduan penggunaan
└── vendor/               # Pustaka luring (offline):
    ├── qrcode.min.js     # Generator QR Code
    ├── html5-qrcode.min.js # Scanner kamera QR Code
    └── xlsx.full.min.js  # Ekspor & Impor spreadsheet Excel
```

---

## 💡 Tips Penggunaan
- Selalu lakukan **Unduh Backup JSON** di tab Pengaturan secara berkala (misalnya setiap akhir bulan) untuk mengarsipkan data sekolah Anda dengan aman.
- Gunakan peramban Google Chrome atau Microsoft Edge versi terkini untuk pengalaman terbaik.

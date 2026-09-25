# Panduan Lengkap Instalasi e-moment.web.id di XAMPP & Database MySQL

Dokumen ini berisi panduan lengkap langkah demi langkah untuk menginstal proyek **e-moment.web.id** di komputer lokal Anda menggunakan **XAMPP (Apache, MySQL/MariaDB, dan PHP)**.

---

## 📁 Struktur File Backend & Database yang Disediakan
1. `/database/emoment_db.sql`: Skrip SQL lengkap untuk membuat database `emoment_db`, tabel `users`, `products`, `product_sizes`, `orders`, `order_items`, `shop_settings`, dan data awal.
2. `/backend_xamp/config/database.php`: Skrip koneksi PDO ke MySQL XAMPP (CORS enabled).
3. `/backend_xamp/api/products.php`: REST API untuk mengambil, menambah, mengubah, dan menghapus produk cetak.
4. `/backend_xamp/api/orders.php`: REST API untuk pencatatan pesanan checkout WhatsApp, update status, dan input nomor resi.
5. `/backend_xamp/api/auth.php`: REST API pendaftaran & autentikasi pelanggan.
6. `/backend_xamp/api/settings.php`: REST API pengaturan toko, nomor WhatsApp admin, rekening bank/QRIS.

---

## 🚀 Langkah 1: Menjalankan Modul di XAMPP Control Panel
1. Buka aplikasi **XAMPP Control Panel** di PC/Laptop Anda.
2. Pada baris **Apache**, klik tombol **Start**.
3. Pada baris **MySQL**, klik tombol **Start**.
4. Pastikan kedua indikator modul berwarna **hijau** (Port 80/443 untuk Apache dan Port 3306 untuk MySQL).

---

## 🗄️ Langkah 2: Membuat Database di phpMyAdmin & Import SQL
1. Buka browser dan kunjungi:
   ```text
   http://localhost/phpmyadmin
   ```
2. Di bilah menu sebelah kiri, klik tombol **New** (Baru).
3. Masukkan nama database:
   ```text
   emoment_db
   ```
   Pilih collation: `utf8mb4_unicode_ci`, lalu klik **Create**.
4. Pilih database `emoment_db` yang baru dibuat.
5. Klik tab **Import** pada menu navigasi atas.
6. Klik **Choose File / Telusuri File**, pilih file:
   ```text
   database/emoment_db.sql
   ```
7. Gulir ke bawah dan klik tombol **Import / Kirim**.
8. phpMyAdmin akan menampilkan pesan sukses berwarna hijau: *"Import has been successfully finished"*.

---

## 📂 Langkah 3: Menempatkan File Backend di Direktori `htdocs`
1. Buka folder instalasi XAMPP di komputer Anda, biasanya di:
   ```text
   C:\xampp\htdocs\
   ```
2. Buat folder baru bernama `e-moment`:
   ```text
   C:\xampp\htdocs\e-moment\
   ```
3. Salin seluruh isi folder `backend_xamp/` ke dalam `C:\xampp\htdocs\e-moment\`, sehingga susunannya menjadi:
   ```text
   C:\xampp\htdocs\e-moment\
     ├── config\
     │    └── database.php
     ├── api\
     │    ├── products.php
     │    ├── orders.php
     │    ├── auth.php
     │    └── settings.php
     └── .htaccess
   ```
4. Uji koneksi API di browser dengan membuka:
   ```text
   http://localhost/e-moment/api/products.php
   ```
   Jika tampil data JSON berupa daftar produk cetak foto, maka API dan database MySQL Anda sudah berhasil terhubung 100%!

---

## 💻 Langkah 4: Menjalankan Frontend React

### Opsi A: Mode Produksi (Langsung di Apache XAMPP)
1. Buka terminal di folder proyek ini, lalu jalankan:
   ```bash
   npm run build
   ```
2. Salin seluruh isi folder `dist/` hasil build ke dalam:
   ```text
   C:\xampp\htdocs\e-moment\
   ```
3. Buka browser Anda dan akses:
   ```text
   http://localhost/e-moment/
   ```

### Opsi B: Mode Development (Live Reload Vite)
1. Jalankan di terminal:
   ```bash
   npm run dev
   ```
2. Buka aplikasi di:
   ```text
   http://localhost:3000
   ```
   Aplikasi akan otomatis berjalan cepat dan Anda dapat melakukan kustomisasi kode secara langsung.

---

## 🛠️ Data Akun Default untuk Login di phpMyAdmin / Web
- **Akun Admin Lab**:
  - Email: `admin@e-moment.web.id`
  - WhatsApp: `6281288997700`
  - Akses: Full Dashboard Admin, Manajemen Produk, Update Resi, Chat Pelanggan WhatsApp.
- **Akun Pelanggan Sampel**:
  - Email: `ananda.putri@gmail.com`
  - WhatsApp: `6281298765432`

-- ==============================================================================
-- DATABASE: emoment_db
-- APLIKASI: e-moment.web.id (Bespoke Photo & Fine Art Printing Lab)
-- Dibuat untuk: XAMPP (MySQL / MariaDB & phpMyAdmin)
-- ==============================================================================

CREATE DATABASE IF NOT EXISTS `emoment_db` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `emoment_db`;

-- --------------------------------------------------------
-- 1. TABEL: users (Akun Pelanggan & Admin)
-- --------------------------------------------------------
DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
  `id` VARCHAR(50) NOT NULL,
  `name` VARCHAR(150) NOT NULL,
  `email` VARCHAR(150) NOT NULL,
  `phone_whatsapp` VARCHAR(30) NOT NULL,
  `password_hash` VARCHAR(255) DEFAULT NULL,
  `street` TEXT DEFAULT NULL,
  `subdistrict` VARCHAR(100) DEFAULT NULL,
  `city` VARCHAR(100) DEFAULT NULL,
  `province` VARCHAR(100) DEFAULT 'DKI Jakarta',
  `postal_code` VARCHAR(20) DEFAULT NULL,
  `role` ENUM('customer', 'admin') DEFAULT 'customer',
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `idx_users_email` (`email`),
  KEY `idx_users_phone` (`phone_whatsapp`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- 2. TABEL: products (Katalog Produk Cetak)
-- --------------------------------------------------------
DROP TABLE IF EXISTS `products`;
CREATE TABLE `products` (
  `id` VARCHAR(50) NOT NULL,
  `name` VARCHAR(200) NOT NULL,
  `category` ENUM('framed', 'canvas', 'standard', 'polaroid', 'photobook', 'photostrip') NOT NULL,
  `tagline` VARCHAR(255) DEFAULT NULL,
  `description` TEXT DEFAULT NULL,
  `base_price` DECIMAL(12,2) NOT NULL DEFAULT 0.00,
  `estimated_production_days` VARCHAR(50) DEFAULT '2 - 3 Hari Kerja',
  `in_stock` TINYINT(1) DEFAULT 1,
  `cover_mockup_type` VARCHAR(50) DEFAULT 'framed',
  `cover_accent` VARCHAR(20) DEFAULT '#8B5A2B',
  `badge_text` VARCHAR(50) DEFAULT NULL,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- 3. TABEL: product_sizes (Opsi Ukuran per Produk)
-- --------------------------------------------------------
DROP TABLE IF EXISTS `product_sizes`;
CREATE TABLE `product_sizes` (
  `id` VARCHAR(50) NOT NULL,
  `product_id` VARCHAR(50) NOT NULL,
  `name` VARCHAR(100) NOT NULL,
  `dimension_cm` VARCHAR(50) NOT NULL,
  `ratio` VARCHAR(20) DEFAULT '4:5',
  `price_delta` DECIMAL(12,2) NOT NULL DEFAULT 0.00,
  PRIMARY KEY (`id`),
  KEY `fk_sizes_product` (`product_id`),
  CONSTRAINT `fk_sizes_product` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- 4. TABEL: orders (Riwayat Pesanan Cetak)
-- --------------------------------------------------------
DROP TABLE IF EXISTS `orders`;
CREATE TABLE `orders` (
  `id` VARCHAR(50) NOT NULL, -- Contoh: EMO-260925-1048
  `user_id` VARCHAR(50) DEFAULT NULL,
  `customer_name` VARCHAR(150) NOT NULL,
  `customer_phone_whatsapp` VARCHAR(30) NOT NULL,
  `customer_email` VARCHAR(150) DEFAULT NULL,
  `street` TEXT NOT NULL,
  `subdistrict` VARCHAR(100) DEFAULT NULL,
  `city` VARCHAR(100) NOT NULL,
  `province` VARCHAR(100) DEFAULT 'DKI Jakarta',
  `postal_code` VARCHAR(20) DEFAULT NULL,
  `is_guest` TINYINT(1) DEFAULT 0,
  `subtotal` DECIMAL(12,2) NOT NULL DEFAULT 0.00,
  `shipping_cost` DECIMAL(12,2) NOT NULL DEFAULT 0.00,
  `courier` VARCHAR(100) NOT NULL DEFAULT 'SiCepat Reguler',
  `total_amount` DECIMAL(12,2) NOT NULL DEFAULT 0.00,
  `file_method` ENUM('web_upload', 'google_drive', 'wa_document') DEFAULT 'web_upload',
  `file_link` TEXT DEFAULT NULL,
  `customer_notes` TEXT DEFAULT NULL,
  `status` ENUM('Menunggu Pembayaran', 'Pembayaran Diterima', 'Sedang Dicetak', 'Finishing & Bingkai', 'Dikirim', 'Siap Diambil', 'Selesai', 'Dibatalkan') DEFAULT 'Menunggu Pembayaran',
  `tracking_number` VARCHAR(100) DEFAULT NULL,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_orders_customer_phone` (`customer_phone_whatsapp`),
  KEY `idx_orders_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- 5. TABEL: order_items (Rincian Item Foto per Pesanan)
-- --------------------------------------------------------
DROP TABLE IF EXISTS `order_items`;
CREATE TABLE `order_items` (
  `id` VARCHAR(50) NOT NULL,
  `order_id` VARCHAR(50) NOT NULL,
  `product_id` VARCHAR(50) NOT NULL,
  `product_name` VARCHAR(200) NOT NULL,
  `category` VARCHAR(50) NOT NULL,
  `user_photo_url` MEDIUMTEXT DEFAULT NULL,
  `size_name` VARCHAR(100) NOT NULL,
  `dimension_cm` VARCHAR(50) NOT NULL,
  `paper` VARCHAR(100) NOT NULL,
  `frame` VARCHAR(50) DEFAULT 'none',
  `matboard` TINYINT(1) DEFAULT 1,
  `lamination` VARCHAR(100) DEFAULT 'Tanpa Laminasi',
  `instructions` TEXT DEFAULT NULL,
  `quantity` INT NOT NULL DEFAULT 1,
  `unit_price` DECIMAL(12,2) NOT NULL DEFAULT 0.00,
  `total_price` DECIMAL(12,2) NOT NULL DEFAULT 0.00,
  PRIMARY KEY (`id`),
  KEY `fk_order_items_order` (`order_id`),
  CONSTRAINT `fk_order_items_order` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- 6. TABEL: shop_settings (Pengaturan Toko & Bank)
-- --------------------------------------------------------
DROP TABLE IF EXISTS `shop_settings`;
CREATE TABLE `shop_settings` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `shop_name` VARCHAR(150) NOT NULL DEFAULT 'e-moment.web.id',
  `tagline` VARCHAR(255) DEFAULT 'Bespoke Photo & Fine Art Printing Lab — Kualitas Galeri Seni',
  `admin_whatsapp` VARCHAR(30) NOT NULL DEFAULT '6281288997700',
  `studio_address` TEXT NOT NULL,
  `bank_info` TEXT NOT NULL,
  `qris_instruction` TEXT DEFAULT NULL,
  `flat_shipping_fee` DECIMAL(12,2) NOT NULL DEFAULT 18000.00,
  `free_shipping_threshold` DECIMAL(12,2) NOT NULL DEFAULT 200000.00,
  `operating_hours` VARCHAR(150) DEFAULT 'Senin - Sabtu: 09:00 - 18:00 WIB',
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ==============================================================================
-- SEED DATA AWAL (DEMO & PRODUKSI)
-- ==============================================================================

-- 1. Seed Users (Admin & Sample Customer)
-- Password default: 'admin123' (bcrypt hash) & 'pelanggan123'
INSERT INTO `users` (`id`, `name`, `email`, `phone_whatsapp`, `password_hash`, `street`, `subdistrict`, `city`, `province`, `postal_code`, `role`) VALUES
('usr-admin', 'Lab Manager e-moment', 'admin@e-moment.web.id', '6281288997700', '$2y$10$wT0sZf.Yyv0ZzSjR9N/sWeD9585R1vjXyqW96V8wR2M1234567890', 'Jl. Galeri Seni No. 18, Menteng', 'Menteng', 'Jakarta Pusat', 'DKI Jakarta', '10310', 'admin'),
('usr-1', 'Ananda Putri Ramadhani', 'ananda.putri@gmail.com', '6281298765432', '$2y$10$wT0sZf.Yyv0ZzSjR9N/sWeD9585R1vjXyqW96V8wR2M1234567890', 'Apartemen Casa Domaine Tower 1 Lt. 18', 'Tanah Abang', 'Jakarta Pusat', 'DKI Jakarta', '10220', 'customer');

-- 2. Seed Shop Settings
INSERT INTO `shop_settings` (`id`, `shop_name`, `tagline`, `admin_whatsapp`, `studio_address`, `bank_info`, `qris_instruction`, `flat_shipping_fee`, `free_shipping_threshold`, `operating_hours`) VALUES
(1, 'e-moment.web.id', 'Bespoke Photo & Fine Art Printing Lab — Kualitas Galeri Seni', '6281288997700', 'Jl. Galeri Seni No. 18, Menteng, Jakarta Pusat 10310', 'BCA 7310-558-901 a/n PT E-MOMENT KARYA ABADI\nMandiri 122-00-1928374-1 a/n E-MOMENT LAB', 'Scan QRIS e-moment resmi yang kami kirimkan di chat WhatsApp untuk pembayaran instan via GoPay, OVO, ShopeePay, atau Mobile Banking.', 18000.00, 200000.00, 'Senin - Sabtu: 09:00 - 18:00 WIB (Minggu & Libur Tutup)');

-- 3. Seed Products
INSERT INTO `products` (`id`, `name`, `category`, `tagline`, `description`, `base_price`, `estimated_production_days`, `in_stock`, `cover_mockup_type`, `cover_accent`, `badge_text`) VALUES
('prod-framed', 'Cetak Framed Minimalis Galeri Kayu Jati', 'framed', 'Bingkai Kayu Jati Solid Natural & Matboard Museum Acid-Free', 'Koleksi cetak foto berbingkai dengan profil kayu solid pilihan (Jati Natural, Hitam Doff, Putih Bersih). Dilengkapi matboard passe-partout bebas asam setebal 2mm yang memberikan nafas kedalaman visual setara karya galeri internasional.', 125000.00, '2 - 3 Hari Kerja', 1, 'framed', '#8B5A2B', 'Paling Diminati'),
('prod-canvas', 'Cetak Kanvas Stretched Galeri Spanram 3cm', 'canvas', 'Kanvas Katun Woven 380gsm Terbalut Spanram Kayu Tebal', 'Cetak foto di atas kanvas katun bertekstur alami dengan tinta pigmen archival UltraChrome 12-warna. Dipasang rapi pada spanram kayu pinus kering tebal 3cm dengan sisi samping gallery wrap rapi, siap digantung tanpa perlu bingkai kaca.', 145000.00, '2 - 4 Hari Kerja', 1, 'canvas', '#3A3835', 'Kualitas Museum'),
('prod-standard', 'Cetak Foto Standar & Pembesaran Fine Art', 'standard', 'Cetak Presisi Tinggi Ukuran 2R hingga 20R Archival', 'Cetak foto lembaran presisi menggunakan mesin cetak digital lab Jepang 12 warna. Kejernihan tone kulit, gradasi bayangan dalam, dan ketahanan warna hingga 100+ tahun dijamin anti-pudar.', 15000.00, '1 - 2 Hari Kerja', 1, 'standard', '#2F3E46', NULL),
('prod-polaroid', 'Set Cetak Polaroid Retro & Kenangan', 'polaroid', 'Koleksi Foto Gaya Vintage + Mini Wooden Clip & Tali Rami', 'Abadikan memori perjalanan, persahabatan, atau keluarga dengan format square polaroid klasik. Menggunakan kertas foto premium tebal 260gsm dengan ruang caption tulisan tangan di bagian bawah. Gratis penjepit kayu estetik.', 48000.00, '1 - 2 Hari Kerja', 1, 'polaroid', '#D4A373', 'Best Gift'),
('prod-photobook', 'Bespoke Layflat Hardcover Photobook Album', 'photobook', 'Jilid Layflat 180° Tanpa Patah Tengah — Kualitas Warisan', 'Album foto eksklusif dengan penjilidan seamless layflat 180 derajat. Setiap halaman dibuka rata sempurna tanpa memotong foto panorama di tengah. Cover hardcover kain linen bertekstur elegan atau leatherette dengan cetak judul foil timbul.', 285000.00, '3 - 5 Hari Kerja', 1, 'photobook', '#582F0E', 'Koleksi Mewah'),
('prod-photostrip', 'Set Photo Strip Magnet Kulkas Estetik Photobox', 'photostrip', 'Strip 4 Foto Bernuansa Photobox Korea dengan Lapisan Magnet', 'Photo strip vertikal dengan 3–4 pose foto favorit. Bagian belakang dilapisi lembaran magnet fleksibel utuh sehingga langsung menempel kuat di pintu kulkas, lemari loker, atau papan memo logam tanpa merusak cat.', 35000.00, '1 - 2 Hari Kerja', 1, 'photostrip', '#606C38', NULL);

-- 4. Seed Product Sizes
INSERT INTO `product_sizes` (`id`, `product_id`, `name`, `dimension_cm`, `ratio`, `price_delta`) VALUES
('size-8r', 'prod-framed', '8R Plus (20 x 25 cm)', '20 x 25 cm', '4:5', 0.00),
('size-10r', 'prod-framed', '10R Plus (25 x 30 cm)', '25 x 30 cm', '5:6', 45000.00),
('size-12r', 'prod-framed', '12R (30 x 40 cm)', '30 x 40 cm', '3:4', 85000.00),
('size-16r', 'prod-framed', '16R (40 x 50 cm)', '40 x 50 cm', '4:5', 165000.00),
('size-20r', 'prod-framed', '20R Jumbo (50 x 70 cm)', '50 x 70 cm', '5:7', 275000.00),
('canvas-30x40', 'prod-canvas', 'Medium (30 x 40 cm)', '30 x 40 cm', '3:4', 0.00),
('canvas-40x60', 'prod-canvas', 'Large (40 x 60 cm)', '40 x 60 cm', '2:3', 95000.00),
('canvas-50x75', 'prod-canvas', 'Gallery Standard (50 x 75 cm)', '50 x 75 cm', '2:3', 185000.00),
('size-4r', 'prod-standard', '4R (10 x 15 cm)', '10 x 15 cm', '2:3', 0.00),
('size-5r', 'prod-standard', '5R (13 x 18 cm)', '13 x 18 cm', '5:7', 9000.00),
('pol-25', 'prod-polaroid', 'Paket 25 Foto + 25 Clip Kayu', '7.5 x 10 cm', '3:4', 0.00),
('pol-50', 'prod-polaroid', 'Paket 50 Foto + 50 Clip Kayu', '7.5 x 10 cm', '3:4', 38000.00),
('book-20x20', 'prod-photobook', 'Square Elegance (20 x 20 cm) 24 Hal', '20 x 20 cm', '1:1', 0.00),
('strip-4', 'prod-photostrip', 'Paket 4 Strip Magnet (16 Foto)', '5 x 15 cm', '1:3', 0.00);

-- 5. Seed Orders Sample
INSERT INTO `orders` (`id`, `user_id`, `customer_name`, `customer_phone_whatsapp`, `customer_email`, `street`, `subdistrict`, `city`, `province`, `postal_code`, `is_guest`, `subtotal`, `shipping_cost`, `courier`, `total_amount`, `file_method`, `file_link`, `customer_notes`, `status`, `tracking_number`, `created_at`) VALUES
('EMO-260925-1048', 'usr-1', 'Ananda Putri Ramadhani', '6281298765432', 'ananda.putri@gmail.com', 'Apartemen Casa Domaine Tower 1 Lt. 18', 'Tanah Abang', 'Jakarta Pusat', 'DKI Jakarta', '10220', 0, 210000.00, 0.00, 'SiCepat Reguler', 210000.00, 'web_upload', NULL, 'Kemas dengan bubble wrap tebal karena untuk kado anniversary.', 'Sedang Dicetak', NULL, '2026-09-24 14:30:00'),
('EMO-260924-1025', NULL, 'Bima Satria Yudha', '6281311223344', 'bima.satria@creativestudio.id', 'Jl. Kemang Timur No. 42B', 'Bangka', 'Jakarta Selatan', 'DKI Jakarta', '12730', 1, 480000.00, 0.00, 'JNE YES', 480000.00, 'google_drive', 'https://drive.google.com/drive/folders/sample-bima-landscape', 'File master TIFF resolusi 300dpi di Drive.', 'Finishing & Bingkai', 'JNE-YES-8837192019', '2026-09-23 10:00:00');

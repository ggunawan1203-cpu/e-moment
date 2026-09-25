export const SQL_DUMP_CONTENT = `-- ==============================================================================
-- DATABASE: emoment_db
-- APLIKASI: e-moment.web.id (Bespoke Photo & Fine Art Printing Lab)
-- Dibuat untuk: XAMPP (MySQL / MariaDB & phpMyAdmin)
-- ==============================================================================

CREATE DATABASE IF NOT EXISTS \`emoment_db\` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE \`emoment_db\`;

-- --------------------------------------------------------
-- 1. TABEL: users (Akun Pelanggan & Admin)
-- --------------------------------------------------------
DROP TABLE IF EXISTS \`users\`;
CREATE TABLE \`users\` (
  \`id\` VARCHAR(50) NOT NULL,
  \`name\` VARCHAR(150) NOT NULL,
  \`email\` VARCHAR(150) NOT NULL,
  \`phone_whatsapp\` VARCHAR(30) NOT NULL,
  \`password_hash\` VARCHAR(255) DEFAULT NULL,
  \`street\` TEXT DEFAULT NULL,
  \`subdistrict\` VARCHAR(100) DEFAULT NULL,
  \`city\` VARCHAR(100) DEFAULT NULL,
  \`province\` VARCHAR(100) DEFAULT 'DKI Jakarta',
  \`postal_code\` VARCHAR(20) DEFAULT NULL,
  \`role\` ENUM('customer', 'admin') DEFAULT 'customer',
  \`created_at\` DATETIME DEFAULT CURRENT_TIMESTAMP,
  \`updated_at\` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (\`id\`),
  UNIQUE KEY \`idx_users_email\` (\`email\`),
  KEY \`idx_users_phone\` (\`phone_whatsapp\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- 2. TABEL: products (Katalog Produk Cetak)
-- --------------------------------------------------------
DROP TABLE IF EXISTS \`products\`;
CREATE TABLE \`products\` (
  \`id\` VARCHAR(50) NOT NULL,
  \`name\` VARCHAR(200) NOT NULL,
  \`category\` ENUM('framed', 'canvas', 'standard', 'polaroid', 'photobook', 'photostrip') NOT NULL,
  \`tagline\` VARCHAR(255) DEFAULT NULL,
  \`description\` TEXT DEFAULT NULL,
  \`base_price\` DECIMAL(12,2) NOT NULL DEFAULT 0.00,
  \`estimated_production_days\` VARCHAR(50) DEFAULT '2 - 3 Hari Kerja',
  \`in_stock\` TINYINT(1) DEFAULT 1,
  \`cover_mockup_type\` VARCHAR(50) DEFAULT 'framed',
  \`cover_accent\` VARCHAR(20) DEFAULT '#8B5A2B',
  \`badge_text\` VARCHAR(50) DEFAULT NULL,
  \`created_at\` DATETIME DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (\`id\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- 3. TABEL: product_sizes (Opsi Ukuran per Produk)
-- --------------------------------------------------------
DROP TABLE IF EXISTS \`product_sizes\`;
CREATE TABLE \`product_sizes\` (
  \`id\` VARCHAR(50) NOT NULL,
  \`product_id\` VARCHAR(50) NOT NULL,
  \`name\` VARCHAR(100) NOT NULL,
  \`dimension_cm\` VARCHAR(50) NOT NULL,
  \`ratio\` VARCHAR(20) DEFAULT '4:5',
  \`price_delta\` DECIMAL(12,2) NOT NULL DEFAULT 0.00,
  PRIMARY KEY (\`id\`),
  KEY \`fk_sizes_product\` (\`product_id\`),
  CONSTRAINT \`fk_sizes_product\` FOREIGN KEY (\`product_id\`) REFERENCES \`products\` (\`id\`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- 4. TABEL: orders (Riwayat Pesanan Cetak)
-- --------------------------------------------------------
DROP TABLE IF EXISTS \`orders\`;
CREATE TABLE \`orders\` (
  \`id\` VARCHAR(50) NOT NULL,
  \`user_id\` VARCHAR(50) DEFAULT NULL,
  \`customer_name\` VARCHAR(150) NOT NULL,
  \`customer_phone_whatsapp\` VARCHAR(30) NOT NULL,
  \`customer_email\` VARCHAR(150) DEFAULT NULL,
  \`street\` TEXT NOT NULL,
  \`subdistrict\` VARCHAR(100) DEFAULT NULL,
  \`city\` VARCHAR(100) NOT NULL,
  \`province\` VARCHAR(100) DEFAULT 'DKI Jakarta',
  \`postal_code\` VARCHAR(20) DEFAULT NULL,
  \`is_guest\` TINYINT(1) DEFAULT 0,
  \`subtotal\` DECIMAL(12,2) NOT NULL DEFAULT 0.00,
  \`shipping_cost\` DECIMAL(12,2) NOT NULL DEFAULT 0.00,
  \`courier\` VARCHAR(100) NOT NULL DEFAULT 'SiCepat Reguler',
  \`total_amount\` DECIMAL(12,2) NOT NULL DEFAULT 0.00,
  \`file_method\` ENUM('web_upload', 'google_drive', 'wa_document') DEFAULT 'web_upload',
  \`file_link\` TEXT DEFAULT NULL,
  \`customer_notes\` TEXT DEFAULT NULL,
  \`status\` ENUM('Menunggu Pembayaran', 'Pembayaran Diterima', 'Sedang Dicetak', 'Finishing & Bingkai', 'Dikirim', 'Siap Diambil', 'Selesai', 'Dibatalkan') DEFAULT 'Menunggu Pembayaran',
  \`tracking_number\` VARCHAR(100) DEFAULT NULL,
  \`created_at\` DATETIME DEFAULT CURRENT_TIMESTAMP,
  \`updated_at\` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (\`id\`),
  KEY \`idx_orders_customer_phone\` (\`customer_phone_whatsapp\`),
  KEY \`idx_orders_status\` (\`status\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- 5. TABEL: order_items (Rincian Item Foto per Pesanan)
-- --------------------------------------------------------
DROP TABLE IF EXISTS \`order_items\`;
CREATE TABLE \`order_items\` (
  \`id\` VARCHAR(50) NOT NULL,
  \`order_id\` VARCHAR(50) NOT NULL,
  \`product_id\` VARCHAR(50) NOT NULL,
  \`product_name\` VARCHAR(200) NOT NULL,
  \`category\` VARCHAR(50) NOT NULL,
  \`user_photo_url\` MEDIUMTEXT DEFAULT NULL,
  \`size_name\` VARCHAR(100) NOT NULL,
  \`dimension_cm\` VARCHAR(50) NOT NULL,
  \`paper\` VARCHAR(100) NOT NULL,
  \`frame\` VARCHAR(50) DEFAULT 'none',
  \`matboard\` TINYINT(1) DEFAULT 1,
  \`lamination\` VARCHAR(100) DEFAULT 'Tanpa Laminasi',
  \`instructions\` TEXT DEFAULT NULL,
  \`quantity\` INT NOT NULL DEFAULT 1,
  \`unit_price\` DECIMAL(12,2) NOT NULL DEFAULT 0.00,
  \`total_price\` DECIMAL(12,2) NOT NULL DEFAULT 0.00,
  PRIMARY KEY (\`id\`),
  KEY \`fk_order_items_order\` (\`order_id\`),
  CONSTRAINT \`fk_order_items_order\` FOREIGN KEY (\`order_id\`) REFERENCES \`orders\` (\`id\`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- 6. TABEL: shop_settings (Pengaturan Toko & Bank)
-- --------------------------------------------------------
DROP TABLE IF EXISTS \`shop_settings\`;
CREATE TABLE \`shop_settings\` (
  \`id\` INT NOT NULL AUTO_INCREMENT,
  \`shop_name\` VARCHAR(150) NOT NULL DEFAULT 'e-moment.web.id',
  \`tagline\` VARCHAR(255) DEFAULT 'Bespoke Photo & Fine Art Printing Lab — Kualitas Galeri Seni',
  \`admin_whatsapp\` VARCHAR(30) NOT NULL DEFAULT '6281288997700',
  \`studio_address\` TEXT NOT NULL,
  \`bank_info\` TEXT NOT NULL,
  \`qris_instruction\` TEXT DEFAULT NULL,
  \`flat_shipping_fee\` DECIMAL(12,2) NOT NULL DEFAULT 18000.00,
  \`free_shipping_threshold\` DECIMAL(12,2) NOT NULL DEFAULT 200000.00,
  \`operating_hours\` VARCHAR(150) DEFAULT 'Senin - Sabtu: 09:00 - 18:00 WIB',
  \`updated_at\` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (\`id\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- SEED DATA AWAL
INSERT INTO \`shop_settings\` (\`id\`, \`shop_name\`, \`tagline\`, \`admin_whatsapp\`, \`studio_address\`, \`bank_info\`, \`qris_instruction\`, \`flat_shipping_fee\`, \`free_shipping_threshold\`, \`operating_hours\`) VALUES
(1, 'e-moment.web.id', 'Bespoke Photo & Fine Art Printing Lab — Kualitas Galeri Seni', '6281288997700', 'Jl. Galeri Seni No. 18, Menteng, Jakarta Pusat 10310', 'BCA 7310-558-901 a/n PT E-MOMENT KARYA ABADI\\nMandiri 122-00-1928374-1 a/n E-MOMENT LAB', 'Scan QRIS e-moment resmi yang kami kirimkan di chat WhatsApp.', 18000.00, 200000.00, 'Senin - Sabtu: 09:00 - 18:00 WIB (Minggu & Libur Tutup)');

INSERT INTO \`products\` (\`id\`, \`name\`, \`category\`, \`tagline\`, \`description\`, \`base_price\`, \`estimated_production_days\`, \`in_stock\`, \`cover_mockup_type\`, \`cover_accent\`, \`badge_text\`) VALUES
('prod-framed', 'Cetak Framed Minimalis Galeri Kayu Jati', 'framed', 'Bingkai Kayu Jati Solid Natural & Matboard Museum Acid-Free', 'Koleksi cetak foto berbingkai dengan profil kayu solid pilihan.', 125000.00, '2 - 3 Hari Kerja', 1, 'framed', '#8B5A2B', 'Paling Diminati'),
('prod-canvas', 'Cetak Kanvas Stretched Galeri Spanram 3cm', 'canvas', 'Kanvas Katun Woven 380gsm Terbalut Spanram Kayu Tebal', 'Cetak foto di atas kanvas katun bertekstur alami dengan tinta pigmen archival 12-warna.', 145000.00, '2 - 4 Hari Kerja', 1, 'canvas', '#3A3835', 'Kualitas Museum'),
('prod-standard', 'Cetak Foto Standar & Pembesaran Fine Art', 'standard', 'Cetak Presisi Tinggi Ukuran 2R hingga 20R Archival', 'Cetak foto lembaran presisi menggunakan mesin digital lab 12 warna.', 15000.00, '1 - 2 Hari Kerja', 1, 'standard', '#2F3E46', NULL);
`;

export const PHP_DB_CONNECT_CODE = `<?php
/**
 * Konfigurasi Database MySQL untuk XAMPP
 * Letakkan file ini di: C:/xampp/htdocs/e-moment/config/database.php
 */

header('Content-Type: application/json; charset=UTF-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

class Database {
    private $host = "localhost";
    private $db_name = "emoment_db";
    private $username = "root";
    private $password = ""; // Default XAMPP kosong
    public $conn;

    public function getConnection() {
        $this->conn = null;
        try {
            $this->conn = new PDO(
                "mysql:host=" . $this->host . ";dbname=" . $this->db_name . ";charset=utf8mb4",
                $this->username,
                $this->password,
                [
                    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC
                ]
            );
        } catch(PDOException $e) {
            http_response_code(500);
            echo json_encode(["status" => "error", "message" => "Koneksi gagal: " . $e->getMessage()]);
            exit();
        }
        return $this->conn;
    }
}
?>`;

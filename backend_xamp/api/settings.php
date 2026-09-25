<?php
require_once '../config/database.php';

$database = new Database();
$db = $database->getConnection();

$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET':
        $stmt = $db->query("SELECT * FROM shop_settings LIMIT 1");
        $settings = $stmt->fetch();

        if ($settings) {
            $formatted = [
                "shopName" => $settings['shop_name'],
                "tagline" => $settings['tagline'],
                "adminWhatsApp" => $settings['admin_whatsapp'],
                "studioAddress" => $settings['studio_address'],
                "bankInfo" => $settings['bank_info'],
                "qrisInstruction" => $settings['qris_instruction'],
                "flatShippingFee" => (float)$settings['flat_shipping_fee'],
                "freeShippingThreshold" => (float)$settings['free_shipping_threshold'],
                "operatingHours" => $settings['operating_hours']
            ];
            echo json_encode(["status" => "success", "data" => $formatted]);
        } else {
            echo json_encode(["status" => "error", "message" => "Pengaturan tidak ditemukan."]);
        }
        break;

    case 'POST':
    case 'PUT':
        $data = json_decode(file_get_contents("php://input"), true);
        if (!$data) {
            http_response_code(400);
            echo json_encode(["status" => "error", "message" => "Data tidak valid."]);
            exit();
        }

        $stmt = $db->prepare("UPDATE shop_settings SET 
            shop_name = ?, tagline = ?, admin_whatsapp = ?, studio_address = ?, bank_info = ?, 
            flat_shipping_fee = ?, free_shipping_threshold = ?, operating_hours = ? 
            WHERE id = 1");

        $stmt->execute([
            $data['shopName'] ?? 'e-moment.web.id',
            $data['tagline'] ?? 'Bespoke Photo & Fine Art Printing Lab — Kualitas Galeri Seni',
            preg_replace('/\D/', '', $data['adminWhatsApp'] ?? '6281288997700'),
            $data['studioAddress'] ?? '',
            $data['bankInfo'] ?? '',
            $data['flatShippingFee'] ?? 18000,
            $data['freeShippingThreshold'] ?? 200000,
            $data['operatingHours'] ?? 'Senin - Sabtu: 09:00 - 18:00 WIB'
        ]);

        echo json_encode(["status" => "success", "message" => "Pengaturan toko berhasil disimpan ke database MySQL."]);
        break;

    default:
        http_response_code(405);
        echo json_encode(["status" => "error", "message" => "Method not allowed"]);
        break;
}

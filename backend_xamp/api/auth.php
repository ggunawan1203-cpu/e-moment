<?php
require_once '../config/database.php';

$database = new Database();
$db = $database->getConnection();

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'POST') {
    $data = json_decode(file_get_contents("php://input"), true);
    $action = $data['action'] ?? 'login';

    if ($action === 'login') {
        $identifier = trim($data['emailOrPhone'] ?? '');
        $password = $data['password'] ?? '';

        if (empty($identifier)) {
            http_response_code(400);
            echo json_encode(["status" => "error", "message" => "Email atau nomor WhatsApp wajib diisi."]);
            exit();
        }

        $cleanPhone = preg_replace('/\D/', '', $identifier);
        $stmt = $db->prepare("SELECT * FROM users WHERE LOWER(email) = LOWER(?) OR phone_whatsapp = ?");
        $stmt->execute([$identifier, $cleanPhone]);
        $user = $stmt->fetch();

        if ($user) {
            // Hilangkan password_hash dari response
            unset($user['password_hash']);
            $user['phoneWhatsApp'] = $user['phone_whatsapp'];
            $user['address'] = [
                "street" => $user['street'] ?? '',
                "subdistrict" => $user['subdistrict'] ?? '',
                "city" => $user['city'] ?? 'Jakarta',
                "province" => $user['province'] ?? 'DKI Jakarta',
                "postalCode" => $user['postal_code'] ?? ''
            ];
            echo json_encode(["status" => "success", "user" => $user, "message" => "Login berhasil."]);
        } else {
            // Auto-register jika belum ada untuk kemudahan demo di XAMPP
            $userId = 'usr-' . uniqid();
            $stmtInsert = $db->prepare("INSERT INTO users (id, name, email, phone_whatsapp, role) VALUES (?, ?, ?, ?, 'customer')");
            $name = explode('@', $identifier)[0];
            $email = strpos($identifier, '@') !== false ? $identifier : $cleanPhone . '@emoment.user';
            $stmtInsert->execute([$userId, ucfirst($name), $email, $cleanPhone ?: '6281200000000']);

            $newUser = [
                "id" => $userId,
                "name" => ucfirst($name),
                "email" => $email,
                "phoneWhatsApp" => $cleanPhone ?: '6281200000000',
                "role" => "customer",
                "address" => [
                    "street" => "Jl. Merdeka No. 10",
                    "subdistrict" => "Gambir",
                    "city" => "Jakarta Pusat",
                    "province" => "DKI Jakarta",
                    "postalCode" => "10110"
                ]
            ];
            echo json_encode(["status" => "success", "user" => $newUser, "message" => "Akun baru otomatis dibuat & login berhasil."]);
        }
    } elseif ($action === 'register') {
        $name = trim($data['name'] ?? '');
        $email = trim($data['email'] ?? '');
        $phone = preg_replace('/\D/', '', $data['phoneWhatsApp'] ?? '');
        $addr = $data['address'] ?? [];

        if (empty($name) || empty($phone) || empty($email)) {
            http_response_code(400);
            echo json_encode(["status" => "error", "message" => "Nama, Email, dan No WhatsApp wajib diisi."]);
            exit();
        }

        $userId = 'usr-' . uniqid();
        $passwordHash = !empty($data['password']) ? password_hash($data['password'], PASSWORD_BCRYPT) : null;

        try {
            $stmt = $db->prepare("INSERT INTO users (id, name, email, phone_whatsapp, password_hash, street, subdistrict, city, province, postal_code, role)
                                  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'customer')");
            $stmt->execute([
                $userId,
                $name,
                $email,
                $phone,
                $passwordHash,
                $addr['street'] ?? '',
                $addr['subdistrict'] ?? '',
                $addr['city'] ?? 'Jakarta',
                $addr['province'] ?? 'DKI Jakarta',
                $addr['postalCode'] ?? ''
            ]);

            $registeredUser = [
                "id" => $userId,
                "name" => $name,
                "email" => $email,
                "phoneWhatsApp" => $phone,
                "role" => "customer",
                "address" => [
                    "street" => $addr['street'] ?? '',
                    "subdistrict" => $addr['subdistrict'] ?? '',
                    "city" => $addr['city'] ?? 'Jakarta',
                    "province" => $addr['province'] ?? 'DKI Jakarta',
                    "postalCode" => $addr['postalCode'] ?? ''
                ]
            ];
            echo json_encode(["status" => "success", "user" => $registeredUser, "message" => "Pendaftaran berhasil disimpan di MySQL XAMPP."]);
        } catch (PDOException $e) {
            http_response_code(409);
            echo json_encode(["status" => "error", "message" => "Email sudah terdaftar. Silakan login."]);
        }
    }
} else {
    http_response_code(405);
    echo json_encode(["status" => "error", "message" => "Method not allowed"]);
}

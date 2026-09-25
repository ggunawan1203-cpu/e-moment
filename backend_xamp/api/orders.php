<?php
require_once '../config/database.php';

$database = new Database();
$db = $database->getConnection();

$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET':
        // Cek apakah ada query ID atau No WA
        $orderId = $_GET['id'] ?? null;
        $phone = $_GET['phone'] ?? null;
        $userId = $_GET['user_id'] ?? null;

        $sql = "SELECT * FROM orders";
        $params = [];

        if ($orderId) {
            $sql .= " WHERE id = ?";
            $params[] = $orderId;
        } elseif ($phone) {
            $sql .= " WHERE customer_phone_whatsapp LIKE ?";
            $params[] = "%" . preg_replace('/\D/', '', $phone) . "%";
        } elseif ($userId) {
            $sql .= " WHERE user_id = ?";
            $params[] = $userId;
        }

        $sql .= " ORDER BY created_at DESC";
        $stmt = $db->prepare($sql);
        $stmt->execute($params);
        $orders = $stmt->fetchAll();

        // Ambil item untuk setiap order
        foreach ($orders as &$ord) {
            $stmtItems = $db->prepare("SELECT * FROM order_items WHERE order_id = ?");
            $stmtItems->execute([$ord['id']]);
            $items = $stmtItems->fetchAll();

            $formattedItems = [];
            foreach ($items as $it) {
                $formattedItems[] = [
                    "id" => $it['id'],
                    "productId" => $it['product_id'],
                    "productName" => $it['product_name'],
                    "category" => $it['category'],
                    "userPhotoUrl" => $it['user_photo_url'],
                    "size" => [
                        "id" => "size-custom",
                        "name" => $it['size_name'],
                        "dimensionCm" => $it['dimension_cm'],
                        "ratio" => "4:5",
                        "priceDelta" => 0
                    ],
                    "paper" => $it['paper'],
                    "frame" => $it['frame'],
                    "matboard" => (bool)$it['matboard'],
                    "lamination" => $it['lamination'],
                    "instructions" => $it['instructions'],
                    "quantity" => (int)$it['quantity'],
                    "unitPrice" => (float)$it['unit_price'],
                    "totalPrice" => (float)$it['total_price']
                ];
            }

            $ord['items'] = $formattedItems;
            $ord['customerPhoneWhatsApp'] = $ord['customer_phone_whatsapp'];
            $ord['customerName'] = $ord['customer_name'];
            $ord['customerEmail'] = $ord['customer_email'];
            $ord['subtotal'] = (float)$ord['subtotal'];
            $ord['shippingCost'] = (float)$ord['shipping_cost'];
            $ord['totalAmount'] = (float)$ord['total_amount'];
            $ord['fileMethod'] = $ord['file_method'];
            $ord['fileLink'] = $ord['file_link'];
            $ord['customerNotes'] = $ord['customer_notes'];
            $ord['trackingNumber'] = $ord['tracking_number'];
            $ord['isGuest'] = (bool)$ord['is_guest'];
            $ord['shippingAddress'] = [
                "street" => $ord['street'],
                "subdistrict" => $ord['subdistrict'],
                "city" => $ord['city'],
                "province" => $ord['province'],
                "postalCode" => $ord['postal_code']
            ];
            $ord['createdAt'] = $ord['created_at'];
            $ord['updatedAt'] = $ord['updated_at'];
        }

        echo json_encode(["status" => "success", "data" => $orders]);
        break;

    case 'POST':
        // Simpan pesanan baru dari checkout Direct WhatsApp
        $data = json_decode(file_get_contents("php://input"), true);
        if (!$data || empty($data['customerName']) || empty($data['customerPhoneWhatsApp'])) {
            http_response_code(400);
            echo json_encode(["status" => "error", "message" => "Data pemesan tidak lengkap."]);
            exit();
        }

        $orderId = !empty($data['id']) ? $data['id'] : 'EMO-' . date('ymd') . '-' . rand(1000, 9999);
        $addr = $data['shippingAddress'] ?? [];

        $db->beginTransaction();
        try {
            $stmt = $db->prepare("INSERT INTO orders (id, user_id, customer_name, customer_phone_whatsapp, customer_email, street, subdistrict, city, province, postal_code, is_guest, subtotal, shipping_cost, courier, total_amount, file_method, file_link, customer_notes, status, tracking_number)
                                  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
            $stmt->execute([
                $orderId,
                $data['userId'] ?? null,
                $data['customerName'],
                preg_replace('/\D/', '', $data['customerPhoneWhatsApp']),
                $data['customerEmail'] ?? '',
                $addr['street'] ?? 'Alamat Pemesan',
                $addr['subdistrict'] ?? '',
                $addr['city'] ?? 'Jakarta',
                $addr['province'] ?? 'DKI Jakarta',
                $addr['postalCode'] ?? '',
                !empty($data['isGuest']) ? 1 : 0,
                $data['subtotal'] ?? 0,
                $data['shippingCost'] ?? 0,
                $data['courier'] ?? 'SiCepat Reguler',
                $data['totalAmount'] ?? 0,
                $data['fileMethod'] ?? 'web_upload',
                $data['fileLink'] ?? null,
                $data['customerNotes'] ?? null,
                $data['status'] ?? 'Menunggu Pembayaran',
                $data['trackingNumber'] ?? null
            ]);

            // Insert items
            if (!empty($data['items']) && is_array($data['items'])) {
                $stmtItem = $db->prepare("INSERT INTO order_items (id, order_id, product_id, product_name, category, user_photo_url, size_name, dimension_cm, paper, frame, matboard, lamination, instructions, quantity, unit_price, total_price)
                                          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
                foreach ($data['items'] as $it) {
                    $itemId = !empty($it['id']) ? $it['id'] : 'item-' . uniqid();
                    $stmtItem->execute([
                        $itemId,
                        $orderId,
                        $it['productId'] ?? 'prod-custom',
                        $it['productName'] ?? 'Cetak Foto',
                        $it['category'] ?? 'framed',
                        $it['userPhotoUrl'] ?? '',
                        $it['size']['name'] ?? 'Standar',
                        $it['size']['dimensionCm'] ?? '',
                        $it['paper'] ?? 'Silky Luster Satin 260gsm',
                        $it['frame'] ?? 'none',
                        !empty($it['matboard']) ? 1 : 0,
                        $it['lamination'] ?? 'Tanpa Laminasi',
                        $it['instructions'] ?? '',
                        $it['quantity'] ?? 1,
                        $it['unitPrice'] ?? 0,
                        $it['totalPrice'] ?? 0
                    ]);
                }
            }

            $db->commit();
            echo json_encode([
                "status" => "success",
                "message" => "Pesanan berhasil disimpan di database MySQL.",
                "orderId" => $orderId
            ]);
        } catch (Exception $e) {
            $db->rollBack();
            http_response_code(500);
            echo json_encode(["status" => "error", "message" => "Gagal menyimpan pesanan: " . $e->getMessage()]);
        }
        break;

    case 'PUT':
        // Update status atau no resi
        $data = json_decode(file_get_contents("php://input"), true);
        if (!$data || empty($data['orderId'])) {
            http_response_code(400);
            echo json_encode(["status" => "error", "message" => "Order ID wajib disertakan."]);
            exit();
        }

        $fields = [];
        $params = [];

        if (isset($data['status'])) {
            $fields[] = "status = ?";
            $params[] = $data['status'];
        }
        if (isset($data['trackingNumber'])) {
            $fields[] = "tracking_number = ?";
            $params[] = $data['trackingNumber'];
        }

        if (count($fields) > 0) {
            $params[] = $data['orderId'];
            $sql = "UPDATE orders SET " . implode(", ", $fields) . " WHERE id = ?";
            $stmt = $db->prepare($sql);
            $stmt->execute($params);
        }

        echo json_encode(["status" => "success", "message" => "Status pesanan berhasil diperbarui di database."]);
        break;

    default:
        http_response_code(405);
        echo json_encode(["status" => "error", "message" => "Method not allowed"]);
        break;
}

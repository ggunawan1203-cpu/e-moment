<?php
require_once '../config/database.php';

$database = new Database();
$db = $database->getConnection();

$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET':
        // Ambil semua produk beserta opsi ukurannya
        $query = "SELECT * FROM products ORDER BY created_at DESC";
        $stmt = $db->prepare($query);
        $stmt->execute();
        $products = $stmt->fetchAll();

        // Ambil sizes untuk setiap produk
        foreach ($products as &$prod) {
            $stmtSize = $db->prepare("SELECT id, name, dimension_cm as dimensionCm, ratio, CAST(price_delta AS FLOAT) as priceDelta FROM product_sizes WHERE product_id = ?");
            $stmtSize->execute([$prod['id']]);
            $prod['sizes'] = $stmtSize->fetchAll();

            // Cast numeric & boolean
            $prod['basePrice'] = (float)$prod['base_price'];
            $prod['inStock'] = (bool)$prod['in_stock'];
            $prod['estimatedProductionDays'] = $prod['estimated_production_days'];
            $prod['coverMockupType'] = $prod['cover_mockup_type'];
            $prod['coverAccent'] = $prod['cover_accent'];
            $prod['badgeText'] = $prod['badge_text'];

            // Supported options standard
            $prod['supportedPapers'] = [
                'Fine Art Cotton Rag Matte 310gsm',
                'Silky Luster Satin 260gsm',
                'Glossy High-Definition 260gsm'
            ];
            $prod['supportedFrames'] = ($prod['category'] === 'framed') ? ['jati', 'hitam', 'putih'] : ['none'];
            $prod['supportedLaminations'] = [
                'Tanpa Laminasi',
                'Laminasi Doff Dingin Velvet',
                'Laminasi Glossy UV Crystal'
            ];
        }

        echo json_encode(["status" => "success", "data" => $products]);
        break;

    case 'POST':
        // Tambah produk baru
        $data = json_decode(file_get_contents("php://input"), true);
        if (!$data || empty($data['name'])) {
            http_response_code(400);
            echo json_encode(["status" => "error", "message" => "Data nama produk wajib diisi."]);
            exit();
        }

        $id = !empty($data['id']) ? $data['id'] : 'prod-' . uniqid();
        $query = "INSERT INTO products (id, name, category, tagline, description, base_price, estimated_production_days, in_stock, cover_mockup_type, cover_accent, badge_text) 
                  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
        $stmt = $db->prepare($query);
        $stmt->execute([
            $id,
            $data['name'],
            $data['category'] ?? 'framed',
            $data['tagline'] ?? '',
            $data['description'] ?? '',
            $data['basePrice'] ?? 125000,
            $data['estimatedProductionDays'] ?? '2 - 3 Hari Kerja',
            isset($data['inStock']) ? ($data['inStock'] ? 1 : 0) : 1,
            $data['coverMockupType'] ?? 'framed',
            $data['coverAccent'] ?? '#8B5A2B',
            $data['badgeText'] ?? null
        ]);

        // Simpan sizes jika ada
        if (!empty($data['sizes']) && is_array($data['sizes'])) {
            $stmtSize = $db->prepare("INSERT INTO product_sizes (id, product_id, name, dimension_cm, ratio, price_delta) VALUES (?, ?, ?, ?, ?, ?)");
            foreach ($data['sizes'] as $sz) {
                $szId = !empty($sz['id']) ? $sz['id'] : 'size-' . uniqid();
                $stmtSize->execute([
                    $szId,
                    $id,
                    $sz['name'],
                    $sz['dimensionCm'] ?? ($sz['dimension_cm'] ?? '20 x 25 cm'),
                    $sz['ratio'] ?? '4:5',
                    $sz['priceDelta'] ?? 0
                ]);
            }
        }

        echo json_encode(["status" => "success", "message" => "Produk berhasil ditambahkan ke database.", "id" => $id]);
        break;

    case 'PUT':
        // Update produk (misal toggle stok atau edit info)
        $data = json_decode(file_get_contents("php://input"), true);
        if (!$data || empty($data['id'])) {
            http_response_code(400);
            echo json_encode(["status" => "error", "message" => "ID produk wajib disertakan."]);
            exit();
        }

        $fields = [];
        $params = [];

        if (isset($data['name'])) { $fields[] = "name = ?"; $params[] = $data['name']; }
        if (isset($data['inStock'])) { $fields[] = "in_stock = ?"; $params[] = $data['inStock'] ? 1 : 0; }
        if (isset($data['basePrice'])) { $fields[] = "base_price = ?"; $params[] = $data['basePrice']; }
        if (isset($data['description'])) { $fields[] = "description = ?"; $params[] = $data['description']; }
        if (isset($data['estimatedProductionDays'])) { $fields[] = "estimated_production_days = ?"; $params[] = $data['estimatedProductionDays']; }

        if (count($fields) > 0) {
            $params[] = $data['id'];
            $sql = "UPDATE products SET " . implode(", ", $fields) . " WHERE id = ?";
            $stmt = $db->prepare($sql);
            $stmt->execute($params);
        }

        echo json_encode(["status" => "success", "message" => "Produk berhasil diperbarui."]);
        break;

    case 'DELETE':
        $data = json_decode(file_get_contents("php://input"), true);
        $id = $_GET['id'] ?? ($data['id'] ?? null);
        if (!$id) {
            http_response_code(400);
            echo json_encode(["status" => "error", "message" => "ID produk wajib diisi."]);
            exit();
        }
        $stmt = $db->prepare("DELETE FROM products WHERE id = ?");
        $stmt->execute([$id]);
        echo json_encode(["status" => "success", "message" => "Produk berhasil dihapus dari database."]);
        break;

    default:
        http_response_code(405);
        echo json_encode(["status" => "error", "message" => "Method not allowed"]);
        break;
}

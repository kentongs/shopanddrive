<?php
require_once '../../config/database.php';

$database = new Database();
$db = $database->getConnection();

switch($_SERVER['REQUEST_METHOD']) {
    case 'GET':
        if(isset($_GET['id'])) {
            $stmt = $db->prepare("SELECT * FROM products WHERE id = ?");
            $stmt->execute([$_GET['id']]);
            $product = $stmt->fetch(PDO::FETCH_ASSOC);

            if($product) {
                echo json_encode($product);
            } else {
                http_response_code(404);
                echo json_encode(['message' => 'Product not found']);
            }
        } else {
            $where = "1=1";
            $params = [];

            if(isset($_GET['category'])) {
                $where .= " AND category = ?";
                $params[] = $_GET['category'];
            }

            if(isset($_GET['in_stock']) && $_GET['in_stock'] === 'true') {
                $where .= " AND in_stock = 1";
            }

            if(isset($_GET['is_promo']) && $_GET['is_promo'] === 'true') {
                $where .= " AND is_promo = 1";
            }

            if(isset($_GET['search']) && !empty($_GET['search'])) {
                $where .= " AND (name LIKE ? OR description LIKE ? OR category LIKE ?)";
                $searchTerm = '%' . $_GET['search'] . '%';
                $params[] = $searchTerm;
                $params[] = $searchTerm;
                $params[] = $searchTerm;
            }

            $limit = isset($_GET['limit']) ? (int)$_GET['limit'] : 50;

            $orderBy = "created_at DESC";
            if(isset($_GET['search']) && !empty($_GET['search'])) {
                $orderBy = "CASE WHEN name LIKE ? THEN 1 WHEN name LIKE ? THEN 2 ELSE 3 END, created_at DESC";
                array_unshift($params, $_GET['search'], '%' . $_GET['search'] . '%');
            }

            $stmt = $db->prepare("SELECT * FROM products WHERE $where ORDER BY $orderBy LIMIT $limit");
            $stmt->execute($params);
            $products = $stmt->fetchAll(PDO::FETCH_ASSOC);

            echo json_encode($products);
        }
        break;

    case 'POST':
        $data = json_decode(file_get_contents("php://input"), true);

        $id = uniqid('product_');
        $stmt = $db->prepare("
            INSERT INTO products (id, name, category, price, original_price, rating, reviews, image, description, in_stock, is_promo)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ");

        if($stmt->execute([
            $id,
            $data['name'],
            $data['category'],
            $data['price'],
            $data['originalPrice'] ?? '',
            $data['rating'] ?? 0,
            $data['reviews'] ?? 0,
            $data['image'],
            $data['description'],
            $data['inStock'] ?? true,
            $data['isPromo'] ?? false
        ])) {
            echo json_encode(['message' => 'Product created', 'id' => $id]);
        } else {
            http_response_code(500);
            echo json_encode(['message' => 'Failed to create product']);
        }
        break;

    case 'PUT':
        $data = json_decode(file_get_contents("php://input"), true);
        $id = $_GET['id'] ?? $data['id'];

        $stmt = $db->prepare("
            UPDATE products SET
                name = ?, category = ?, price = ?, original_price = ?, rating = ?,
                reviews = ?, image = ?, description = ?, in_stock = ?, is_promo = ?
            WHERE id = ?
        ");

        if($stmt->execute([
            $data['name'],
            $data['category'],
            $data['price'],
            $data['originalPrice'] ?? '',
            $data['rating'] ?? 0,
            $data['reviews'] ?? 0,
            $data['image'],
            $data['description'],
            $data['inStock'] ?? true,
            $data['isPromo'] ?? false,
            $id
        ])) {
            echo json_encode(['message' => 'Product updated']);
        } else {
            http_response_code(500);
            echo json_encode(['message' => 'Failed to update product']);
        }
        break;

    case 'DELETE':
        $id = $_GET['id'];

        $stmt = $db->prepare("DELETE FROM products WHERE id = ?");
        if($stmt->execute([$id])) {
            echo json_encode(['message' => 'Product deleted']);
        } else {
            http_response_code(500);
            echo json_encode(['message' => 'Failed to delete product']);
        }
        break;

    default:
        http_response_code(405);
        echo json_encode(['message' => 'Method not allowed']);
        break;
}
?>

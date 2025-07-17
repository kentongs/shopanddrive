<?php
require_once '../../config/database.php';

$database = new Database();
$db = $database->getConnection();

switch($_SERVER['REQUEST_METHOD']) {
    case 'GET':
        // Get all promos or single promo
        if(isset($_GET['id'])) {
            $stmt = $db->prepare("SELECT * FROM promos WHERE id = ?");
            $stmt->execute([$_GET['id']]);
            $promo = $stmt->fetch(PDO::FETCH_ASSOC);

            if($promo) {
                echo json_encode($promo);
            } else {
                http_response_code(404);
                echo json_encode(['message' => 'Promo not found']);
            }
        } else {
            // Get all promos with filters
            $where = "1=1";
            $params = [];

            if(isset($_GET['status'])) {
                $where .= " AND status = ?";
                $params[] = $_GET['status'];
            }

            if(isset($_GET['search']) && !empty($_GET['search'])) {
                $where .= " AND (title LIKE ? OR description LIKE ?)";
                $searchTerm = '%' . $_GET['search'] . '%';
                $params[] = $searchTerm;
                $params[] = $searchTerm;
            }

            $orderBy = "created_at DESC";
            if(isset($_GET['search']) && !empty($_GET['search'])) {
                // Prioritize exact matches in title
                $orderBy = "CASE WHEN title LIKE ? THEN 1 WHEN title LIKE ? THEN 2 ELSE 3 END, created_at DESC";
                array_unshift($params, $_GET['search'], '%' . $_GET['search'] . '%');
            }

            $stmt = $db->prepare("SELECT * FROM promos WHERE $where ORDER BY $orderBy");
            $stmt->execute($params);
            $promos = $stmt->fetchAll(PDO::FETCH_ASSOC);

            echo json_encode($promos);
        }
        break;

    case 'POST':
        // Create new promo
        $data = json_decode(file_get_contents("php://input"), true);

        $id = uniqid('promo_');
        $stmt = $db->prepare("
            INSERT INTO promos (id, title, description, discount, valid_until, status, image, original_price, discount_price)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        ");

        if($stmt->execute([
            $id,
            $data['title'],
            $data['description'],
            $data['discount'],
            $data['validUntil'],
            $data['status'],
            $data['image'],
            $data['originalPrice'] ?? '',
            $data['discountPrice']
        ])) {
            echo json_encode(['message' => 'Promo created', 'id' => $id]);
        } else {
            http_response_code(500);
            echo json_encode(['message' => 'Failed to create promo']);
        }
        break;

    case 'PUT':
        // Update promo
        $data = json_decode(file_get_contents("php://input"), true);
        $id = $_GET['id'] ?? $data['id'];

        $stmt = $db->prepare("
            UPDATE promos SET
                title = ?, description = ?, discount = ?, valid_until = ?,
                status = ?, image = ?, original_price = ?, discount_price = ?
            WHERE id = ?
        ");

        if($stmt->execute([
            $data['title'],
            $data['description'],
            $data['discount'],
            $data['validUntil'],
            $data['status'],
            $data['image'],
            $data['originalPrice'] ?? '',
            $data['discountPrice'],
            $id
        ])) {
            echo json_encode(['message' => 'Promo updated']);
        } else {
            http_response_code(500);
            echo json_encode(['message' => 'Failed to update promo']);
        }
        break;

    case 'DELETE':
        // Delete promo
        $id = $_GET['id'];

        $stmt = $db->prepare("DELETE FROM promos WHERE id = ?");
        if($stmt->execute([$id])) {
            echo json_encode(['message' => 'Promo deleted']);
        } else {
            http_response_code(500);
            echo json_encode(['message' => 'Failed to delete promo']);
        }
        break;

    default:
        http_response_code(405);
        echo json_encode(['message' => 'Method not allowed']);
        break;
}
?>

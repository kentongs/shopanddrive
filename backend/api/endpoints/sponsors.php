<?php
require_once '../../config/database.php';

$database = new Database();
$db = $database->getConnection();

switch($_SERVER['REQUEST_METHOD']) {
    case 'GET':
        // Get sponsors
        if(isset($_GET['id'])) {
            $stmt = $db->prepare("SELECT * FROM sponsors WHERE id = ?");
            $stmt->execute([$_GET['id']]);
            $sponsor = $stmt->fetch(PDO::FETCH_ASSOC);
            
            if($sponsor) {
                echo json_encode($sponsor);
            } else {
                http_response_code(404);
                echo json_encode(['message' => 'Sponsor not found']);
            }
        } else {
            $where = "1=1";
            $params = [];
            
            if(isset($_GET['active']) && $_GET['active'] === 'true') {
                $where .= " AND is_active = 1";
            }
            
            $stmt = $db->prepare("SELECT * FROM sponsors WHERE $where ORDER BY order_index ASC, name ASC");
            $stmt->execute($params);
            $sponsors = $stmt->fetchAll(PDO::FETCH_ASSOC);
            
            echo json_encode($sponsors);
        }
        break;
        
    case 'POST':
        // Create new sponsor
        $data = json_decode(file_get_contents("php://input"), true);
        
        $id = uniqid('sponsor_');
        $stmt = $db->prepare("
            INSERT INTO sponsors (id, name, logo, category, website, description, is_active, order_index)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        ");
        
        if($stmt->execute([
            $id,
            $data['name'],
            $data['logo'],
            $data['category'],
            $data['website'] ?? '',
            $data['description'] ?? '',
            $data['isActive'] ?? true,
            $data['order'] ?? 0
        ])) {
            echo json_encode(['message' => 'Sponsor created', 'id' => $id]);
        } else {
            http_response_code(500);
            echo json_encode(['message' => 'Failed to create sponsor']);
        }
        break;
        
    case 'PUT':
        // Update sponsor
        $data = json_decode(file_get_contents("php://input"), true);
        $id = $_GET['id'] ?? $data['id'];
        
        $stmt = $db->prepare("
            UPDATE sponsors SET 
                name = ?, logo = ?, category = ?, website = ?, 
                description = ?, is_active = ?, order_index = ?
            WHERE id = ?
        ");
        
        if($stmt->execute([
            $data['name'],
            $data['logo'],
            $data['category'],
            $data['website'] ?? '',
            $data['description'] ?? '',
            $data['isActive'] ?? true,
            $data['order'] ?? 0,
            $id
        ])) {
            echo json_encode(['message' => 'Sponsor updated']);
        } else {
            http_response_code(500);
            echo json_encode(['message' => 'Failed to update sponsor']);
        }
        break;
        
    case 'DELETE':
        // Delete sponsor
        $id = $_GET['id'];
        
        $stmt = $db->prepare("DELETE FROM sponsors WHERE id = ?");
        if($stmt->execute([$id])) {
            echo json_encode(['message' => 'Sponsor deleted']);
        } else {
            http_response_code(500);
            echo json_encode(['message' => 'Failed to delete sponsor']);
        }
        break;
        
    default:
        http_response_code(405);
        echo json_encode(['message' => 'Method not allowed']);
        break;
}
?>

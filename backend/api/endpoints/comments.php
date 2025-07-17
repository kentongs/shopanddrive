<?php
require_once '../../config/database.php';

$database = new Database();
$db = $database->getConnection();

switch($_SERVER['REQUEST_METHOD']) {
    case 'GET':
        if(isset($_GET['content_id']) && isset($_GET['content_type'])) {
            // Get comments for specific content
            $status_filter = isset($_GET['status']) ? $_GET['status'] : 'approved';
            
            $stmt = $db->prepare("
                SELECT * FROM comments 
                WHERE content_id = ? AND content_type = ? AND status = ?
                ORDER BY created_at DESC
            ");
            $stmt->execute([$_GET['content_id'], $_GET['content_type'], $status_filter]);
            $comments = $stmt->fetchAll(PDO::FETCH_ASSOC);
            
            echo json_encode($comments);
        } else {
            // Get all comments (admin)
            $where = "1=1";
            $params = [];
            
            if(isset($_GET['status'])) {
                $where .= " AND status = ?";
                $params[] = $_GET['status'];
            }
            
            if(isset($_GET['unread']) && $_GET['unread'] === 'true') {
                $where .= " AND is_read = 0";
            }
            
            $stmt = $db->prepare("SELECT * FROM comments WHERE $where ORDER BY created_at DESC");
            $stmt->execute($params);
            $comments = $stmt->fetchAll(PDO::FETCH_ASSOC);
            
            echo json_encode($comments);
        }
        break;
        
    case 'POST':
        // Create new comment
        $data = json_decode(file_get_contents("php://input"), true);
        
        $id = uniqid('comment_');
        $stmt = $db->prepare("
            INSERT INTO comments (id, content_id, content_type, author_name, author_email, author_avatar, 
                                is_google_auth, google_user_id, content, parent_id, status)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ");
        
        if($stmt->execute([
            $id,
            $data['contentId'],
            $data['contentType'],
            $data['authorName'],
            $data['authorEmail'] ?? '',
            $data['authorAvatar'] ?? '',
            $data['isGoogleAuth'] ?? false,
            $data['googleUserId'] ?? '',
            $data['content'],
            $data['parentId'] ?? null,
            'pending' // Default to pending for moderation
        ])) {
            echo json_encode(['message' => 'Comment created', 'id' => $id]);
        } else {
            http_response_code(500);
            echo json_encode(['message' => 'Failed to create comment']);
        }
        break;
        
    case 'PUT':
        // Update comment (approve/reject)
        $data = json_decode(file_get_contents("php://input"), true);
        $id = $_GET['id'] ?? $data['id'];
        
        $fields = [];
        $values = [];
        
        if(isset($data['status'])) {
            $fields[] = "status = ?";
            $values[] = $data['status'];
        }
        
        if(isset($data['isRead'])) {
            $fields[] = "is_read = ?";
            $values[] = $data['isRead'];
        }
        
        $values[] = $id;
        
        $stmt = $db->prepare("UPDATE comments SET " . implode(', ', $fields) . " WHERE id = ?");
        
        if($stmt->execute($values)) {
            echo json_encode(['message' => 'Comment updated']);
        } else {
            http_response_code(500);
            echo json_encode(['message' => 'Failed to update comment']);
        }
        break;
        
    case 'DELETE':
        $id = $_GET['id'];
        
        $stmt = $db->prepare("DELETE FROM comments WHERE id = ?");
        if($stmt->execute([$id])) {
            echo json_encode(['message' => 'Comment deleted']);
        } else {
            http_response_code(500);
            echo json_encode(['message' => 'Failed to delete comment']);
        }
        break;
        
    default:
        http_response_code(405);
        echo json_encode(['message' => 'Method not allowed']);
        break;
}
?>

<?php
require_once '../../config/database.php';

$database = new Database();
$db = $database->getConnection();

switch($_SERVER['REQUEST_METHOD']) {
    case 'GET':
        if(isset($_GET['id'])) {
            $stmt = $db->prepare("SELECT * FROM articles WHERE id = ?");
            $stmt->execute([$_GET['id']]);
            $article = $stmt->fetch(PDO::FETCH_ASSOC);

            if($article) {
                echo json_encode($article);
            } else {
                http_response_code(404);
                echo json_encode(['message' => 'Article not found']);
            }
        } else {
            $where = "1=1";
            $params = [];

            if(isset($_GET['status'])) {
                $where .= " AND status = ?";
                $params[] = $_GET['status'];
            }

            if(isset($_GET['category'])) {
                $where .= " AND category = ?";
                $params[] = $_GET['category'];
            }

            if(isset($_GET['search']) && !empty($_GET['search'])) {
                $where .= " AND (title LIKE ? OR excerpt LIKE ? OR content LIKE ? OR author LIKE ?)";
                $searchTerm = '%' . $_GET['search'] . '%';
                $params[] = $searchTerm;
                $params[] = $searchTerm;
                $params[] = $searchTerm;
                $params[] = $searchTerm;
            }

            $limit = isset($_GET['limit']) ? (int)$_GET['limit'] : 50;

            $orderBy = "created_at DESC";
            if(isset($_GET['search']) && !empty($_GET['search'])) {
                $orderBy = "CASE WHEN title LIKE ? THEN 1 WHEN title LIKE ? THEN 2 ELSE 3 END, created_at DESC";
                array_unshift($params, $_GET['search'], '%' . $_GET['search'] . '%');
            }

            $stmt = $db->prepare("SELECT * FROM articles WHERE $where ORDER BY $orderBy LIMIT $limit");
            $stmt->execute($params);
            $articles = $stmt->fetchAll(PDO::FETCH_ASSOC);

            echo json_encode($articles);
        }
        break;

    case 'POST':
        $data = json_decode(file_get_contents("php://input"), true);

        $id = uniqid('article_');
        $stmt = $db->prepare("
            INSERT INTO articles (id, title, excerpt, content, date, author, category, read_time, image, status)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ");

        if($stmt->execute([
            $id,
            $data['title'],
            $data['excerpt'],
            $data['content'],
            $data['date'],
            $data['author'],
            $data['category'],
            $data['readTime'],
            $data['image'],
            $data['status'] ?? 'published'
        ])) {
            echo json_encode(['message' => 'Article created', 'id' => $id]);
        } else {
            http_response_code(500);
            echo json_encode(['message' => 'Failed to create article']);
        }
        break;

    case 'PUT':
        $data = json_decode(file_get_contents("php://input"), true);
        $id = $_GET['id'] ?? $data['id'];

        $stmt = $db->prepare("
            UPDATE articles SET
                title = ?, excerpt = ?, content = ?, date = ?, author = ?,
                category = ?, read_time = ?, image = ?, status = ?
            WHERE id = ?
        ");

        if($stmt->execute([
            $data['title'],
            $data['excerpt'],
            $data['content'],
            $data['date'],
            $data['author'],
            $data['category'],
            $data['readTime'],
            $data['image'],
            $data['status'],
            $id
        ])) {
            echo json_encode(['message' => 'Article updated']);
        } else {
            http_response_code(500);
            echo json_encode(['message' => 'Failed to update article']);
        }
        break;

    case 'DELETE':
        $id = $_GET['id'];

        $stmt = $db->prepare("DELETE FROM articles WHERE id = ?");
        if($stmt->execute([$id])) {
            echo json_encode(['message' => 'Article deleted']);
        } else {
            http_response_code(500);
            echo json_encode(['message' => 'Failed to delete article']);
        }
        break;

    default:
        http_response_code(405);
        echo json_encode(['message' => 'Method not allowed']);
        break;
}
?>

<?php
require_once '../../config/database.php';

$database = new Database();
$db = $database->getConnection();

switch($_SERVER['REQUEST_METHOD']) {
    case 'GET':
        // Get settings
        $stmt = $db->prepare("SELECT * FROM settings ORDER BY id DESC LIMIT 1");
        $stmt->execute();
        $settings = $stmt->fetch(PDO::FETCH_ASSOC);
        
        if($settings) {
            echo json_encode($settings);
        } else {
            // Return default settings if none exist
            echo json_encode([
                'site_name' => 'Shop and Drive Taman Tekno',
                'site_description' => 'Solusi terpercaya untuk kebutuhan otomotif Anda',
                'logo' => '/placeholder.svg',
                'contact_phone' => '08995555095',
                'contact_email' => 'info@shopanddrive.com',
                'address' => 'Jl. Rawa Buntu Raya No. 61 A, Ciater, Tangerang Selatan',
                'social_whatsapp' => '628995555095',
                'social_facebook' => '',
                'social_instagram' => ''
            ]);
        }
        break;
        
    case 'POST':
    case 'PUT':
        // Update settings
        $data = json_decode(file_get_contents("php://input"), true);
        
        // Check if settings exist
        $stmt = $db->prepare("SELECT id FROM settings LIMIT 1");
        $stmt->execute();
        $existing = $stmt->fetch();
        
        if($existing) {
            // Update existing settings
            $stmt = $db->prepare("
                UPDATE settings SET 
                    site_name = ?, site_description = ?, logo = ?, contact_phone = ?, 
                    contact_email = ?, address = ?, social_whatsapp = ?, 
                    social_facebook = ?, social_instagram = ?
                WHERE id = ?
            ");
            
            $result = $stmt->execute([
                $data['siteName'],
                $data['siteDescription'],
                $data['logo'],
                $data['contactPhone'],
                $data['contactEmail'],
                $data['address'],
                $data['socialMedia']['whatsapp'],
                $data['socialMedia']['facebook'] ?? '',
                $data['socialMedia']['instagram'] ?? '',
                $existing['id']
            ]);
        } else {
            // Insert new settings
            $stmt = $db->prepare("
                INSERT INTO settings (site_name, site_description, logo, contact_phone, 
                                    contact_email, address, social_whatsapp, social_facebook, social_instagram)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
            ");
            
            $result = $stmt->execute([
                $data['siteName'],
                $data['siteDescription'],
                $data['logo'],
                $data['contactPhone'],
                $data['contactEmail'],
                $data['address'],
                $data['socialMedia']['whatsapp'],
                $data['socialMedia']['facebook'] ?? '',
                $data['socialMedia']['instagram'] ?? ''
            ]);
        }
        
        if($result) {
            echo json_encode(['message' => 'Settings updated']);
        } else {
            http_response_code(500);
            echo json_encode(['message' => 'Failed to update settings']);
        }
        break;
        
    default:
        http_response_code(405);
        echo json_encode(['message' => 'Method not allowed']);
        break;
}
?>

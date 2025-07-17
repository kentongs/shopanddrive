# 🚀 Backend Deployment Guide

## 📋 **Setup Database di cPanel**

### **LANGKAH 1: Buat Database MySQL**

1. **Login ke cPanel**
2. **Cari "MySQL Databases"**
3. **Buat Database Baru**

   - Database Name: `shopanddrive_db`
   - Klik "Create Database"

4. **Buat User Database**

   - Username: `shopanddrive_user`
   - Password: (buat password yang kuat)
   - Klik "Create User"

5. **Assign User ke Database**
   - Pilih user dan database yang baru dibuat
   - Berikan "ALL PRIVILEGES"
   - Klik "Make Changes"

### **LANGKAH 2: Import Database Structure**

1. **Buka phpMyAdmin** (dari cPanel)
2. **Pilih database** `shopanddrive_db`
3. **Klik tab "Import"**
4. **Upload file** `backend/database/setup.sql`
5. **Klik "Go"** untuk menjalankan script

## 📁 **Upload Backend Files**

### **LANGKAH 3: Siapkan Struktur Folder**

Di `public_html/`, buat struktur folder:

```
public_html/
├── api/
│   ├── index.php
│   └── endpoints/
│       ├── promos.php
│       ├── articles.php
│       ├── products.php
│       ├── sponsors.php
│       ├── comments.php
│       └── settings.php
├── config/
│   └── database.php
└── (frontend files...)
```

### **LANGKAH 4: Upload Backend Files**

1. **Upload folder `backend/`** ke `public_html/`
2. **Rename folder** dari `backend/` menjadi struktur di atas
3. **Edit file** `config/database.php`:

```php
private $host = 'localhost';
private $db_name = 'namauser_shopanddrive_db'; // Format: cpanel_user_db_name
private $username = 'namauser_shopanddrive_user';
private $password = 'password_database_anda';
```

### **LANGKAH 5: Set Permissions**

- **Folder api/**: 755
- **File PHP**: 644
- **Folder config/**: 755

## 🔧 **Konfigurasi Frontend untuk Production**

### **LANGKAH 6: Setup Environment Variables**

1. **Copy** `.env.example` ke `.env`
2. **Edit** `.env`:

```env
VITE_API_URL=https://yourdomain.com/api
VITE_USE_API=true
```

### **LANGKAH 7: Update Frontend Service**

Edit `client/services/database.ts` untuk menggunakan API service:

```typescript
// Ganti import database dengan API service
import { apiService } from "./api";

// Ganti semua calls ke db dengan apiService
const promos = await apiService.getActivePromos();
const sponsors = await apiService.getActiveSponsors();
// dst...
```

### **LANGKAH 8: Build dan Deploy Frontend**

```bash
# Build dengan API enabled
VITE_USE_API=true npm run build

# Upload dist/spa/ ke public_html/
```

## 🧪 **Testing API**

### **Test Endpoints**

1. **Test Sponsors**: `https://yourdomain.com/api/sponsors`
2. **Test Promos**: `https://yourdomain.com/api/promos?status=active`
3. **Test Articles**: `https://yourdomain.com/api/articles?status=published`

### **Expected Response**

```json
[
  {
    "id": "sponsor1",
    "name": "Castrol",
    "logo": "https://via.placeholder.com/120x60/FF4500/FFFFFF?text=CASTROL",
    "category": "Oil Partner",
    "website": "https://castrol.com",
    "description": "Premium motor oil and lubricants",
    "is_active": "1",
    "order_index": "1"
  }
]
```

## 🔐 **Security Settings**

### **LANGKAH 9: Secure API**

1. **Edit** `config/database.php` untuk production security
2. **Add rate limiting** (optional)
3. **Enable HTTPS** untuk API calls

### **LANGKAH 10: Admin Panel Security**

1. **Buat folder** `admin/` yang password protected
2. **Setup** `.htaccess` untuk admin area:

```apache
AuthType Basic
AuthName "Admin Area"
AuthUserFile /path/to/.htpasswd
Require valid-user
```

## 🎯 **Testing Checklist**

✅ Database connection berhasil
✅ API endpoints return data
✅ Frontend dapat fetch data dari API  
✅ CORS headers working
✅ Admin operations working
✅ Comment system working
✅ Sponsor management working

## 🚨 **Troubleshooting**

### **Problem: 500 Internal Server Error**

- Check error logs di cPanel
- Verify database credentials
- Check file permissions

### **Problem: CORS Error**

- Verify CORS headers di `config/database.php`
- Check API URL di frontend

### **Problem: Database Connection Failed**

- Verify database name format: `cpanel_user_database_name`
- Check username/password
- Ensure user has proper privileges

### **Problem: API Returns Empty**

- Check if sample data imported correctly
- Verify SQL queries in endpoints
- Check database table names

## 🎉 **Success!**

Setelah semua langkah selesai:

- Website menggunakan database MySQL yang sesungguhnya
- Admin dapat manage data melalui API
- Data persistent dan tidak hilang saat refresh
- Website siap untuk production use

---

**📞 Need Help?**
Jika ada masalah, check:

1. cPanel Error Logs
2. Browser DevTools Console
3. Network tab untuk API calls
4. Database structure di phpMyAdmin

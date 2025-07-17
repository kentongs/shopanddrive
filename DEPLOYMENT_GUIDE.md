# 🚀 Complete Deployment Guide: Netlify + Render + Supabase

## 📋 **Overview**

Stack yang akan digunakan:

- **Frontend**: Netlify (Static hosting)
- **Backend**: Render (Node.js API)
- **Database**: Supabase (PostgreSQL)
- **Images**: Cloudinary (CDN)

---

## 🗄️ **STEP 1: Setup Supabase Database**

### A. Create Supabase Account

1. **Go to** [supabase.com](https://supabase.com)
2. **Sign up** with GitHub/Google
3. **Create new project**:
   - Organization: Personal (or create new)
   - Project name: `shop-drive-db`
   - Database password: Generate strong password
   - Region: Choose closest to your users

### B. Setup Database Schema

1. **Wait** for project to be ready (2-3 minutes)
2. **Go to** SQL Editor in Supabase dashboard
3. **Copy paste** content from `supabase/schema.sql`
4. **Click "Run"** to execute schema
5. **Verify** tables created in Table Editor

### C. Get Connection Details

1. **Go to** Project Settings → API
2. **Copy these values**:
   ```
   Project URL: https://xxx.supabase.co
   anon key: eyJ...
   service_role key: eyJ... (keep secret!)
   ```

---

## 🔧 **STEP 2: Deploy Backend to Render**

### A. Prepare Backend Code

1. **Upload** `backend-node/` folder to GitHub repository
2. **Or create new repo** specifically for backend

### B. Create Render Account

1. **Go to** [render.com](https://render.com)
2. **Sign up** with GitHub
3. **Connect** your GitHub account

### C. Deploy Web Service

1. **Click** "New +" → "Web Service"
2. **Connect** your backend repository
3. **Configure**:
   ```
   Name: shop-drive-api
   Environment: Node
   Build Command: npm install
   Start Command: npm start
   Instance Type: Free (for testing)
   ```

### D. Set Environment Variables

In Render dashboard, go to Environment:

```bash
NODE_ENV=production
SUPABASE_URL=https://xxx.supabase.co
SUPABASE_SERVICE_KEY=eyJ... (service_role key from Supabase)
FRONTEND_URL=https://your-site-name.netlify.app
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

### E. Get Backend URL

After deployment completes:

```
Your API URL: https://shop-drive-api-xxx.onrender.com
Test: https://shop-drive-api-xxx.onrender.com/health
```

---

## 🌐 **STEP 3: Deploy Frontend to Netlify**

### A. Update Environment Variables

1. **Edit** `.env.production`:
   ```env
   VITE_API_URL=https://shop-drive-api-xxx.onrender.com/api
   VITE_USE_API=true
   VITE_SUPABASE_URL=https://xxx.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJ... (anon key from Supabase)
   ```

### B. Create Netlify Account

1. **Go to** [netlify.com](https://netlify.com)
2. **Sign up** with GitHub
3. **Connect** your GitHub account

### C. Deploy Site

**Option 1: Git-based deployment (Recommended)**

1. **Push** your code to GitHub repository
2. **In Netlify**: "New site from Git"
3. **Choose** your repository
4. **Configure**:
   ```
   Build command: npm run build
   Publish directory: dist/spa
   ```

**Option 2: Manual deployment**

1. **Build locally**:
   ```bash
   npm run build
   ```
2. **Drag & drop** `dist/spa` folder to Netlify

### D. Configure Environment Variables

In Netlify dashboard → Site settings → Environment variables:

```bash
VITE_API_URL=https://shop-drive-api-xxx.onrender.com/api
VITE_USE_API=true
VITE_SUPABASE_URL=https://xxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJ...
VITE_ENVIRONMENT=production
```

### E. Custom Domain (Optional)

1. **Go to** Domain settings
2. **Add** custom domain
3. **Configure** DNS records as instructed

---

## 🖼️ **STEP 4: Setup Cloudinary (Image Storage)**

### A. Create Cloudinary Account

1. **Go to** [cloudinary.com](https://cloudinary.com)
2. **Sign up** for free account
3. **Get** credentials from dashboard

### B. Configure Upload Settings

1. **Go to** Settings → Upload
2. **Enable** "Use filename as Public ID"
3. **Set** upload presets if needed

### C. Update Backend ENV

Add to Render environment variables:

```bash
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

---

## ✅ **STEP 5: Testing & Verification**

### A. Test API Endpoints

```bash
# Test health
curl https://shop-drive-api-xxx.onrender.com/health

# Test sponsors
curl https://shop-drive-api-xxx.onrender.com/api/sponsors?active=true

# Test promos
curl https://shop-drive-api-xxx.onrender.com/api/promos?status=active
```

### B. Test Frontend

1. **Visit** your Netlify URL
2. **Check** that data loads correctly
3. **Test** search functionality
4. **Test** comment system
5. **Test** admin panel (if applicable)

### C. Test Image Upload

1. **Go to** admin panel
2. **Try** uploading sponsor logo
3. **Verify** image appears correctly

---

## 🔐 **STEP 6: Security & Performance**

### A. Environment Security

- ✅ **Never** commit `.env` files
- ✅ **Use** environment variables for all secrets
- ✅ **Rotate** API keys regularly

### B. Database Security

1. **Enable** Row Level Security in Supabase
2. **Review** RLS policies
3. **Monitor** API usage

### C. Performance Optimization

1. **Enable** CDN caching
2. **Optimize** images in Cloudinary
3. **Monitor** Core Web Vitals

---

## 🎯 **STEP 7: Production Checklist**

### Pre-Launch

- [ ] Database schema deployed
- [ ] Sample data inserted
- [ ] Backend API responding
- [ ] Frontend building successfully
- [ ] Environment variables set
- [ ] Image upload working
- [ ] Search functionality working
- [ ] Mobile responsive tested

### Post-Launch

- [ ] Custom domain configured
- [ ] SSL certificate active
- [ ] Analytics configured
- [ ] Error monitoring setup
- [ ] Backup strategy implemented
- [ ] Documentation updated

---

## 🚨 **Troubleshooting Common Issues**

### "API calls failing"

- Check CORS settings in backend
- Verify API URL in frontend env
- Check network tab in browser

### "Database connection failed"

- Verify Supabase credentials
- Check RLS policies
- Ensure service key is used for admin operations

### "Images not uploading"

- Check Cloudinary credentials
- Verify file size limits
- Check CORS settings

### "Site not updating"

- Clear browser cache
- Check build logs in Netlify
- Verify environment variables

---

## 📞 **Support Resources**

- **Supabase Docs**: [supabase.com/docs](https://supabase.com/docs)
- **Render Docs**: [render.com/docs](https://render.com/docs)
- **Netlify Docs**: [docs.netlify.com](https://docs.netlify.com)
- **Cloudinary Docs**: [cloudinary.com/documentation](https://cloudinary.com/documentation)

---

## 🎉 **Success!**

After completing all steps, your website will be:

- ✅ **Live** on custom domain
- ✅ **Scalable** with cloud infrastructure
- ✅ **Fast** with CDN optimization
- ✅ **Secure** with proper authentication
- ✅ **Professional** with real database
- ✅ **SEO-friendly** with proper meta tags

**Your modern automotive website is now ready for production! 🚀**

---

## 💰 **Cost Breakdown (Monthly)**

| Service        | Free Tier                | Paid Plans                     |
| -------------- | ------------------------ | ------------------------------ |
| **Supabase**   | 500MB DB, 2GB bandwidth  | $25/month Pro                  |
| **Render**     | 750hrs/month free        | $7/month                       |
| **Netlify**    | 100GB bandwidth          | $19/month Pro                  |
| **Cloudinary** | 25k images, 25GB storage | $89/month Plus                 |
| **Total**      | **FREE** for small sites | **~$140/month** for enterprise |

**Recommendation**: Start with free tiers, upgrade as you grow! 💡

# VERCEL + RENDER DEPLOYMENT GUIDE

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                      USER BROWSER                           │
└────────────────┬──────────────────────┬─────────────────────┘
                 │                      │
         VITE_API_URL                Frontend App
         (API calls)                 (React/CSS)
                 │                      │
    ┌────────────▼──────────┐  ┌────────▼─────────────┐
    │  Render Backend       │  │  Vercel Frontend     │
    │  (Flask API)          │  │  (Static Site)       │
    │  https://iapt-       │  │  https://iapt-       │
    │  backend.onrender..  │  │  frontend.vercel.app │
    └────────────┬──────────┘  └──────────────────────┘
                 │
        ┌────────▼────────┐
        │  SQLite DB      │
        │  (Render)       │
        └─────────────────┘
```

## Deployment Summary

| Component | Platform | Build Time | Cost |
|-----------|----------|-----------|------|
| Backend (Flask) | Render | ~1-2 min | Free/Starter |
| Frontend (React) | Vercel | ~30-60 sec | Free |
| Database (SQLite) | Render | Auto | Included |

---

## Part 1: Deploy Backend to Render

### Step 1: Create Render Web Service

1. Go to https://dashboard.render.com
2. Click **"New +"** → **"Web Service"**
3. Select **GitHub repository**: `AshishForCode/IAPT-Minor-Project`
4. Click **"Connect"**

### Step 2: Configure Backend Service

Fill in the following:

| Setting | Value |
|---------|-------|
| **Name** | `iapt-backend` |
| **Environment** | Python |
| **Build Command** | `pip install -r backend/requirements-deploy.txt` |
| **Start Command** | `gunicorn backend.wsgi:app --chdir backend --workers 3 --bind 0.0.0.0:${PORT}` |
| **Region** | Choose closest to your users |
| **Instance Type** | Free (recommended) or Starter |
| **Branch** | `main` |

### Step 3: Add Environment Variables

Click **"Advanced"** and add these environment variables:

```
SECRET_KEY = super-secret-jwt-key-change-this-in-production
MYSQL_DB = iapt_db
```

### Step 4: Deploy

1. Click **"Create Web Service"**
2. Wait for deployment to complete (~2 minutes)
3. Once deployed, you'll get a URL like: `https://iapt-backend.onrender.com`
4. **Note this URL** - you'll need it for the frontend configuration

### Verify Backend is Working

```bash
# Test backend health
curl https://iapt-backend.onrender.com/
# Response: "Welcome to IAPT Backend API"

# Test registration endpoint
curl -X POST https://iapt-backend.onrender.com/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "password123",
    "college": "Test College",
    "branch": "CSE",
    "year": 2024
  }'
```

---

## Part 2: Deploy Frontend to Vercel

### Step 1: Connect to Vercel

1. Go to https://vercel.com
2. Click **"Dashboard"**
3. Click **"New Project"**
4. Click **"Import Git Repository"**
5. Select **GitHub** as the source
6. Find and select: `AshishForCode/IAPT-Minor-Project`
7. Click **"Import"**

### Step 2: Configure Frontend Project

In the **"Configure Project"** screen:

**Root Directory:** Select **`./frontend`** from dropdown

**Environment Variables:**

Add this environment variable:
```
VITE_API_URL = https://iapt-backend.onrender.com/api
```

Replace `iapt-backend` with your actual Render backend service name if different.

### Step 3: Build Settings

Vercel should auto-detect, but verify:

| Setting | Value |
|---------|-------|
| **Framework Preset** | Vite |
| **Build Command** | `npm run build` |
| **Output Directory** | `dist` |
| **Install Command** | `npm install` |

### Step 4: Deploy

1. Click **"Deploy"**
2. Wait for build and deployment (~1 minute)
3. Once complete, you'll get a URL like: `https://iapt-frontend.vercel.app`
4. Visit this URL to access your application

---

## Part 3: Connect Frontend to Backend

### Automatic Connection

The environment variable `VITE_API_URL` you set in Vercel will automatically be used by the frontend to connect to your Render backend.

### Verify Connection

1. Open your frontend: `https://iapt-frontend.vercel.app`
2. You should see the login page
3. Try registering a new user:
   - Click "Register here"
   - Fill in the form
   - Click "Register"
   - You should see success message
4. Try logging in with your test credentials
5. Dashboard should load with data from backend

---

## Updating Deployment

### When You Push to GitHub

Both services have **automatic deployments** enabled:

1. **Push code to `main` branch**
   ```bash
   git add .
   git commit -m "Your changes"
   git push origin main
   ```

2. **Render Backend** automatically redeploys
   - Watch logs at: https://dashboard.render.com

3. **Vercel Frontend** automatically redeploys
   - Watch logs at: https://vercel.com/dashboard

---

## Troubleshooting

### Frontend won't load

**Problem:** Blank white screen or 404 errors

**Solutions:**
1. Check Vercel logs: Dashboard → Your Project → Deployments
2. Open browser console (F12) for errors
3. Verify `VITE_API_URL` is set correctly in Vercel environment variables
4. Check that backend service is running: `curl https://iapt-backend.onrender.com/`

### Backend returns errors

**Problem:** API calls fail with 500 errors

**Solutions:**
1. Check Render logs: Dashboard → Your Service → Logs
2. Verify all environment variables are set
3. Check database connection: Look for "iapt.db" initialization
4. Check ML model exists: Backend should load `model.pkl`

### CORS errors in browser

**Problem:** "Access to XMLHttpRequest from origin blocked by CORS"

**Solutions:**
- Frontend and backend have different origins (different domains)
- CORS is already enabled in Flask (`Flask-Cors`)
- This should work automatically
- If still having issues, check browser console for exact error

### Database errors

**Problem:** "Database connection failed"

**Solutions:**
1. SQLite file is created automatically on first run
2. Data persists across deployments on Render
3. If you need to reset database, restart the service in Render dashboard
4. For production, migrate to PostgreSQL: https://render.com/docs/databases

---

## URLs Reference

After deployment, you'll have:

```
Frontend: https://iapt-frontend.vercel.app
Backend API: https://iapt-backend.onrender.com
Backend Health Check: https://iapt-backend.onrender.com/
```

### API Endpoints

All endpoints require JWT token except register/login:

```
POST   /api/auth/register              - Create account
POST   /api/auth/login                 - Login (returns token)
GET    /api/dashboard/summary          - Dashboard data
GET    /api/timetable                  - Get schedule
POST   /api/timetable                  - Add class
GET    /api/studyplan/generate         - Get AI study plan
GET    /api/placement/applications     - Get applications
POST   /api/placement/applications     - Log application
GET    /api/mocktests                  - Get available tests
GET    /api/mocktests/<id>/questions   - Get test questions
POST   /api/mocktests/<id>/submit      - Submit answers
GET    /api/resources                  - Get study resources
```

---

## Performance Optimization

### Frontend (Vercel)

- Deployed on **Vercel's global edge network** (very fast)
- Automatic CDN caching
- Free SSL/TLS certificate
- Unlimited bandwidth

### Backend (Render)

- Deployed on standard Render servers
- If you need more performance:
  - Upgrade from Free to Starter tier
  - Render starts sleeping after 15 minutes of inactivity (Free tier)
  - Starter tier keeps instance running

### Database (SQLite on Render)

- Suitable for development/small scale
- For production, migrate to PostgreSQL:
  1. Create PostgreSQL database on Render
  2. Update backend connection string
  3. Redeploy

---

## Custom Domains (Optional)

### Frontend Custom Domain (Vercel)

1. In Vercel dashboard: Settings → Domains
2. Add your domain
3. Follow DNS configuration steps

### Backend Custom Domain (Render)

1. In Render dashboard: Settings → Custom Domains
2. Add your domain
3. Follow DNS configuration steps

Then update `VITE_API_URL` in Vercel to use custom backend domain.

---

## Next Steps

1. ✅ Deploy backend to Render (Part 1)
2. ✅ Deploy frontend to Vercel (Part 2)
3. ✅ Test the connection
4. Monitor logs and performance
5. Set up error tracking (optional)
6. Plan database migration for production (optional)

---

## Support & Resources

- **Render Documentation**: https://render.com/docs
- **Vercel Documentation**: https://vercel.com/docs
- **Project README**: See README.md in repository
- **Troubleshooting**: See DEPLOYMENT_GUIDE.md

---

**Status: Ready to Deploy! 🚀**

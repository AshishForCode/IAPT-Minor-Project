# QUICK DEPLOYMENT CHECKLIST FOR RENDER

## Prerequisites
- [ ] Render.com account created
- [ ] GitHub repository connected to Render
- [ ] Repository is `AshishForCode/IAPT-Minor-Project`

## Step 1: Create Backend Service
1. Go to https://dashboard.render.com
2. Click "New +" → "Web Service"
3. Select GitHub repository branch: `main`

**Configuration:**
```
Name: iapt-backend
Environment: Python
Build Command: pip install -r backend/requirements-deploy.txt
Start Command: gunicorn backend.wsgi:app --chdir backend --workers 3 --bind 0.0.0.0:${PORT}
Instance Type: Free Tier (or Starter for better performance)
Region: Choose closest to your users
```

**Environment Variables:**
```
SECRET_KEY=change-this-to-a-strong-random-value-in-production
MYSQL_DB=iapt_db
```

4. Click "Create Web Service"
5. Wait for build and deployment to complete

## Step 2: Create Frontend Service
1. Click "New +" → "Static Site"
2. Select same GitHub repository

**Configuration:**
```
Name: iapt-frontend
Build Command: cd frontend && npm install && npm run build
Publish Directory: frontend/dist
```

**Environment Variables:**
```
VITE_API_URL=https://iapt-backend.onrender.com/api
```

(Replace `iapt-backend` with your actual backend service name)

3. Click "Create Static Site"
4. Wait for build and deployment

## Step 3: Verify Deployment

### Backend Health Check
```bash
curl https://iapt-backend.onrender.com/
# Response: "Welcome to IAPT Backend API"
```

### Test Registration
```bash
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

### Access Frontend
- Open: `https://iapt-frontend.onrender.com`
- You should see login screen
- Register and login with test credentials

## Step 4: Post-Deployment

- [ ] Test all features work
- [ ] Verify database is persisting data
- [ ] Check backend logs for errors
- [ ] Monitor performance

## Troubleshooting

**Backend won't start?**
- Check logs: Dashboard → iapt-backend → Logs
- Verify environment variables are set
- Check start command is correct

**Frontend blank?**
- Check if VITE_API_URL is correct
- Browser console for errors
- Check if API requests are going to correct backend

**Database errors?**
- SQLite persists automatically
- Data stored in `/app/backend/iapt.db`
- Each redeploy creates fresh database (set environment variables to persist)

## URLs After Deployment
- Backend API: `https://iapt-backend.onrender.com/api`
- Frontend: `https://iapt-frontend.onrender.com`

## Next Steps
1. Monitor application health
2. Set up error logging
3. Configure custom domain (if needed)
4. Plan database migration to PostgreSQL for production

---
For detailed deployment guide, see: DEPLOYMENT_GUIDE.md

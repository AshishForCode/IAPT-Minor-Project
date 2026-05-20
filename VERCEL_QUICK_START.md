# QUICK START: VERCEL + RENDER DEPLOYMENT

## 🚀 30-SECOND OVERVIEW

| Step | Platform | Time |
|------|----------|------|
| 1. Deploy Backend | Render | 2 min |
| 2. Deploy Frontend | Vercel | 1 min |
| 3. Connect | Both | <1 min |
| **Total** | - | **~3 minutes** |

---

## STEP 1: Backend on Render (2 minutes)

### 1.1 Create Service
- Go to https://dashboard.render.com
- Click **"New +"** → **"Web Service"**
- Connect GitHub: `AshishForCode/IAPT-Minor-Project`

### 1.2 Configure
- **Name:** `iapt-backend`
- **Build:** `pip install -r backend/requirements-deploy.txt`
- **Start:** `gunicorn backend.wsgi:app --chdir backend --workers 3 --bind 0.0.0.0:${PORT}`
- **Env Var:** `SECRET_KEY=your-secret-key` (change this!)
- Click **"Create Web Service"**

### 1.3 Get Backend URL
Wait for deployment, then copy URL from dashboard.
Example: `https://iapt-backend.onrender.com`

✅ Backend deployed!

---

## STEP 2: Frontend on Vercel (1 minute)

### 2.1 Import Project
- Go to https://vercel.com/dashboard
- Click **"New Project"**
- Click **"Import Git Repository"**
- Select GitHub repo: `AshishForCode/IAPT-Minor-Project`

### 2.2 Configure
- **Root Directory:** Select `./frontend`
- **Environment Variable:**
  - Key: `VITE_API_URL`
  - Value: `https://iapt-backend.onrender.com/api` (use your backend URL)
- Click **"Deploy"**

### 2.3 Get Frontend URL
Wait for deployment, then copy URL from dashboard.
Example: `https://iapt-frontend.vercel.app`

✅ Frontend deployed!

---

## STEP 3: Test Connection

### 3.1 Open Frontend
Visit: `https://iapt-frontend.vercel.app`

### 3.2 Test Features
1. **Register:** Click "Register here" → Fill form → Submit
2. **Login:** Use registered credentials
3. **Dashboard:** Should show data from backend
4. **API Calls:** Try adding a timetable entry or viewing profile

### 3.3 Troubleshoot
If errors occur:
- Check browser console (F12)
- Verify backend URL is correct in Vercel environment
- Check Render backend logs: Dashboard → Logs
- Check Vercel frontend logs: Dashboard → Deployments → Logs

✅ Everything working!

---

## 🔄 Update Code

Push to GitHub and both platforms auto-deploy:

```bash
git add .
git commit -m "Your changes"
git push origin main
```

Monitor deployments:
- Render: https://dashboard.render.com/services
- Vercel: https://vercel.com/dashboard

---

## 📋 Environment Variables Reference

**Render Backend:**
```
SECRET_KEY = (strong random value)
MYSQL_DB = iapt_db
```

**Vercel Frontend:**
```
VITE_API_URL = https://iapt-backend.onrender.com/api
```

---

## 🆘 Quick Troubleshooting

| Issue | Fix |
|-------|-----|
| Frontend blank | Check Vercel logs |
| Login fails | Verify backend URL in VITE_API_URL |
| Backend errors | Check Render backend logs |
| CORS errors | (Should not happen - CORS enabled) |
| API not responding | Verify Render service is running |

---

## 📊 Pricing

- **Render Backend (Free Tier):** Free (sleeps after 15 min idle)
- **Vercel Frontend (Free Tier):** Free (always active)
- **Total Cost:** $0/month (free tier)

---

## 🎯 URLs After Deployment

```
Frontend: https://iapt-frontend.vercel.app
Backend: https://iapt-backend.onrender.com
API Root: https://iapt-backend.onrender.com/api
```

---

## ✅ Deployment Checklist

- [ ] GitHub repository ready with code
- [ ] Backend deployed to Render
- [ ] Frontend deployed to Vercel
- [ ] VITE_API_URL environment variable set in Vercel
- [ ] Frontend loads without errors
- [ ] Can register and login
- [ ] Dashboard loads with data

---

**All done! Your app is now live! 🎉**

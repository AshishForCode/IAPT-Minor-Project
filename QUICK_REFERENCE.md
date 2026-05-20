# DEPLOYMENT QUICK REFERENCE

## Architecture Diagram

```
                          Your Users
                              ↓
                    ┌─────────────────────┐
                    │ Vercel Frontend     │
                    │ (React/Vite)        │
                    │ https://iapt-       │
                    │ frontend.vercel.app │
                    └────────┬────────────┘
                             │
                    VITE_API_URL (env var)
                             │
                             ↓
                    ┌─────────────────────┐
                    │ Render Backend      │
                    │ (Flask/Python)      │
                    │ https://iapt-       │
                    │ backend.onrender.com│
                    └────────┬────────────┘
                             │
                             ↓
                    ┌─────────────────────┐
                    │ SQLite Database     │
                    │ (iapt.db)           │
                    └─────────────────────┘
```

## One-Minute Setup

### Prerequisites
- GitHub account with repository pushed
- Render account (https://render.com)
- Vercel account (https://vercel.com)

### Backend (Render) - 2 minutes

```
1. render.com dashboard
2. New → Web Service
3. Connect GitHub repo
4. Configure:
   - Build: pip install -r backend/requirements-deploy.txt
   - Start: gunicorn backend.wsgi:app --chdir backend --workers 3 --bind 0.0.0.0:${PORT}
   - Env: SECRET_KEY=your-secret-key
5. Deploy → Copy URL (e.g., https://iapt-backend.onrender.com)
```

### Frontend (Vercel) - 1 minute

```
1. vercel.com dashboard
2. New Project → Import Git
3. Select GitHub repo
4. Root: ./frontend
5. Environment:
   - VITE_API_URL=https://iapt-backend.onrender.com/api
6. Deploy → Copy URL (e.g., https://iapt-frontend.vercel.app)
```

### Test - <1 minute

```
1. Visit https://iapt-frontend.vercel.app
2. Click Register
3. Create test account
4. Login with test credentials
5. Dashboard should load
```

## Environment Variables

### Render Backend
| Variable | Value | Example |
|----------|-------|---------|
| `SECRET_KEY` | Your secret JWT key | `abc123xyz789` |
| `MYSQL_DB` | Database name | `iapt_db` |

### Vercel Frontend
| Variable | Value | Example |
|----------|-------|---------|
| `VITE_API_URL` | Backend API URL | `https://iapt-backend.onrender.com/api` |

## Verification Checklist

- [ ] Backend deployed to Render
- [ ] Backend URL accessible (https://iapt-backend.onrender.com/)
- [ ] Frontend deployed to Vercel
- [ ] Frontend loads without errors
- [ ] Can register new user
- [ ] Can login successfully
- [ ] Dashboard displays data
- [ ] API calls working (check browser console)

## Common Issues & Fixes

| Issue | Solution |
|-------|----------|
| Frontend blank | Check Vercel logs, verify VITE_API_URL |
| Can't login | Backend unreachable, check Render logs |
| Slow first load | Free Render tier sleeps after 15 min idle |
| CORS errors | (Should not occur - CORS enabled) |
| Database empty | SQLite auto-creates, re-register if lost |

## Performance Tips

1. **Faster Frontend**: Vercel's CDN ensures global speed
2. **Faster Backend**: Upgrade from Free to Starter on Render
3. **Reduce Cold Starts**: Keep-alive with scheduled checks
4. **Database Speed**: Consider PostgreSQL for production

## Auto-Deployment

Both services auto-deploy when you push to GitHub:

```bash
git add .
git commit -m "Your changes"
git push origin main
```

Watch deployments:
- Render: Dashboard → Logs
- Vercel: Dashboard → Deployments

## Scaling (Future)

When you grow:

1. **Backend**: Upgrade Render instance type
2. **Database**: Migrate from SQLite to PostgreSQL
3. **Frontend**: Vercel handles scaling automatically
4. **Caching**: Add Redis for performance

## Documentation

- **VERCEL_QUICK_START.md** - 30-second guide
- **VERCEL_RENDER_DEPLOYMENT.md** - Complete guide
- **README.md** - Project overview
- **DEPLOYMENT_GUIDE.md** - Alternative options

## Support

- Render Docs: https://render.com/docs
- Vercel Docs: https://vercel.com/docs
- Project Issues: Check GitHub repository

---

**Status: READY TO DEPLOY** ✅

Total time to live: ~3 minutes

# IAPT Deployment Guide

## 🎯 Deployment Options

| Option | Backend | Frontend | Speed | Cost |
|--------|---------|----------|-------|------|
| **Recommended** | Render | Vercel | ⚡ Fast | 💰 Free |
| Alternative | Render | Render | ⚡ Same | 💰 Free |

## 📖 Quick Links

- **👉 [VERCEL_QUICK_START.md](./VERCEL_QUICK_START.md)** - 30-second deployment guide
- **[VERCEL_RENDER_DEPLOYMENT.md](./VERCEL_RENDER_DEPLOYMENT.md)** - Complete guide with troubleshooting
- **[RENDER_QUICK_DEPLOY.md](./RENDER_QUICK_DEPLOY.md)** - Deploy both to Render (alternative)

## Project Status ✅
All issues have been fixed and the project is ready for deployment.

### What Was Fixed:
1. **Backend Requirements**: Removed corrupted gunicorn entry, added joblib, updated gunicorn to 21.2.0
2. **Database**: SQLite database properly configured (already converted from MySQL)
3. **ML Model**: Generated synthetic data and trained the model successfully
4. **Environment Files**: Created .env and .env.production for configuration
5. **API Testing**: Verified backend endpoints work correctly (register, login, dashboard)
6. **Frontend**: Built successfully for production

## Deployment to Render

### Prerequisites:
- Render.com account
- GitHub repository connected to Render
- Environment variables configured on Render

### Step 1: Connect Repository to Render
1. Go to https://dashboard.render.com
2. Click "New +" → "Web Service"
3. Connect your GitHub repository: `AshishForCode/IAPT-Minor-Project`
4. Select the `main` branch

### Step 2: Configure Backend Service (iapt-backend)
**Service Settings:**
- **Name**: iapt-backend
- **Environment**: Python
- **Build Command**: `pip install -r backend/requirements-deploy.txt`
- **Start Command**: `gunicorn backend.wsgi:app --chdir backend --workers 3 --bind 0.0.0.0:${PORT}`
- **Instance Type**: Free (or Starter if you want better performance)

**Environment Variables** (Add these on Render dashboard):
```
SECRET_KEY=your-super-secret-jwt-key-here
MYSQL_HOST=your-mysql-host (or keep for SQLite)
MYSQL_USER=your-mysql-user
MYSQL_PASSWORD=your-mysql-password
MYSQL_DB=iapt_db
```

**Note on Database:**
- The project uses SQLite by default (stored as `iapt.db` in the backend)
- SQLite file is created automatically on first deployment
- Data persists in the Render's file system (but may be lost on redeploy)
- For production: Consider switching to a managed database (MySQL or PostgreSQL)

### Step 3: Configure Frontend Service (iapt-frontend)
**Service Settings:**
- **Name**: iapt-frontend
- **Type**: Static Site
- **Build Command**: `cd frontend && npm install && npm run build`
- **Publish Directory**: `frontend/dist`

**Environment Variables** (if needed):
```
VITE_API_URL=https://iapt-backend.onrender.com/api
```

### Step 4: Link Services
1. In frontend service settings, add environment variable:
   - Key: `VITE_API_URL`
   - Value: `https://iapt-backend.onrender.com/api` (update with your actual backend URL)

### Step 5: Deploy
1. Click "Create Web Service" for backend
2. Click "Create Static Site" for frontend
3. Render will automatically deploy both services
4. Frontend will be available at: `https://iapt-frontend.onrender.com`
5. Backend will be available at: `https://iapt-backend.onrender.com/api`

## Testing After Deployment

### Backend Health Check
```bash
curl https://iapt-backend.onrender.com/
# Should return: "Welcome to IAPT Backend API"
```

### Test User Registration
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

### Test User Login
```bash
curl -X POST https://iapt-backend.onrender.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

## Local Development

### Backend Setup
```bash
cd backend
python -m venv venv
.\venv\Scripts\activate  # Windows
source venv/bin/activate  # Linux/Mac
pip install -r requirements.txt
python app.py
```

Backend runs on: `http://localhost:5000`

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

Frontend runs on: `http://localhost:5173`

### ML Model Training (if needed)
```bash
cd ml
python generate_data.py
python train_model.py
```

## Database Schema

All database tables are created automatically on first connection:
- **users**: Student account information
- **timetable**: Class schedules
- **subjects**: Academic subjects
- **study_plan**: Personalized study plans
- **topics**: Study topics
- **resources**: Study materials
- **mock_tests**: Practice tests
- **questions**: Test questions
- **mock_test_attempts**: Test attempt records
- **placement_applications**: Job applications

## API Endpoints

### Auth
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login

### Dashboard
- `GET /api/dashboard/summary` - Get dashboard summary (requires auth)

### Timetable
- `GET /api/timetable` - Get user's timetable
- `POST /api/timetable` - Add new class entry
- `PUT /api/timetable` - Update class entry
- `DELETE /api/timetable` - Delete class entry

### Study Plan
- `GET /api/studyplan/generate` - Generate AI study plan (requires auth)

### Placement
- `GET /api/placement/applications` - Get applications (requires auth)
- `POST /api/placement/applications` - Add new application (requires auth)

### Mock Tests
- `GET /api/mocktests` - Get all mock tests (requires auth)
- `GET /api/mocktests/<id>/questions` - Get test questions (requires auth)
- `POST /api/mocktests/<id>/submit` - Submit test answers (requires auth)

### Resources
- `GET /api/resources` - Get study resources (requires auth)

## Troubleshooting

### Backend Won't Start
- Check that all dependencies are installed: `pip install -r requirements.txt`
- Verify Python version: `python --version` (Should be 3.8+)
- Check for port conflicts: `netstat -an | grep 5000`

### Frontend Build Fails
- Clear node_modules: `rm -rf node_modules && npm install`
- Clear npm cache: `npm cache clean --force`

### Database Errors
- Delete `backend/iapt.db` and restart server to recreate database
- Check database path in `backend/utils/helpers.py`

### CORS Issues
- Frontend and backend must be on same or allowed origins
- CORS is enabled in Flask for all routes

## Next Steps / Improvements

1. **Database**: Switch from SQLite to MySQL/PostgreSQL for production reliability
2. **Security**: 
   - Change `SECRET_KEY` in environment variables
   - Use HTTPS only (Render provides free SSL)
   - Implement rate limiting on API endpoints
3. **Monitoring**: Set up error logging and monitoring
4. **Performance**: 
   - Add caching layer
   - Optimize database queries
5. **Features**:
   - Add email notifications
   - Implement real-time updates with WebSockets
   - Add file upload for resources

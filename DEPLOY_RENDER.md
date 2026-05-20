Deploying to Render

Backend (Flask):
- Ensure environment variables are set on Render: `SECRET_KEY`, `MYSQL_HOST`, `MYSQL_USER`, `MYSQL_PASSWORD`, `MYSQL_DB`.
- Use the `iapt-backend` web service (Python). Build command: `pip install -r backend/requirements-deploy.txt`.
- Start command: `gunicorn backend.wsgi:app --chdir backend --workers 3 --bind 0.0.0.0:${PORT}`.

Frontend (Vite):
- Use the `iapt-frontend` static site service.
- Build command: `cd frontend && npm install && npm run build`.
- Publish directory: `frontend/dist`.

Notes:
- I added `backend/wsgi.py` so Gunicorn can import the WSGI app.
- I added `backend/requirements-deploy.txt` (cleaned) — you can rename to `requirements.txt` if you prefer.
- Either use Render's web/static services via the dashboard or `render.yaml` included for infra-as-code.

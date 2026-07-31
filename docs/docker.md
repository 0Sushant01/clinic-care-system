# Docker Environment & Containerization Guide

## Container Services Architecture

The MVP Docker deployment consists of 3 lightweight container services:

1. **`backend` (Django Gunicorn - SQLite MVP)**:
   - Built from `docker/backend/Dockerfile` (multi-stage Python 3.12 slim with non-root `appuser`).
   - Runs `/app/entrypoint.sh` (copied from `docker/backend/entrypoint.sh`) on startup to execute database migrations and `collectstatic`.
   - **Persistent Storage**: Volume `backend_data:/app/data` persists `/app/data/db.sqlite3` across container restarts.
   - Health check probe: `curl -f http://localhost:8000/health/`
2. **`frontend` (React SPA Served via Nginx)**:
   - Built from `docker/frontend/Dockerfile` (Node 20 build -> Nginx Alpine listening on port 80).
   - Health check probe: `wget --spider http://localhost/`
3. **`nginx` (Gateway Reverse Proxy)**:
   - Built from `docker/nginx/Dockerfile`.
   - Configured with security headers, Gzip compression, and 20MB body size limit.
   - Health check probe: `curl -f http://localhost:80/`

## Database Strategy & Volumes

- **Current MVP Phase**: SQLite stored at `/app/data/db.sqlite3` backed by Docker volume `backend_data`.
- **Data Persistence**:
  ```yaml
  volumes:
    - backend_data:/app/data
    - backend_static:/app/staticfiles
    - backend_media:/app/media
    - backend_logs:/app/logs
  ```
- **Future Phase**: PostgreSQL container can be re-added without changing application business logic or frontend code.

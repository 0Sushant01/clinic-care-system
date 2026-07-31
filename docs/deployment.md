# Production Deployment Guide (Ubuntu VPS — SQLite MVP)

## Prerequisites
- Ubuntu 22.04 LTS / 24.04 LTS VPS
- Docker 24.0+ and Docker Compose v2+ installed
- Domain configured pointing to server IP

## Simplified Deployment Workflow

1. **Clone Repository & Setup Environment**:
   ```bash
   git clone https://github.com/0Sushant01/clinic-care-system.git
   cd clinic-care-system
   cp .env.example .env
   nano .env    # Configure DJANGO_SECRET_KEY, OPENROUTER_API_KEY
   ```

2. **Build & Start Containers**:
   ```bash
   docker compose up --build -d
   ```

3. **Verify Container Health & Logs**:
   ```bash
   docker compose ps
   docker compose logs -f backend
   curl http://localhost/health/
   ```

4. **Create Initial Admin Account**:
   ```bash
   docker compose exec backend python manage.py createsuperuser
   ```

## Database Persistence & Backup
- SQLite data is stored safely in `/app/data/db.sqlite3` backed by Docker volume `backend_data`.
- To create a backup:
  ```bash
  docker compose exec backend sqlite3 /app/data/db.sqlite3 ".backup /app/data/backup.sqlite3"
  ```

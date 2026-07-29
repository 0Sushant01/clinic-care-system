# Clinic Care System

A production-quality Clinic Management System built with Django, React, and Docker. Designed for therapists, receptionists, and administrators to manage patients, appointments, session notes, and clinical reports.

## Tech Stack

| Layer          | Technology                                         |
| -------------- | -------------------------------------------------- |
| **Backend**    | Python 3.12+, Django 5.1, Django REST Framework    |
| **Auth**       | JWT (SimpleJWT) — Admin, Receptionist, Therapist   |
| **Frontend**   | React, Vite, Tailwind CSS v4, React Router, Axios  |
| **Database**   | SQLite (dev), PostgreSQL (production-ready)         |
| **Infra**      | Docker, Docker Compose, Nginx reverse proxy        |

## Project Structure

```
clinic-care-system/
├── backend/                  # Django backend
│   ├── config/               # Django project settings
│   ├── apps/                 # Django apps (modular)
│   │   ├── users/
│   │   ├── patients/
│   │   ├── appointments/
│   │   ├── notes/
│   │   ├── dashboard/
│   │   └── reports/
│   ├── common/               # Shared utilities
│   │   ├── responses.py      # Consistent API responses
│   │   ├── permissions.py    # Role-based permissions
│   │   └── pagination.py     # Standard pagination
│   ├── services/             # External service integrations
│   │   ├── ai/               # OpenRouter AI (future)
│   │   └── pdf/              # PDF generation (future)
│   ├── manage.py
│   └── requirements.txt
├── frontend/                 # React frontend
│   ├── src/
│   │   ├── components/       # Reusable UI components
│   │   ├── pages/            # Page-level components
│   │   ├── layouts/          # Layout wrappers
│   │   ├── services/         # API service (Axios)
│   │   ├── hooks/            # Custom React hooks
│   │   ├── contexts/         # React Context (Auth, etc.)
│   │   ├── routes/           # Route configuration
│   │   ├── utils/            # Helper functions
│   │   └── assets/           # Static assets
│   └── vite.config.js
├── docker/                   # Docker configurations
│   ├── backend/Dockerfile
│   ├── frontend/Dockerfile
│   └── nginx/
│       ├── Dockerfile
│       ├── nginx.conf        # Reverse proxy config
│       └── frontend.conf     # SPA serving config
├── docs/                     # Documentation
├── docker-compose.yml
├── .env.example
├── .gitignore
└── README.md
```

## Quick Start

### Prerequisites

- Python 3.12+
- Node.js 20+
- Docker & Docker Compose (for containerized setup)

### Option 1: Local Development

#### Backend

```bash
cd backend

# Create and activate virtual environment
python -m venv venv
source venv/bin/activate        # Linux/macOS
# venv\Scripts\activate         # Windows

# Install dependencies
pip install -r requirements.txt

# Set up environment
cp ../.env.example ../.env      # Edit .env as needed

# Run migrations
python manage.py migrate

# Create superuser (optional)
python manage.py createsuperuser

# Start development server
python manage.py runserver
```

Backend runs at: `http://localhost:8000`

#### Frontend

```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

Frontend runs at: `http://localhost:5173`

> The Vite dev server proxies `/api/` requests to Django automatically.

### Option 2: Docker

```bash
# Copy environment file
cp .env.example .env

# Build and start all services
docker compose up --build
```

Application runs at: `http://localhost` (via Nginx reverse proxy)

## API Endpoints

All APIs follow REST conventions and are namespaced under `/api/`.

| Endpoint                    | Description               |
| --------------------------- | ------------------------- |
| `POST /api/auth/token/`    | Obtain JWT token pair     |
| `POST /api/auth/token/refresh/` | Refresh access token |
| `/api/users/`              | User management           |
| `/api/patients/`           | Patient CRUD              |
| `/api/appointments/`       | Appointment scheduling    |
| `/api/notes/`              | Session notes             |
| `/api/dashboard/`          | Dashboard data            |
| `/api/reports/`            | Report generation         |

### Authentication

All API endpoints require JWT authentication (except token endpoints).

```bash
# Obtain tokens
curl -X POST http://localhost:8000/api/auth/token/ \
  -H "Content-Type: application/json" \
  -d '{"username": "admin", "password": "password"}'

# Use access token
curl http://localhost:8000/api/patients/ \
  -H "Authorization: Bearer <access_token>"
```

## Roles

| Role             | Description                                      |
| ---------------- | ------------------------------------------------ |
| **Admin**        | Full system access, user management              |
| **Receptionist** | Patient registration, appointment scheduling     |
| **Therapist**    | Session notes, patient progress, AI summaries    |

> Patients do not log into the system.

## Environment Variables

See [.env.example](.env.example) for all available configuration options.

## Development Guidelines

- **Backend**: Follow PEP8, use type hints, write clean Django REST Framework code
- **Frontend**: Functional components only, use hooks, organize by feature
- **API**: Return consistent JSON via `common/responses.py` helpers
- **Database**: Use Django ORM exclusively — never raw SQL
- **Git**: Meaningful commits, never commit secrets

## Documentation

- [Architecture](docs/architecture.md)
- [API Reference](docs/api.md)

## License

Private — All rights reserved.
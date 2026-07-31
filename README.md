# Enterprise Clinic Management Platform — Clinic Care System

A production-ready Enterprise Clinic Management System architected with **Django REST Framework**, **React**, **Nginx**, and **Docker Compose**. Engineered for therapy clinics to manage role-based workflows, dynamic patient ownership, double-booking prevention with database locking, embedded clinical session documentation, and OpenRouter AI practice summaries.

---

## 🌟 Architecture & Key Features

### 1. Role Security Matrix
- 👑 **Administrator**: Full clinic management, staff account CRUD, operational analytics, system settings, and clinic-wide AI summaries.
- 🧑‍💼 **Receptionist**: Dedicated **Reception Desk** view for patient check-ins, demographics editing, search, and scheduling. *(Restricted from completing sessions, reading clinical notes, or generating AI summaries — returns HTTP 403 Forbidden)*.
- 🩺 **Therapist**: **My Dashboard** caseload tracking, appointment-based patient ownership, embedded session completion, personal clinical performance reports, and AI summary tab. *(Restricted from completing or viewing appointments of other therapists)*.

### 2. Double-Booking Prevention & Race-Condition Locking
- **Database Locking (`select_for_update`)**: Enforces atomic transaction locking when checking for time slot overlaps:
  $$\text{existing.start} < \text{new.end} \quad \text{AND} \quad \text{existing.end} > \text{new.start}$$
- **Conflict Handling**: Returns **`HTTP 409 Conflict`** (`"This therapist is already booked for the selected time slot."`).
- **Slot Availability Endpoint**: `GET /api/v1/appointments/availability/?therapist={id}&date=YYYY-MM-DD` populates the occupied time slots banner in the booking modal.

### 3. OpenRouter AI Integration & Zero-Session Guard
- **Zero Completed Sessions (`completed_sessions == 0`)**: `ReportAISummaryView` returns `has_data: false`. The frontend renders a clean `EmptyState` (*"No Completed Sessions Yet. AI practice insights will become available after you complete your first therapy session"*).
- **LLM Note Summarization**: When completed notes exist (> 0), extracts actual text from `SessionNote` records (`chief_complaint`, `treatment_performed`, `patient_response`, `recommendations`) and passes them to the OpenRouter AI provider (`qwen/qwen3-235b-a22b:free`).

---

## 🛠️ Technology Stack

| Component | Technology | Description |
| --- | --- | --- |
| **Backend** | Python 3.12, Django 5.0+, DRF | Versioned REST API (`/api/v1/`), custom permissions, Gunicorn |
| **Auth** | JWT in **HttpOnly Cookies** | Protection against XSS, automatic cookie rotation, CSRF integration |
| **Database Strategy** | **SQLite (MVP Deployment)** / PostgreSQL (Future) | Persistent Docker volume `/app/data/db.sqlite3` with zero DB container overhead |
| **Frontend** | React 18, Vite, Tailwind CSS | SPA architecture, TanStack React Query, Framer Motion |
| **Gateway Proxy** | Nginx | Reverse proxy with security headers, Gzip compression, 20MB body size |
| **Containerization** | Docker & Docker Compose | Multi-stage Dockerfiles with non-root execution and health probes |

---

## 📁 Repository Structure

```
clinic-care-system/
├── backend/                  # Django REST Framework Backend
│   ├── config/               # Split settings (base, dev, prod) & root URLs
│   ├── apps/
│   │   ├── users/            # Auth, CustomUser & Staff Management
│   │   ├── patients/         # Patient records & ownership scoping
│   │   ├── therapists/       # Therapist profiles & credentials
│   │   ├── appointments/     # 3-status appointment lifecycle & overlap validation
│   │   ├── notes/            # SessionNote & OpenRouter AI summaries
│   │   ├── dashboard/        # Role-customized live dashboard metrics
│   │   ├── reports/          # Clinical analytics & AI Summary tab
│   │   └── core/             # Clinic configuration & /health/ probe
│   ├── common/               # BaseModel, global exception handler, 409 exception
│   ├── services/             # OpenRouter AI provider, audit logging
│   ├── manage.py
│   └── requirements.txt
├── frontend/                 # React Vite Frontend Application
│   ├── src/
│   │   ├── components/       # Enterprise UI components & Portal Modals
│   │   ├── contexts/         # AuthContext & ToastContext
│   │   ├── hooks/            # TanStack React Query hooks
│   │   ├── pages/            # Page views (Dashboard, Patients, Appointments, Reports, Profile, Settings)
│   │   ├── routes/           # AppRoutes with role guards
│   │   └── services/         # Axios instance with credentials
│   ├── vite.config.js
│   └── package.json
├── docker/                   # Docker environment configurations
│   ├── backend/              # Multi-stage Python 3.12 Dockerfile & entrypoint.sh
│   ├── frontend/             # Multi-stage Node -> Nginx Dockerfile & frontend.conf
│   └── nginx/                # Gateway reverse proxy nginx.conf & Dockerfile
├── docs/                     # Comprehensive architecture and API docs
├── docker-compose.yml
├── .env.example
└── README.md
```

---

## 🚀 Quick Start Guide

### 1. Local Development (Backend + Frontend)

#### Backend Setup
```bash
cd backend
python3 -m venv venv
source venv/bin/activate        # On Linux/macOS
# venv\Scripts\activate         # On Windows

pip install -r requirements.txt
cp ../.env.example ../.env      # Configure environment variables

python3 manage.py makemigrations
python3 manage.py migrate
python3 manage.py test apps.appointments
python3 manage.py createsuperuser

python3 manage.py runserver
```
- **Backend API**: `http://localhost:8000/api/v1/`
- **Health Check Probe**: `http://localhost:8000/health/`
- **Swagger Documentation**: `http://localhost:8000/api/docs/`

#### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
- **Frontend App**: `http://localhost:5173/`

---

## 🐳 Docker Compose Deployment (SQLite Persistent MVP)

```bash
cp .env.example .env
docker compose up --build -d
```

### Health Check Verification
```bash
docker compose ps
curl http://localhost/health/
```

- **Production Gateway Portal**: `http://localhost/`

---

## 📚 Complete Documentation Index

- [System Architecture](docs/architecture.md)
- [Backend Architecture](docs/backend.md)
- [Frontend Architecture](docs/frontend.md)
- [Docker Environment Guide](docs/docker.md)
- [Production Deployment Guide](docs/deployment.md)
- [Security Architecture](docs/security.md)
- [API Endpoint Reference](docs/api.md)
- [Role Permission Matrix](docs/roles.md)
- [OpenRouter AI Integration](docs/ai.md)
- [Database Strategy Guide](docs/database.md)
- [Automated Testing Guide](docs/testing.md)
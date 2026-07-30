# Clinic Care System — Enterprise Therapy Clinic Platform

A production-ready Enterprise Clinic Management Platform built with **Django REST Framework**, **React**, and **Docker**. Specifically architected for therapy clinics to support role-based workflows, dynamic appointment-based patient ownership, embedded clinical documentation, and OpenRouter AI summary integration.

---

## 🌟 Key Application Features

### 1. Role Permission Matrix & Security
- 👑 **Administrator**: Full clinic management, staff account CRUD, clinic-wide operational analytics, system settings, and overall AI clinic summary.
- 🧑‍💼 **Receptionist**: Dedicated **Reception Desk** view for patient check-ins, demographic editing, patient search, and appointment scheduling. *(Restricted from reading clinical notes, AI summaries, or financial data)*.
- 🩺 **Therapist**: **My Dashboard** caseload tracking, appointment-based patient ownership, embedded session completion, personal clinical performance reports, and AI summary tab. *(Restricted from viewing appointments or notes of other therapists)*.

### 2. Dynamic Appointment-Based Patient Ownership
- Patients are not locked to a single clinician; patients can visit multiple therapists over time through separate appointments.
- Therapists can access a patient's full clinical details **ONLY IF** `patient.created_by == request.user` OR `Appointment.objects.filter(patient=patient, therapist=request.user).exists()`. Otherwise, the backend returns **`HTTP 403 Forbidden`**.

### 3. Binary 3-Status Session Completion Workflow
- **Statuses**: `Scheduled`, `Completed`, `Cancelled`.
- Scheduled appointments assigned to a therapist display **ONLY TWO** actions:
  - **✓ Complete Appointment**: Opens full-screen `CompleteAppointmentModal` capturing Chief Complaint, Session Notes, Treatment Performed, Patient Response, Recommendations, and optional AI Summary. Saves `SessionNote` & sets `status = COMPLETED`.
  - **✕ Cancel Appointment**: Opens `CancelAppointmentModal` capturing required Cancellation Reason and remarks. Saves cancellation metadata & sets `status = CANCELLED` without creating a `SessionNote`.
- **Unified Reusable `AppointmentDetailsModal`**: Single modal component dynamically rendering completed clinical records or cancellation reasons and metadata.

### 4. OpenRouter AI Integration & Non-Financial Analytics
- **Structured Dual Documentation**: Therapist clinical note is the legal source of truth; AI summary is stored independently as structured JSON (`ai_enhanced_summary`). AI never modifies therapist notes.
- **Reports & AI Summary Tab**: Non-financial clinical activity reports with an interactive AI summary tab (clinic-wide trends for Admin; personal treatment summary for Therapist).

---

## 🛠️ Technology Stack

| Layer | Technology | Description |
| --- | --- | --- |
| **Backend** | Python 3.12+, Django 5.0+, DRF | Versioned REST API (`/api/v1/`), modular apps, custom permissions |
| **Auth** | JWT in **HttpOnly Cookies** | Secure token handling, CSRF integration, cookie rotation |
| **Database** | SQLite (Dev) / PostgreSQL (Prod) | CustomUser with email login, UUID primary keys, Soft Delete |
| **API Specs** | OpenAPI 3.0 / Swagger UI | Interactive Swagger UI at `/api/docs/` and Schema at `/api/schema/` |
| **Frontend** | React 18, Vite, Tailwind CSS | Enterprise design system, React Query, Framer Motion animations |
| **Services** | Extensible AI Provider | OpenRouter AI integration (`qwen/qwen3-235b-a22b:free`) |
| **Infra** | Docker & Docker Compose | Multi-stage Dockerfiles with Nginx reverse proxy |

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
│   │   ├── appointments/     # 3-status appointment lifecycle & cancel tracking
│   │   ├── notes/            # SessionNote & OpenRouter AI summaries
│   │   ├── dashboard/        # Role-customized live dashboard payloads
│   │   ├── reports/          # Clinical analytics & AI Summary tab
│   │   └── core/             # Clinic configuration settings
│   ├── common/               # BaseModel, global exception handler, permissions
│   ├── services/             # AI Provider, audit logging, notifications
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
├── docs/                     # Comprehensive architecture and API docs
├── docker-compose.yml
└── README.md
```

---

## 🚀 Quick Start Guide

### 1. Backend Local Setup

```bash
cd backend
python3 -m venv venv
source venv/bin/activate        # On Linux/macOS
# venv\Scripts\activate         # On Windows

pip install -r requirements.txt
cp ../.env.example ../.env      # Configure environment variables

python3 manage.py makemigrations
python3 manage.py migrate
python3 manage.py createsuperuser

python3 manage.py runserver
```

- **Backend Base URL**: `http://localhost:8000/api/v1/`
- **Swagger Documentation**: `http://localhost:8000/api/docs/`

### 2. Frontend Local Setup

```bash
cd frontend
npm install
npm run dev
```

- **Frontend Application**: `http://localhost:5173/`

### 3. Running with Docker Compose

```bash
cp .env.example .env
docker compose up --build
```

- **Production Portal**: `http://localhost/`

---

## 🔒 API Response Standards

All API endpoints follow a unified response structure:

```json
{
  "success": true,
  "message": "Operation completed successfully.",
  "data": {}
}
```

Errors return standard HTTP codes (`400`, `401`, `403`, `404`) with descriptive error details:

```json
{
  "success": false,
  "message": "Access Denied: You do not have appointments or ownership with this patient.",
  "errors": {}
}
```

---

## 📚 Documentation Links

- [Architecture Guide](docs/architecture.md)
- [API Reference](docs/api.md)
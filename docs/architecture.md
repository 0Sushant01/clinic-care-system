# System Architecture

## Architecture Overview

The Clinic Care System is an enterprise-grade therapy clinic management system designed with a modular, scalable architecture.

```
┌─────────────────────────────────────────────────────────────┐
│                          Client                             │
│                  (React SPA + Vite)                         │
│   Components │ Pages │ Axios (withCredentials) │ AuthContext│
└──────────────────────────────┬──────────────────────────────┘
                               │ HTTP / Cookies (SameSite/HttpOnly)
                               │ CSRF Header (X-CSRFToken)
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                    Nginx Reverse Proxy                      │
│            /api/ → Backend  │  / → Frontend                 │
└──────────────────────────────┬──────────────────────────────┘
                               │
                ┌──────────────┴───────────────┐
                ▼                               ▼
┌─────────────────────────────┐   ┌──────────────────────────┐
│   Django Backend (Gunicorn) │   │ React Build Static Files │
│                             │   └──────────────────────────┘
│  ┌───────────────────────┐  │
│  │ API / Cookie Auth     │  │
│  └───────────┬───────────┘  │
│              ▼              │
│  ┌───────────────────────┐  │
│  │ Business Service Layer│──┼──→ OpenRouter AI Provider (Qwen3)
│  │ (AI, Audit, Storage)  │  │
│  └───────────┬───────────┘  │
│              ▼              │
│  ┌───────────────────────┐  │
│  │ Django ORM (BaseModel)│  │
│  └───────────┬───────────┘  │
└──────────────┼──────────────┘
               ▼
┌─────────────────────────────┐
│         Database            │
│ SQLite (dev) / Postgres(prod│
└─────────────────────────────┘
```

## Core Architectural Principles & Workflow

### 1. Dynamic Appointment-Based Patient Ownership
- Patients visit multiple therapists over time via separate appointments.
- Backend enforces patient detail access for therapists ONLY IF `created_by == request.user` OR therapist has at least 1 appointment with that patient.

### 2. 3-Status Session Lifecycle & Binary Therapist Actions
- **Statuses**: `Scheduled`, `Completed`, `Cancelled`.
- Therapists receive a binary action choice for scheduled appointments:
  - **Complete Appointment**: Captures Chief Complaint, Session Notes, Treatment Performed, Patient Response, Recommendations, and optional AI summary. Saves `SessionNote` & status = `COMPLETED`.
  - **Cancel Appointment**: Captures Cancellation Reason and remarks. Saves cancellation metadata & status = `CANCELLED` without creating a `SessionNote`.

### 3. OpenRouter AI Integration
- **Structured Dual Documentation**: Therapist clinical note is the legal source of truth. AI summary is stored independently as structured JSON (`ai_enhanced_summary`). AI never modifies therapist notes.

### 4. HttpOnly Cookie Authentication & Security
- JWT tokens (`access_token` and `refresh_token`) are managed via `HttpOnly` cookies.
- State-changing requests require `X-CSRFToken` header.
- Token rotation handled via `/api/v1/auth/refresh/`.

### 5. Custom User Model & Base Models
- **CustomUser**: Extends `AbstractBaseUser` using `email` as primary identifier.
- **UUID Primary Keys**: All entities use UUIDv4 primary keys via `BaseModel`.
- **Soft Delete**: `SoftDeleteModel` preserves healthcare data integrity.

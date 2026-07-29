# Architecture

## System Overview

The Clinic Care System follows a standard three-tier architecture with clear separation of concerns.

```
┌─────────────────────────────────────────────────┐
│                    Client                        │
│              (React SPA + Vite)                  │
│    Components │ Pages │ Hooks │ Contexts         │
└──────────────────────┬──────────────────────────┘
                       │ HTTP (Axios)
                       │ JWT Bearer Token
                       ▼
┌─────────────────────────────────────────────────┐
│              Nginx Reverse Proxy                 │
│         /api/ → Backend  │  / → Frontend         │
└──────────────────────┬──────────────────────────┘
                       │
          ┌────────────┴────────────┐
          ▼                         ▼
┌──────────────────┐    ┌──────────────────────┐
│  Django Backend  │    │  React Static Files   │
│  (Gunicorn)      │    │  (Nginx)             │
│                  │    └──────────────────────┘
│  ┌────────────┐  │
│  │  DRF API   │  │
│  │  Views     │  │
│  └─────┬──────┘  │
│        │         │
│  ┌─────▼──────┐  │
│  │  Services  │  │
│  │  Layer     │──┼──→ OpenRouter API (future)
│  └─────┬──────┘  │
│        │         │
│  ┌─────▼──────┐  │
│  │  Django ORM│  │
│  │  Models    │  │
│  └─────┬──────┘  │
│        │         │
└────────┼─────────┘
         ▼
┌──────────────────┐
│    Database       │
│  SQLite (dev)     │
│  PostgreSQL (prod)│
└──────────────────┘
```

## Key Design Decisions

### 1. Modular App Structure

Each feature is a separate Django app under `apps/`:
- **users** — Authentication, roles, user profiles
- **patients** — Patient registration and records
- **appointments** — Scheduling and calendar
- **notes** — Therapy session documentation
- **dashboard** — Aggregated metrics and overview
- **reports** — Report generation and exports

### 2. Service Layer Pattern

Business logic lives in service classes, NOT in views or serializers:
- Views handle HTTP request/response
- Serializers handle validation and data transformation
- Services handle business rules, external API calls, and complex operations

### 3. Common Utilities

Shared across all apps:
- `common/responses.py` — Ensures every API returns `{status, message, data}` or `{status, message, errors}`
- `common/permissions.py` — Role-based access: Admin, Receptionist, Therapist
- `common/pagination.py` — Consistent pagination across all list endpoints

### 4. AI Architecture (Future)

The AI layer is isolated in `services/ai/`:
- `client.py` — HTTP client for OpenRouter API
- `prompts.py` — Centralized prompt templates
- `summary_service.py` — Session note summarization
- `progress_service.py` — Patient progress analysis

**Critical rule**: The frontend NEVER communicates directly with AI providers. All AI requests are proxied through Django to maintain security and control.

### 5. Authentication Flow

```
Client                  Django                  Database
  │                       │                       │
  │  POST /api/auth/token │                       │
  │  {username, password} │                       │
  │──────────────────────►│  Validate credentials │
  │                       │──────────────────────►│
  │                       │◄──────────────────────│
  │  {access, refresh}    │                       │
  │◄──────────────────────│                       │
  │                       │                       │
  │  GET /api/patients/   │                       │
  │  Authorization: Bearer│                       │
  │──────────────────────►│  Verify JWT + Role    │
  │                       │──────────────────────►│
  │  200 {data}           │                       │
  │◄──────────────────────│                       │
```

### 6. Database Strategy

- **Development**: SQLite — zero configuration, instant setup
- **Production**: PostgreSQL — configured via environment variables
- **Migration**: Simply change `DB_ENGINE` env var; no code changes needed
- **ORM**: Django ORM exclusively — no raw SQL

## Docker Architecture

```
docker compose up --build

┌──────────────────────────────────────┐
│           Docker Network             │
│         (clinic-network)             │
│                                      │
│  ┌──────────┐  ┌──────────┐         │
│  │ Backend  │  │ Frontend │         │
│  │ :8000    │  │ :3000    │         │
│  │ Gunicorn │  │ Nginx    │         │
│  └────┬─────┘  └────┬─────┘         │
│       │              │               │
│       └──────┬───────┘               │
│              │                       │
│       ┌──────▼──────┐                │
│       │   Nginx     │                │
│       │ :80 (proxy) │◄──── Port 80   │
│       └─────────────┘                │
└──────────────────────────────────────┘
```

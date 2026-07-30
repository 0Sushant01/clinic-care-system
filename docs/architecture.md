# System Architecture

## Architecture Overview

The Clinic Care System is an enterprise-grade clinic management system designed with a modular, scalable architecture.

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
               ┌───────────────┴───────────────┐
               ▼                               ▼
┌─────────────────────────────┐   ┌──────────────────────────┐
│   Django Backend (Gunicorn) │   │ React Build Static Files │
│                             │   └──────────────────────────┘
│  ┌───────────────────────┐  │
│  │ API / Cookie Auth     │  │
│  └───────────┬───────────┘  │
│              ▼              │
│  ┌───────────────────────┐  │
│  │ Business Service Layer│──┼──→ AI Providers (OpenRouter/Gemini/OpenAI)
│  │ (AI, Audit, PDF, etc.)│  │
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

## Architectural Principles & Patterns

### 1. HttpOnly Cookie Authentication & Security
- **No Token in JavaScript**: JWT tokens (`access_token` and `refresh_token`) are set by Django as `HttpOnly`, `SameSite` cookies. React never accesses raw tokens, mitigating XSS attacks.
- **CSRF Integration**: State-changing requests (POST, PUT, PATCH, DELETE) require the `X-CSRFToken` header.
- **Auto Cookie Refresh**: The backend handles token rotation via `/api/v1/auth/refresh/`.

### 2. Custom User Model & Primary Keys
- **CustomUser**: Extends `AbstractBaseUser` and `PermissionsMixin`. Uses `email` as `USERNAME_FIELD`.
- **UUID Primary Keys**: All entities use UUIDv4 primary keys via `BaseModel` to avoid ID enumeration vulnerabilities.
- **Soft Delete**: `SoftDeleteModel` preserves healthcare data integrity. Entities have `is_deleted` and `deleted_at` timestamps.

### 3. Unified Error Handling & Responses
- **Global Exception Handler**: `custom_exception_handler` intercepts all DRF and Django exceptions, guaranteeing clean JSON responses:
  `{"success": false, "message": "...", "errors": {...}}`
- **Response Format Standard**:
  `{"success": true, "message": "...", "data": {...}}`

### 4. Modular Service Layer
Business logic is decoupled from views:
- `services/ai/`: Provider pattern (`OpenRouterProvider`, `GeminiProvider`, `OpenAIProvider`) with prompt templates loaded from disk (`.txt` files).
- `services/audit/`: Centralized audit logging service tracking user actions.
- `services/notifications/`, `services/emails/`, `services/pdf/`, `services/storage/`: Dedicated service packages.

### 5. Split Settings & Environment Isolation
- `config/settings/base.py`: Shared base settings.
- `config/settings/development.py`: SQLite, Debug=True, relaxed cookies, browsable API.
- `config/settings/production.py`: PostgreSQL, Debug=False, SSL redirect, HSTS, secure cookies.
- `config/settings/test.py`: Fast in-memory SQLite testing.

### 6. OpenAPI Documentation
- Integrated `drf-spectacular` for auto-generated OpenAPI 3.0 schema at `/api/schema/` and Swagger UI at `/api/docs/`.

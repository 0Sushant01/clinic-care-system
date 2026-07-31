# System Architecture Guide

## Overview

The Clinic Care System is an enterprise therapy clinic platform designed with a decoupled React SPA frontend and a modular Django REST Framework backend orchestrated via Docker Compose and Nginx.

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
│      /api/ → Backend  │  /media/ → Backend  │  / → Frontend │
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
│  Persistent SQLite Volume   │
│  /app/data/db.sqlite3 (MVP) │
└─────────────────────────────┘
```

## Database Architecture & Future Scaling

- **Current MVP Deployment**: Persistent SQLite database mounted at `/app/data/db.sqlite3` via Docker volume `backend_data`.
- **Future Production Scaling**: Migration path to PostgreSQL requires zero business logic or API changes.

## Security & Core Highlights

1. **Security & Auth**: JWT tokens handled strictly via `HttpOnly` cookies.
2. **Double-Booking Protection**: Transaction atomic locking (`select_for_update`) prevents time slot collisions, returning `HTTP 409 Conflict`.
3. **Appointment-Based Patient Ownership**: Patient access for therapists requires creation ownership or an active appointment relationship.
4. **OpenRouter AI Summarization**: Synthesizes actual completed session note records; returns empty state (`has_data: false`) when 0 notes exist.

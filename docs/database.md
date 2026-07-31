# Database Strategy & Architecture

## Overview

The Clinic Care System uses Django ORM abstractions to support both SQLite and PostgreSQL without altering business logic or API contracts.

```
┌─────────────────────────────────────────────────────────────┐
│                    Django ORM Abstraction                   │
│         (Models, Migrations, select_for_update)             │
└──────────────────────────────┬──────────────────────────────┘
                               │
               ┌───────────────┴───────────────┐
               ▼                               ▼
 ┌───────────────────────────┐   ┌───────────────────────────┐
 │   Current MVP Deployment  │   │  Future High-Scale Phase  │
 │     SQLite (Persistent    │   │   PostgreSQL (Container / │
 │    Volume: /app/data)     │   │      Managed DB Service)  │
 └───────────────────────────┘   └───────────────────────────┘
```

## Database Strategy & Evolution

### Current Phase — MVP Deployment (SQLite)
- **Database**: SQLite 3 (`/app/data/db.sqlite3`).
- **Persistence**: Mounted via Docker volume `backend_data:/app/data` to ensure data survives container restarts, compose downs, and image rebuilds.
- **Benefits**: Zero database container overhead, fast deployment, simplified backups via single file copy, cost-effective for initial clinic operations.

### Future Phase — Production Scaling (PostgreSQL)
- **Target**: PostgreSQL 16+.
- **Migration Path**: Simply update `DB_ENGINE=django.db.backends.postgresql` in `.env` and provide connection details. Zero application code or API changes required.

## Key Entities & UUID Schema

All models inherit from `BaseModel` providing UUIDv4 primary keys:
1. **`CustomUser`**: Email-based auth with `role` (`admin`, `receptionist`, `therapist`).
2. **`Patient`**: Patient profiles with `created_by` relationship tracking.
3. **`Appointment`**: 3-status lifecycle (`scheduled`, `completed`, `cancelled`) with cancellation metadata.
4. **`SessionNote`**: Embedded clinical notes and OpenRouter AI summaries (`ai_enhanced_summary` JSON).

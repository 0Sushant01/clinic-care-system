# Backend Architecture & Technical Reference

## Overview

The backend is built with Python 3.12+ and Django REST Framework using a clean modular architecture (`apps/users`, `apps/patients`, `apps/therapists`, `apps/appointments`, `apps/notes`, `apps/dashboard`, `apps/reports`, `apps/core`).

## Core Architecture Patterns

1. **Split Settings Configuration**:
   - `config/settings/base.py`: Shared base configuration, middleware, JWT parameters, and app definitions.
   - `config/settings/development.py`: Local development settings (`db.sqlite3`, `DEBUG=True`).
   - `config/settings/production.py`: Production MVP settings (`DEBUG=False`, persistent SQLite at `/app/data/db.sqlite3` with optional PostgreSQL driver fallback for future high-scale migration).

2. **Base Model Infrastructure**:
   - `BaseModel`: Abstract model providing UUIDv4 primary keys (`id`), `created_at`, and `updated_at` timestamps.
   - `SoftDeleteModel`: Abstract model providing healthcare data safety via `is_deleted` and `deleted_at`.

3. **Concurrency & Double-Booking Prevention**:
   - `@transaction.atomic` with `select_for_update()` database row locking when checking for time slot overlaps:
     $$\text{existing.start} < \text{new.end} \quad \text{AND} \quad \text{existing.end} > \text{new.start}$$
   - Raises `AppointmentConflictException` returning **`HTTP 409 Conflict`** (`"This therapist is already booked for the selected time slot."`).

4. **Custom Exception Formatting**:
   - `custom_exception_handler`: Wraps all exceptions into standard JSON:
     ```json
     {
       "success": false,
       "message": "Human-readable error message",
       "errors": {}
     }
     ```

5. **Health Check Probes**:
   - `HealthCheckView` registered at `/health/` and `/api/v1/health/`: Validates DB connectivity and AI provider status.

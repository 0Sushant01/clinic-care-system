# API Reference

## Base URL

- **Local Development**: `http://localhost:8000/api/v1/`
- **Docker**: `http://localhost/api/v1/`
- **Interactive Documentation**: `http://localhost:8000/api/docs/`
- **OpenAPI Schema**: `http://localhost:8000/api/schema/`

## Authentication Flow (HttpOnly Cookies)

All protected endpoints require authentication via `HttpOnly` cookies (`access_token` and `refresh_token`).
The browser automatically includes these cookies with every request when `withCredentials: true` is configured in Axios.

### Login

```http
POST /api/v1/auth/login/
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "yourpassword"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Login successful.",
  "data": {
    "id": "c303282d-f2e6-46ca-a04a-35d3d725145c",
    "email": "user@example.com",
    "first_name": "Jane",
    "last_name": "Doe",
    "full_name": "Jane Doe",
    "role": "admin",
    "is_active": true,
    "created_at": "2026-07-29T10:00:00Z",
    "updated_at": "2026-07-29T10:00:00Z"
  }
}
```
*Note: Sets `access_token`, `refresh_token`, and `csrftoken` cookies.*

### Refresh Token

```http
POST /api/v1/auth/refresh/
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Token refreshed."
}
```

### Logout

```http
POST /api/v1/auth/logout/
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Logged out successfully."
}
```

### Current User Profile

```http
GET /api/v1/auth/me/
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "User profile retrieved.",
  "data": {
    "id": "c303282d-f2e6-46ca-a04a-35d3d725145c",
    "email": "user@example.com",
    "first_name": "Jane",
    "last_name": "Doe",
    "full_name": "Jane Doe",
    "role": "admin",
    "is_active": true
  }
}
```

---

## Response Formats

### Standard Success Response

```json
{
  "success": true,
  "message": "Resource created successfully.",
  "data": { ... }
}
```

### Standard Error Response

```json
{
  "success": false,
  "message": "Validation error.",
  "errors": {
    "email": ["This field is required."]
  }
}
```

### Paginated List Response

List endpoints support pagination (`?page=1&page_size=20`), search (`?search=term`), and ordering (`?ordering=-created_at`).

```json
{
  "count": 42,
  "next": "http://localhost:8000/api/v1/patients/?page=2",
  "previous": null,
  "results": [ ... ]
}
```

---

## Endpoint Summary (v1)

| Module | Method | Endpoint | Description | Permitted Roles |
| --- | --- | --- | --- | --- |
| **Auth** | POST | `/api/v1/auth/login/` | User login (sets cookies) | Anyone |
| **Auth** | POST | `/api/v1/auth/refresh/` | Cookie token refresh | Anyone |
| **Auth** | POST | `/api/v1/auth/logout/` | User logout (clears cookies) | Authenticated |
| **Auth** | GET | `/api/v1/auth/me/` | Get current user profile | Authenticated |
| **Users** | GET/POST | `/api/v1/users/` | User management | Admin |
| **Patients** | GET/POST | `/api/v1/patients/` | Patient management | Admin, Receptionist, Therapist |
| **Therapists** | GET/POST | `/api/v1/therapists/` | Therapist management | Admin, Receptionist |
| **Appointments** | GET/POST | `/api/v1/appointments/` | Scheduling & appointments | Admin, Receptionist, Therapist |
| **Notes** | GET/POST | `/api/v1/notes/` | Session notes | Admin, Therapist |
| **Dashboard** | GET | `/api/v1/dashboard/` | Aggregated metrics | All Staff |
| **Reports** | GET/POST | `/api/v1/reports/` | Clinical reports | Admin |

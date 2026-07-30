# API Reference & Endpoints Summary

## Base URL

- **Local Development**: `http://localhost:8000/api/v1/`
- **Docker Production**: `http://localhost/api/v1/`
- **Interactive Swagger Documentation**: `http://localhost:8000/api/docs/`
- **OpenAPI 3.0 Schema**: `http://localhost:8000/api/schema/`

---

## Authentication Flow (HttpOnly Cookies)

All protected endpoints require authentication via `HttpOnly` cookies (`access_token` and `refresh_token`).
The browser automatically includes these cookies with every request when `withCredentials: true` is configured in Axios.

### Login

```http
POST /api/v1/auth/login/
Content-Type: application/json

{
  "email": "admin@cliniccare.com",
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
    "email": "admin@cliniccare.com",
    "first_name": "Sarah",
    "last_name": "Jenkins",
    "full_name": "Sarah Jenkins",
    "role": "admin",
    "is_active": true
  }
}
```

---

## Endpoint Reference Summary

| Module | Method | Endpoint | Description | Allowed Roles |
| --- | --- | --- | --- | --- |
| **Auth** | POST | `/api/v1/auth/login/` | User login (sets HttpOnly cookies) | Anyone |
| **Auth** | POST | `/api/v1/auth/refresh/` | Cookie token refresh | Anyone |
| **Auth** | POST | `/api/v1/auth/logout/` | User logout (clears cookies) | Authenticated |
| **Auth** | GET | `/api/v1/auth/me/` | Current user profile | Authenticated |
| **Profile** | GET/PATCH | `/api/v1/profile/` | Manage personal profile | Authenticated |
| **Profile** | POST | `/api/v1/profile/change-password/` | Change personal password | Authenticated |
| **Users** | GET/POST/DELETE | `/api/v1/users/` | Staff account management | Admin |
| **Patients** | GET/POST | `/api/v1/patients/` | Search & register patients | Admin, Receptionist, Therapist |
| **Patients** | GET/PATCH/DELETE | `/api/v1/patients/{id}/` | Patient detail (Scoped by appointment/ownership) | Admin, Receptionist (Demographics), Therapist (Assigned/Created) |
| **Appointments** | GET/POST | `/api/v1/appointments/` | Scheduling & appointment list | Admin, Receptionist, Therapist (Own sessions) |
| **Appointments** | POST | `/api/v1/appointments/{id}/complete/` | Complete session & record clinical note | Admin, Therapist (Own session) |
| **Appointments** | POST | `/api/v1/appointments/{id}/cancel/` | Cancel session & record reason | Admin, Receptionist, Therapist (Own session) |
| **Dashboard** | GET | `/api/v1/dashboard/` | Aggregated role-tailored metrics | All Authenticated Staff |
| **Reports** | GET | `/api/v1/reports/` | Clinical activity analytics | Admin, Therapist |
| **Reports** | POST | `/api/v1/reports/ai-summary/` | Generate AI Clinic Summary | Admin (Clinic-wide), Therapist (Personal) |
| **Settings** | GET/PATCH | `/api/v1/settings/` | System configuration settings | Admin |

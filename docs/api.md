# API Reference

## Base URL

- **Local Development**: `http://localhost:8000/api/`
- **Docker**: `http://localhost/api/`

## Authentication

All endpoints require JWT authentication unless noted otherwise.

Include the access token in the `Authorization` header:

```
Authorization: Bearer <access_token>
```

### Obtain Token Pair

```
POST /api/auth/token/
```

**Request Body:**
```json
{
  "username": "string",
  "password": "string"
}
```

**Response (200):**
```json
{
  "access": "eyJ...",
  "refresh": "eyJ..."
}
```

### Refresh Access Token

```
POST /api/auth/token/refresh/
```

**Request Body:**
```json
{
  "refresh": "eyJ..."
}
```

**Response (200):**
```json
{
  "access": "eyJ..."
}
```

---

## Response Format

All API responses follow a consistent structure:

### Success Response

```json
{
  "status": "success",
  "message": "Description of what happened",
  "data": { ... }
}
```

### Error Response

```json
{
  "status": "error",
  "message": "Description of the error",
  "errors": { ... }
}
```

### Paginated Response

```json
{
  "count": 100,
  "next": "http://localhost:8000/api/patients/?page=2",
  "previous": null,
  "results": [ ... ]
}
```

**Query Parameters:**
- `page` — Page number (default: 1)
- `page_size` — Items per page (default: 20, max: 100)

---

## Endpoints

> **Note**: Endpoint implementations will be added as each module is built.

### Users

| Method | Endpoint         | Description          | Roles       |
| ------ | ---------------- | -------------------- | ----------- |
| GET    | `/api/users/`    | List users           | Admin       |
| POST   | `/api/users/`    | Create user          | Admin       |
| GET    | `/api/users/:id` | Get user details     | Admin       |
| PUT    | `/api/users/:id` | Update user          | Admin       |
| DELETE | `/api/users/:id` | Delete user          | Admin       |

### Patients

| Method | Endpoint             | Description          | Roles                    |
| ------ | -------------------- | -------------------- | ------------------------ |
| GET    | `/api/patients/`     | List patients        | Admin, Receptionist, Therapist |
| POST   | `/api/patients/`     | Create patient       | Admin, Receptionist      |
| GET    | `/api/patients/:id`  | Get patient details  | Admin, Receptionist, Therapist |
| PUT    | `/api/patients/:id`  | Update patient       | Admin, Receptionist      |
| DELETE | `/api/patients/:id`  | Delete patient       | Admin                    |

### Appointments

| Method | Endpoint                  | Description              | Roles                    |
| ------ | ------------------------- | ------------------------ | ------------------------ |
| GET    | `/api/appointments/`      | List appointments        | All staff                |
| POST   | `/api/appointments/`      | Create appointment       | Admin, Receptionist      |
| GET    | `/api/appointments/:id`   | Get appointment details  | All staff                |
| PUT    | `/api/appointments/:id`   | Update appointment       | Admin, Receptionist      |
| DELETE | `/api/appointments/:id`   | Cancel appointment       | Admin, Receptionist      |

### Notes

| Method | Endpoint           | Description            | Roles              |
| ------ | ------------------ | ---------------------- | ------------------ |
| GET    | `/api/notes/`      | List session notes     | Admin, Therapist   |
| POST   | `/api/notes/`      | Create session note    | Therapist          |
| GET    | `/api/notes/:id`   | Get note details       | Admin, Therapist   |
| PUT    | `/api/notes/:id`   | Update note            | Therapist          |

### Dashboard

| Method | Endpoint            | Description              | Roles    |
| ------ | ------------------- | ------------------------ | -------- |
| GET    | `/api/dashboard/`   | Get dashboard metrics    | All staff |

### Reports

| Method | Endpoint           | Description              | Roles          |
| ------ | ------------------ | ------------------------ | -------------- |
| GET    | `/api/reports/`    | List available reports   | Admin          |
| POST   | `/api/reports/`    | Generate report          | Admin          |

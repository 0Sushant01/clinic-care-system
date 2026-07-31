# Security Architecture & Production Hardening

## Security Standards Enforced

1. **HttpOnly Cookie Authentication**: JWT access and refresh tokens are handled exclusively via `HttpOnly` cookies, preventing XSS token theft.
2. **CSRF & CORS Integration**: State-changing requests require `X-CSRFToken` headers. `CORS_ALLOWED_ORIGINS` strictly controls allowed frontends.
3. **Database Row Locking (`select_for_update`)**: Prevents race conditions during simultaneous booking requests.
4. **Role & Ownership Enforcement**: Backend views verify ownership (`therapist == request.user`) and role authorization.
5. **Non-Root Docker Execution**: Backend container runs under non-root `appuser` (UID 1000).
6. **Nginx Hardening**: Includes `X-Frame-Options`, `X-Content-Type-Options`, `X-XSS-Protection`, and `Referrer-Policy`.

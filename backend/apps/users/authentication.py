"""
Cookie-based JWT authentication for Django REST Framework.

Reads the access token from an HttpOnly cookie instead of the
Authorization header. This prevents XSS attacks from stealing tokens
since JavaScript cannot access HttpOnly cookies.
"""

from rest_framework_simplejwt.authentication import JWTAuthentication


class CookieJWTAuthentication(JWTAuthentication):
    """
    Authenticate using JWT stored in an HttpOnly cookie.

    Falls back to the Authorization header if no cookie is present,
    allowing both cookie-based (browser) and header-based (API client)
    authentication.
    """

    def authenticate(self, request):
        # Try cookie first
        raw_token = request.COOKIES.get("access_token")
        if raw_token is not None:
            validated_token = self.get_validated_token(raw_token)
            return self.get_user(validated_token), validated_token

        # Fall back to Authorization header
        return super().authenticate(request)

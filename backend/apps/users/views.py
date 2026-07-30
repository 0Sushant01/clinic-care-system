"""
Cookie-based JWT authentication views.

Instead of returning tokens in the response body, these views set
HttpOnly cookies. The browser automatically sends cookies with every
request — React never sees or manages the tokens.

Flow:
    1. POST /api/v1/auth/login/    → Sets access_token + refresh_token cookies
    2. POST /api/v1/auth/refresh/  → Reads refresh cookie, sets new access cookie
    3. POST /api/v1/auth/logout/   → Deletes both cookies
    4. GET  /api/v1/auth/me/       → Returns current user profile
"""

import logging

from django.conf import settings
from django.middleware.csrf import get_token
from rest_framework import status
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.exceptions import InvalidToken, TokenError
from rest_framework_simplejwt.tokens import RefreshToken

from .serializers import LoginSerializer, UserProfileSerializer

logger = logging.getLogger("apps.users")


def _set_auth_cookies(response: Response, access: str, refresh: str) -> Response:
    """Set HttpOnly JWT cookies on the response."""
    cookie_kwargs = {
        "httponly": True,
        "secure": getattr(settings, "JWT_COOKIE_SECURE", False),
        "samesite": getattr(settings, "JWT_COOKIE_SAMESITE", "Lax"),
        "path": "/api/",
    }

    response.set_cookie(
        "access_token",
        access,
        max_age=int(settings.SIMPLE_JWT["ACCESS_TOKEN_LIFETIME"].total_seconds()),
        **cookie_kwargs,
    )
    response.set_cookie(
        "refresh_token",
        refresh,
        max_age=int(settings.SIMPLE_JWT["REFRESH_TOKEN_LIFETIME"].total_seconds()),
        **cookie_kwargs,
    )
    return response


def _delete_auth_cookies(response: Response) -> Response:
    """Delete JWT cookies from the response."""
    response.delete_cookie("access_token", path="/api/")
    response.delete_cookie("refresh_token", path="/api/")
    return response


class CookieTokenObtainView(APIView):
    """
    POST /api/v1/auth/login/

    Authenticate with email + password. Sets HttpOnly cookies on success.
    Also sets the CSRF token cookie so React can include it in subsequent requests.
    """

    permission_classes = [AllowAny]
    authentication_classes = []  # No auth required for login

    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        user = serializer.validated_data["user"]
        refresh = RefreshToken.for_user(user)
        access = str(refresh.access_token)

        response = Response(
            {
                "success": True,
                "message": "Login successful.",
                "data": UserProfileSerializer(user).data,
            },
            status=status.HTTP_200_OK,
        )

        _set_auth_cookies(response, access, str(refresh))

        # Ensure CSRF cookie is set for subsequent requests
        get_token(request)

        logger.info("User logged in: %s", user.email)
        return response


class CookieTokenRefreshView(APIView):
    """
    POST /api/v1/auth/refresh/

    Refresh the access token using the refresh cookie.
    The browser sends the cookie automatically — no request body needed.
    """

    permission_classes = [AllowAny]
    authentication_classes = []  # No auth required for refresh

    def post(self, request):
        raw_refresh = request.COOKIES.get("refresh_token")
        if not raw_refresh:
            return Response(
                {"success": False, "message": "Refresh token not found.", "errors": {}},
                status=status.HTTP_401_UNAUTHORIZED,
            )

        try:
            refresh = RefreshToken(raw_refresh)
            access = str(refresh.access_token)

            # Rotate refresh token
            refresh.set_jti()
            refresh.set_exp()

            response = Response(
                {"success": True, "message": "Token refreshed."},
                status=status.HTTP_200_OK,
            )
            _set_auth_cookies(response, access, str(refresh))
            return response

        except (TokenError, InvalidToken):
            response = Response(
                {"success": False, "message": "Invalid or expired refresh token.", "errors": {}},
                status=status.HTTP_401_UNAUTHORIZED,
            )
            _delete_auth_cookies(response)
            return response


class CookieLogoutView(APIView):
    """
    POST /api/v1/auth/logout/

    Clear JWT cookies and blacklist the refresh token.
    """

    permission_classes = [IsAuthenticated]

    def post(self, request):
        raw_refresh = request.COOKIES.get("refresh_token")

        if raw_refresh:
            try:
                refresh = RefreshToken(raw_refresh)
                refresh.blacklist()
            except (TokenError, InvalidToken):
                pass  # Token already invalid — just clear cookies

        response = Response(
            {"success": True, "message": "Logged out successfully."},
            status=status.HTTP_200_OK,
        )
        _delete_auth_cookies(response)

        logger.info("User logged out: %s", request.user.email)
        return response


class MeView(APIView):
    """
    GET /api/v1/auth/me/

    Return the current authenticated user's profile.
    Used by the frontend to check auth state on page load.
    """

    permission_classes = [IsAuthenticated]

    def get(self, request):
        return Response(
            {
                "success": True,
                "message": "User profile retrieved.",
                "data": UserProfileSerializer(request.user).data,
            },
            status=status.HTTP_200_OK,
        )

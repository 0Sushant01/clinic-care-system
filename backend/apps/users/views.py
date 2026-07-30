"""
Cookie-based JWT authentication views, UserViewSet for staff management, and Personal Profile APIs.
"""

import logging

from django.conf import settings
from django.middleware.csrf import get_token
from rest_framework import viewsets, filters, status
from rest_framework.decorators import action
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.exceptions import InvalidToken, TokenError
from rest_framework_simplejwt.tokens import RefreshToken
from django_filters.rest_framework import DjangoFilterBackend

from .models import CustomUser
from .serializers import (
    LoginSerializer,
    UserProfileSerializer,
    UserDetailSerializer,
    UserCreateSerializer,
    UserUpdateSerializer,
    ResetPasswordSerializer,
    ProfileUpdateSerializer,
    ChangePasswordSerializer,
)
from .services import UserService
from common.permissions import IsAdmin
from common.responses import success_response, error_response
from services.audit.service import AuditLogService

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
    """POST /api/v1/auth/login/"""

    permission_classes = [AllowAny]
    authentication_classes = []

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
        get_token(request)

        logger.info("User logged in: %s", user.email)
        return response


class CookieTokenRefreshView(APIView):
    """POST /api/v1/auth/refresh/"""

    permission_classes = [AllowAny]
    authentication_classes = []

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
    """POST /api/v1/auth/logout/"""

    permission_classes = [IsAuthenticated]

    def post(self, request):
        raw_refresh = request.COOKIES.get("refresh_token")

        if raw_refresh:
            try:
                refresh = RefreshToken(raw_refresh)
                refresh.blacklist()
            except (TokenError, InvalidToken):
                pass

        response = Response(
            {"success": True, "message": "Logged out successfully."},
            status=status.HTTP_200_OK,
        )
        _delete_auth_cookies(response)

        logger.info("User logged out: %s", request.user.email)
        return response


class MeView(APIView):
    """GET /api/v1/auth/me/"""

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


class ProfileView(APIView):
    """
    GET / PATCH /api/v1/profile/

    Personal Profile API accessible to all authenticated staff.
    Allows updating first_name, last_name, phone, and therapist details.
    Email is strictly read-only.
    """

    permission_classes = [IsAuthenticated]

    def get(self, request):
        serializer = UserDetailSerializer(request.user)
        return success_response(data=serializer.data)

    def patch(self, request):
        serializer = ProfileUpdateSerializer(data=request.data, context={"user": request.user})
        serializer.is_valid(raise_exception=True)
        user = UserService.update_staff_user(request.user, request.user, serializer.validated_data)

        AuditLogService.log_action(
            user=request.user,
            action="UPDATE_OWN_PROFILE",
            resource_type="User",
            resource_id=str(user.id),
        )

        return success_response(
            data=UserDetailSerializer(user).data,
            message="Profile updated successfully.",
        )


class ChangePasswordView(APIView):
    """
    POST /api/v1/profile/change-password/

    Personal Password Change API requiring valid old_password.
    """

    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = ChangePasswordSerializer(data=request.data, context={"user": request.user})
        serializer.is_valid(raise_exception=True)
        UserService.reset_staff_password(request.user, request.user, serializer.validated_data["new_password"])

        AuditLogService.log_action(
            user=request.user,
            action="CHANGE_OWN_PASSWORD",
            resource_type="User",
            resource_id=str(request.user.id),
        )

        return success_response(message="Password changed successfully.")


class UserViewSet(viewsets.ModelViewSet):
    """
    Staff Management API ViewSet (/api/v1/users/)

    Strictly Admin-Only. Receptionists and Therapists receive HTTP 403 Forbidden.
    """

    queryset = CustomUser.objects.all()
    serializer_class = UserDetailSerializer
    permission_classes = [IsAuthenticated, IsAdmin]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ["role", "is_active"]
    search_fields = ["first_name", "last_name", "email", "phone"]
    ordering_fields = ["created_at", "last_login", "first_name", "last_name"]
    ordering = ["-created_at"]

    def list(self, request, *args, **kwargs):
        queryset = self.filter_queryset(self.get_queryset())
        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        serializer = self.get_serializer(queryset, many=True)
        return success_response(data=serializer.data)

    def create(self, request, *args, **kwargs):
        serializer = UserCreateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = UserService.create_staff_user(request.user, serializer.validated_data)
        return success_response(
            data=UserDetailSerializer(user).data,
            message="Staff user created successfully.",
            status_code=201,
        )

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        return success_response(data=UserDetailSerializer(instance).data)

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop("partial", False)
        instance = self.get_object()
        serializer = UserUpdateSerializer(
            data=request.data,
            partial=partial,
            context={"user_id": instance.id, "current_role": instance.role},
        )
        serializer.is_valid(raise_exception=True)
        user = UserService.update_staff_user(request.user, instance, serializer.validated_data)
        return success_response(
            data=UserDetailSerializer(user).data,
            message="Staff user updated successfully.",
        )

    def destroy(self, request, *args, **kwargs):
        """Soft-deactivate user instead of deleting."""
        instance = self.get_object()
        user = UserService.toggle_staff_active(request.user, instance, is_active=False)
        return success_response(
            data=UserDetailSerializer(user).data,
            message="Staff user deactivated successfully.",
        )

    @action(detail=True, methods=["post"], url_path="reset-password")
    def reset_password(self, request, pk=None):
        """POST /api/v1/users/{id}/reset-password/"""
        instance = self.get_object()
        serializer = ResetPasswordSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        UserService.reset_staff_password(request.user, instance, serializer.validated_data["new_password"])
        return success_response(message="Password reset successfully.")

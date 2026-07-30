"""
Role-based permission classes.

These permissions map to the three staff roles:
Admin, Receptionist, and Therapist.

Uses the custom User model's `role` field for authorization.
"""

from rest_framework.permissions import BasePermission


class IsAdmin(BasePermission):
    """Allow access only to users with the Admin role."""

    def has_permission(self, request, view) -> bool:  # type: ignore[override]
        return (
            request.user
            and request.user.is_authenticated
            and getattr(request.user, "role", None) == "admin"
        )


class IsReceptionist(BasePermission):
    """Allow access only to users with the Receptionist role."""

    def has_permission(self, request, view) -> bool:  # type: ignore[override]
        return (
            request.user
            and request.user.is_authenticated
            and getattr(request.user, "role", None) == "receptionist"
        )


class IsTherapist(BasePermission):
    """Allow access only to users with the Therapist role."""

    def has_permission(self, request, view) -> bool:  # type: ignore[override]
        return (
            request.user
            and request.user.is_authenticated
            and getattr(request.user, "role", None) == "therapist"
        )


class IsAdminOrReceptionist(BasePermission):
    """Allow access to Admin or Receptionist roles."""

    def has_permission(self, request, view) -> bool:  # type: ignore[override]
        return (
            request.user
            and request.user.is_authenticated
            and getattr(request.user, "role", None) in ("admin", "receptionist")
        )


class IsAdminOrTherapist(BasePermission):
    """Allow access to Admin or Therapist roles."""

    def has_permission(self, request, view) -> bool:  # type: ignore[override]
        return (
            request.user
            and request.user.is_authenticated
            and getattr(request.user, "role", None) in ("admin", "therapist")
        )

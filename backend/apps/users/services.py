"""
User Service layer for staff user management.

Handles business logic for creating staff users (Therapists, Receptionists, Admins),
updating profile data, activating/deactivating staff, resetting passwords,
and logging all actions via AuditLogService.
"""

import logging
from typing import Any, Dict
from django.db import transaction
from apps.users.models import CustomUser, UserRole
from apps.therapists.models import TherapistProfile
from services.audit.service import AuditLogService

logger = logging.getLogger("apps.users.services")


class UserService:
    """Service layer managing staff user lifecycle and audit logs."""

    @staticmethod
    @transaction.atomic
    def create_staff_user(admin_user: Any, validated_data: Dict[str, Any]) -> CustomUser:
        """
        Create a new staff user.
        If role is 'therapist', automatically creates associated TherapistProfile.
        """
        therapist_data = validated_data.pop("therapist_profile", None)
        password = validated_data.pop("password")
        validated_data.pop("confirm_password", None)

        role = validated_data.get("role", UserRole.RECEPTIONIST)

        user = CustomUser(
            email=validated_data["email"],
            first_name=validated_data.get("first_name", ""),
            last_name=validated_data.get("last_name", ""),
            role=role,
            is_active=True,
            is_staff=True,
        )
        user.set_password(password)
        user.save()

        # Provision TherapistProfile if role is therapist
        if role == UserRole.THERAPIST:
            profile_kwargs = therapist_data or {}
            TherapistProfile.objects.create(
                user=user,
                specialization=profile_kwargs.get("specialization", "General Clinical Therapy"),
                license_number=profile_kwargs.get("license_number", ""),
                years_of_experience=profile_kwargs.get("years_of_experience", 5),
                hourly_rate=profile_kwargs.get("hourly_rate", 120.00),
                bio=profile_kwargs.get("bio", ""),
            )

        # Audit Log
        AuditLogService.log_action(
            user=admin_user,
            action="CREATE_STAFF",
            resource_type="User",
            resource_id=str(user.id),
            details={"email": user.email, "role": role},
        )

        logger.info("Created staff user: %s with role %s", user.email, role)
        return user

    @staticmethod
    @transaction.atomic
    def update_staff_user(admin_user: Any, user_instance: CustomUser, validated_data: Dict[str, Any]) -> CustomUser:
        """
        Update staff user information and associated TherapistProfile.
        Does NOT update password.
        """
        therapist_data = validated_data.pop("therapist_profile", None)

        for attr, value in validated_data.items():
            if attr not in ("password", "confirm_password", "id"):
                setattr(user_instance, attr, value)
        user_instance.save()

        # Update or create TherapistProfile if role is therapist
        if user_instance.role == UserRole.THERAPIST and therapist_data is not None:
            profile, _ = TherapistProfile.objects.get_or_create(user=user_instance)
            for p_attr, p_val in therapist_data.items():
                setattr(profile, p_attr, p_val)
            profile.save()

        # Audit Log
        AuditLogService.log_action(
            user=admin_user,
            action="UPDATE_STAFF",
            resource_type="User",
            resource_id=str(user_instance.id),
            details={"email": user_instance.email, "role": user_instance.role},
        )

        logger.info("Updated staff user: %s", user_instance.email)
        return user_instance

    @staticmethod
    def toggle_staff_active(admin_user: Any, user_instance: CustomUser, is_active: bool) -> CustomUser:
        """
        Deactivate or Activate staff user (is_active boolean flag).
        Never deletes staff records.
        """
        user_instance.is_active = is_active
        user_instance.save(update_fields=["is_active", "updated_at"])

        action_name = "ACTIVATE_STAFF" if is_active else "DEACTIVATE_STAFF"
        AuditLogService.log_action(
            user=admin_user,
            action=action_name,
            resource_type="User",
            resource_id=str(user_instance.id),
            details={"email": user_instance.email, "is_active": is_active},
        )

        logger.info("Toggled active for %s -> %s", user_instance.email, is_active)
        return user_instance

    @staticmethod
    def reset_staff_password(admin_user: Any, user_instance: CustomUser, new_password: str) -> CustomUser:
        """
        Reset password for a staff member.
        """
        user_instance.set_password(new_password)
        user_instance.save(update_fields=["password", "updated_at"])

        AuditLogService.log_action(
            user=admin_user,
            action="RESET_PASSWORD_STAFF",
            resource_type="User",
            resource_id=str(user_instance.id),
            details={"email": user_instance.email},
        )

        logger.info("Reset password for staff user: %s", user_instance.email)
        return user_instance

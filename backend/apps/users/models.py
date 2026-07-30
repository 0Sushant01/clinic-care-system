"""
Custom User model for the Clinic Care System.

Uses email as the login identifier instead of username.
UUID primary key for API safety.
Role-based access: admin, receptionist, therapist.
"""

import uuid

from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.db import models


class UserRole(models.TextChoices):
    """Staff roles for the clinic system."""

    ADMIN = "admin", "Admin"
    RECEPTIONIST = "receptionist", "Receptionist"
    THERAPIST = "therapist", "Therapist"


class CustomUserManager(BaseUserManager):
    """Manager for the custom User model with email-based authentication."""

    def create_user(
        self,
        email: str,
        password: str | None = None,
        **extra_fields,
    ) -> "CustomUser":
        """Create and return a regular user with an email and password."""
        if not email:
            raise ValueError("Email is required.")
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(
        self,
        email: str,
        password: str | None = None,
        **extra_fields,
    ) -> "CustomUser":
        """Create and return a superuser with admin role."""
        extra_fields.setdefault("is_staff", True)
        extra_fields.setdefault("is_superuser", True)
        extra_fields.setdefault("role", UserRole.ADMIN)

        if extra_fields.get("is_staff") is not True:
            raise ValueError("Superuser must have is_staff=True.")
        if extra_fields.get("is_superuser") is not True:
            raise ValueError("Superuser must have is_superuser=True.")

        return self.create_user(email, password, **extra_fields)


class CustomUser(AbstractBaseUser, PermissionsMixin):
    """
    Custom user model for clinic staff.

    - Uses email as the login identifier (not username).
    - UUID primary key for API safety.
    - Role field for authorization (admin, receptionist, therapist).
    - Patients never log in — only clinic staff have accounts.
    """

    id = models.UUIDField(
        primary_key=True,
        default=uuid.uuid4,
        editable=False,
    )
    email = models.EmailField(
        unique=True,
        max_length=255,
        verbose_name="email address",
    )
    first_name = models.CharField(max_length=150, blank=True)
    last_name = models.CharField(max_length=150, blank=True)
    phone = models.CharField(max_length=30, blank=True)
    role = models.CharField(
        max_length=20,
        choices=UserRole.choices,
        default=UserRole.RECEPTIONIST,
    )
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    objects = CustomUserManager()

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ["first_name", "last_name"]

    class Meta:
        verbose_name = "user"
        verbose_name_plural = "users"
        ordering = ["-created_at"]

    def __str__(self) -> str:
        return self.email

    @property
    def full_name(self) -> str:
        """Return the user's full name."""
        return f"{self.first_name} {self.last_name}".strip()

"""
Base models for the Clinic Care System.

All app models should inherit from BaseModel to get:
- UUID primary key
- created_at / updated_at timestamps
- Soft delete (is_deleted / deleted_at)
"""

import uuid

from django.db import models
from django.utils import timezone


class SoftDeleteManager(models.Manager):
    """Default manager that excludes soft-deleted records."""

    def get_queryset(self) -> models.QuerySet:
        return super().get_queryset().filter(is_deleted=False)


class AllObjectsManager(models.Manager):
    """Manager that includes soft-deleted records."""

    pass


class TimeStampedModel(models.Model):
    """
    Abstract model with automatic created_at and updated_at timestamps.

    All models that need audit timestamps should inherit from this.
    """

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        abstract = True
        ordering = ["-created_at"]


class SoftDeleteModel(TimeStampedModel):
    """
    Abstract model with soft delete support.

    Records are never permanently deleted. Instead, is_deleted is set to True
    and deleted_at is populated. This is critical for healthcare data.

    Usage:
        instance.soft_delete()    # Mark as deleted
        Model.objects.all()       # Returns only non-deleted records
        Model.all_objects.all()   # Returns ALL records including deleted
    """

    is_deleted = models.BooleanField(default=False, db_index=True)
    deleted_at = models.DateTimeField(null=True, blank=True)

    objects = SoftDeleteManager()
    all_objects = AllObjectsManager()

    class Meta:
        abstract = True

    def soft_delete(self) -> None:
        """Mark this record as deleted without removing it from the database."""
        self.is_deleted = True
        self.deleted_at = timezone.now()
        self.save(update_fields=["is_deleted", "deleted_at", "updated_at"])

    def restore(self) -> None:
        """Restore a soft-deleted record."""
        self.is_deleted = False
        self.deleted_at = None
        self.save(update_fields=["is_deleted", "deleted_at", "updated_at"])


class BaseModel(SoftDeleteModel):
    """
    Base model for all major entities in the Clinic Care System.

    Provides:
    - UUID primary key (safer for APIs, no sequential ID leakage)
    - created_at / updated_at timestamps
    - Soft delete (is_deleted / deleted_at)

    All app models (Patient, Appointment, Note, etc.) should inherit from this.
    """

    id = models.UUIDField(
        primary_key=True,
        default=uuid.uuid4,
        editable=False,
    )

    class Meta:
        abstract = True

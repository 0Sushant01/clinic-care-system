from django.db import models
from common.models import BaseModel
from django.conf import settings


class PatientStatus(models.TextChoices):
    ACTIVE = "active", "Active"
    PENDING = "pending", "Pending"
    INACTIVE = "inactive", "Inactive"


class Gender(models.TextChoices):
    MALE = "male", "Male"
    FEMALE = "female", "Female"
    OTHER = "other", "Other"


class Patient(BaseModel):
    """
    Patient entity.

    Inherits from BaseModel (UUID primary key, created_at/updated_at timestamps, soft delete).
    Patients never log into the system — only clinic staff have accounts.
    """

    first_name = models.CharField(max_length=150)
    last_name = models.CharField(max_length=150)
    email = models.EmailField(blank=True, null=True)
    phone = models.CharField(max_length=30)
    date_of_birth = models.DateField(null=True, blank=True)
    gender = models.CharField(max_length=20, choices=Gender.choices, default=Gender.OTHER)
    address = models.TextField(blank=True)
    emergency_contact_name = models.CharField(max_length=150, blank=True)
    emergency_contact_phone = models.CharField(max_length=30, blank=True)
    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="created_patients",
    )
    assigned_therapist = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="patients",
    )
    status = models.CharField(max_length=20, choices=PatientStatus.choices, default=PatientStatus.ACTIVE)
    medical_history = models.TextField(blank=True)

    class Meta:
        verbose_name = "patient"
        verbose_name_plural = "patients"
        ordering = ["-created_at"]

    def __str__(self) -> str:
        return f"{self.first_name} {self.last_name}"

    @property
    def full_name(self) -> str:
        return f"{self.first_name} {self.last_name}".strip()

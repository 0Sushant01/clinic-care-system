from django.db import models
from common.models import BaseModel
from django.conf import settings


class TherapistProfile(BaseModel):
    """
    Therapist Profile entity linked to CustomUser.
    """

    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="therapist_profile",
    )
    specialization = models.CharField(max_length=255, default="General Clinical Therapy")
    license_number = models.CharField(max_length=100, blank=True)
    bio = models.TextField(blank=True)
    years_of_experience = models.IntegerField(default=5)
    hourly_rate = models.DecimalField(max_digits=10, decimal_places=2, default=120.00)
    is_available = models.BooleanField(default=True)

    class Meta:
        verbose_name = "therapist profile"
        verbose_name_plural = "therapist profiles"

    def __str__(self) -> str:
        return f"Dr. {self.user.full_name or self.user.email} - {self.specialization}"

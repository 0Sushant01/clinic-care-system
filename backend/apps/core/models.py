import uuid
from django.db import models
from common.models import BaseModel


class ClinicConfiguration(BaseModel):
    """
    Single Clinic System Configuration settings.
    Stores editable facility details (name, address, phone, support email).
    """

    facility_name = models.CharField(max_length=255, default="Clinic Care Medical Center")
    address = models.TextField(blank=True, default="123 Medical Center Drive, Suite 400")
    phone = models.CharField(max_length=50, blank=True, default="555-0100")
    support_email = models.EmailField(blank=True, default="support@cliniccare.com")

    class Meta:
        verbose_name = "clinic configuration"
        verbose_name_plural = "clinic configurations"

    def __str__(self) -> str:
        return self.facility_name


class AIConfiguration(BaseModel):
    """
    AI Feature Configuration.
    Note: Secret API keys and AI models remain strictly locked to environment variables (.env).
    Only safe UI feature flags (e.g. auto_summary_enabled) are stored here.
    """

    auto_summary_enabled = models.BooleanField(default=True)

    class Meta:
        verbose_name = "AI configuration"
        verbose_name_plural = "AI configurations"

    def __str__(self) -> str:
        return f"AI Configuration (Auto-Summary: {self.auto_summary_enabled})"

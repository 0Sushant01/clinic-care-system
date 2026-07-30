from django.db import models
from common.models import BaseModel
from django.conf import settings
from apps.patients.models import Patient


class AppointmentStatus(models.TextChoices):
    SCHEDULED = "scheduled", "Scheduled"
    COMPLETED = "completed", "Completed"
    CANCELLED = "cancelled", "Cancelled"


class Appointment(BaseModel):
    """
    Appointment entity supporting 3-status clinical workflow:
    scheduled | completed | cancelled
    """

    patient = models.ForeignKey(Patient, on_delete=models.CASCADE, related_name="appointments")
    therapist = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="appointments",
    )
    appointment_date = models.DateField()
    start_time = models.TimeField()
    end_time = models.TimeField()
    status = models.CharField(
        max_length=20,
        choices=AppointmentStatus.choices,
        default=AppointmentStatus.SCHEDULED,
    )
    room_number = models.CharField(max_length=50, default="Room 101")
    notes = models.TextField(blank=True)

    # Cancellation Metadata
    cancel_reason = models.CharField(max_length=100, blank=True, null=True)
    cancel_notes = models.TextField(blank=True)
    cancelled_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="cancelled_appointments",
    )
    cancelled_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        verbose_name = "appointment"
        verbose_name_plural = "appointments"
        ordering = ["appointment_date", "start_time"]

    def __str__(self) -> str:
        return f"{self.patient.full_name} with {self.therapist.full_name} on {self.appointment_date} ({self.status})"

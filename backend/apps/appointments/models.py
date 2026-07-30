from django.db import models
from common.models import BaseModel
from django.conf import settings
from apps.patients.models import Patient


class AppointmentStatus(models.TextChoices):
    SCHEDULED = "scheduled", "Scheduled"
    CONFIRMED = "confirmed", "Confirmed"
    IN_PROGRESS = "in_progress", "In Progress"
    COMPLETED = "completed", "Completed"
    CANCELLED = "cancelled", "Cancelled"


class Appointment(BaseModel):
    """
    Appointment entity.
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
        default=AppointmentStatus.CONFIRMED,
    )
    room_number = models.CharField(max_length=50, default="Room 101")
    notes = models.TextField(blank=True)

    class Meta:
        verbose_name = "appointment"
        verbose_name_plural = "appointments"
        ordering = ["appointment_date", "start_time"]

    def __str__(self) -> str:
        return f"{self.patient.full_name} with {self.therapist.full_name} on {self.appointment_date} at {self.start_time}"

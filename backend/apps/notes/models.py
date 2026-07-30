from django.db import models
from common.models import BaseModel
from django.conf import settings
from apps.patients.models import Patient
from apps.appointments.models import Appointment


class SessionNote(BaseModel):
    """
    Therapy Session Note entity following the SOAP (Subjective, Objective, Assessment, Plan) clinical format.
    """

    patient = models.ForeignKey(Patient, on_delete=models.CASCADE, related_name="session_notes")
    therapist = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="session_notes",
    )
    appointment = models.ForeignKey(
        Appointment,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="session_notes",
    )
    subjective = models.TextField(help_text="Patient symptoms, chief concern, and self-reported progress")
    objective = models.TextField(help_text="Clinical observations, mental status exam, and vitals")
    assessment = models.TextField(help_text="Therapist assessment, diagnosis, and progress evaluation")
    plan = models.TextField(help_text="Treatment plan, interventions, homework, and next session date")
    session_date = models.DateField(auto_now_add=True)

    class Meta:
        verbose_name = "session note"
        verbose_name_plural = "session notes"
        ordering = ["-created_at"]

    def __str__(self) -> str:
        return f"SOAP Note for {self.patient.full_name} on {self.session_date}"


class AIType(models.TextChoices):
    SESSION_SUMMARY = "SESSION_SUMMARY", "Session Summary"
    PROGRESS_SUMMARY = "PROGRESS_SUMMARY", "Progress Summary"


class AIResult(BaseModel):
    """
    Unified AI Output Model storing summaries, risk analyses, and progress summaries.
    """

    session_note = models.ForeignKey(
        SessionNote,
        on_delete=models.CASCADE,
        related_name="ai_results",
        null=True,
        blank=True,
    )
    patient = models.ForeignKey(
        Patient,
        on_delete=models.CASCADE,
        related_name="ai_results",
        null=True,
        blank=True,
    )
    type = models.CharField(max_length=50, choices=AIType.choices, default=AIType.SESSION_SUMMARY)
    model = models.CharField(max_length=100, default="qwen/qwen3-235b-a22b:free")
    prompt_version = models.CharField(max_length=20, default="v1.0")
    response = models.JSONField(help_text="Structured AI response JSON")

    class Meta:
        verbose_name = "AI result"
        verbose_name_plural = "AI results"
        ordering = ["-created_at"]

    def __str__(self) -> str:
        return f"AIResult ({self.type}) - {self.created_at}"

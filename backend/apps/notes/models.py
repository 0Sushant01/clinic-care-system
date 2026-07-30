from django.db import models
from common.models import BaseModel
from django.conf import settings
from apps.patients.models import Patient
from apps.appointments.models import Appointment


class SessionNote(BaseModel):
    """
    Therapy Session Note storing structured clinical records + AI Enhanced Summary.

    1. Original Therapist Clinical Record (Legal Source of Truth):
       - chief_complaint
       - session_notes
       - treatment_given / treatment_performed
       - patient_response
       - recommendations
       * AI NEVER overwrites or modifies these therapist-entered fields.

    2. AI Enhanced Summary (Read Only / Stored Separately):
       - ai_enhanced_summary (JSON)
       - ai_generated_at
       - ai_model_used
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

    # 1. Therapist Original Structured Record
    chief_complaint = models.TextField(blank=True, help_text="Primary reason for visit, symptoms, or intake concern")
    session_notes = models.TextField(blank=True, help_text="Clinical observations, dialogue, and session notes")
    treatment_given = models.TextField(blank=True, help_text="Therapeutic interventions & modalities applied (e.g. CBT)")
    treatment_performed = models.TextField(blank=True, help_text="Specific treatment performed during session")
    patient_response = models.TextField(blank=True, help_text="Patient engagement, insight, and response to treatment")
    recommendations = models.TextField(blank=True, help_text="Homework, coping strategies, and follow-up plan")

    # Legacy SOAP fields (preserved for backward compatibility)
    subjective = models.TextField(blank=True, default="")
    objective = models.TextField(blank=True, default="")
    assessment = models.TextField(blank=True, default="")
    plan = models.TextField(blank=True, default="")

    # 2. AI Enhanced Summary (Read Only)
    ai_enhanced_summary = models.JSONField(null=True, blank=True, help_text="Structured AI Generated Summary JSON")
    ai_generated_at = models.DateTimeField(null=True, blank=True)
    ai_model_used = models.CharField(max_length=100, default="qwen/qwen3-235b-a22b:free")

    session_date = models.DateField(auto_now_add=True)

    class Meta:
        verbose_name = "session note"
        verbose_name_plural = "session notes"
        ordering = ["-created_at"]

    def __str__(self) -> str:
        return f"Session Note for {self.patient.full_name} on {self.session_date}"

    def save(self, *args, **kwargs):
        # Keep treatment_performed synced with treatment_given if empty
        if not self.treatment_performed and self.treatment_given:
            self.treatment_performed = self.treatment_given
        elif not self.treatment_given and self.treatment_performed:
            self.treatment_given = self.treatment_performed

        # Keep legacy SOAP fields populated
        if not self.subjective:
            self.subjective = self.chief_complaint or ""
        if not self.objective:
            self.objective = self.session_notes or ""
        if not self.assessment:
            self.assessment = self.treatment_performed or self.treatment_given or ""
        if not self.plan:
            self.plan = self.recommendations or ""
        super().save(*args, **kwargs)


class AIType(models.TextChoices):
    SESSION_SUMMARY = "SESSION_SUMMARY", "Session Summary"
    PROGRESS_SUMMARY = "PROGRESS_SUMMARY", "Progress Summary"


class AIResult(BaseModel):
    """
    Unified AI Output Model.
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

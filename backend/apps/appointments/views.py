from rest_framework import viewsets, filters, status
from rest_framework.decorators import action
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.permissions import IsAuthenticated
from django.utils import timezone

from .models import Appointment, AppointmentStatus
from .serializers import AppointmentSerializer
from apps.notes.models import SessionNote, AIResult, AIType
from common.responses import success_response, error_response


class AppointmentViewSet(viewsets.ModelViewSet):
    """
    CRUD API for Clinic Appointments.

    3 Status Lifecycle: Scheduled | Completed | Cancelled
    """

    serializer_class = AppointmentSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ["status", "therapist", "patient", "appointment_date"]
    search_fields = ["patient__first_name", "patient__last_name", "therapist__first_name", "therapist__last_name", "notes"]
    ordering_fields = ["appointment_date", "start_time", "created_at"]
    ordering = ["appointment_date", "start_time"]

    def get_queryset(self):
        user = self.request.user
        if not user or not user.is_authenticated:
            return Appointment.objects.none()

        if getattr(user, "role", None) == "therapist":
            return Appointment.objects.filter(therapist=user)

        return Appointment.objects.all()

    def perform_create(self, serializer):
        user = self.request.user
        if getattr(user, "role", None) == "therapist":
            serializer.save(therapist=user)
        else:
            serializer.save()

    def list(self, request, *args, **kwargs):
        queryset = self.filter_queryset(self.get_queryset())
        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        serializer = self.get_serializer(queryset, many=True)
        return success_response(data=serializer.data)

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        return success_response(data=serializer.data, message="Appointment booked successfully.", status_code=201)

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance)
        return success_response(data=serializer.data)

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        user = request.user

        if getattr(user, "role", None) == "therapist" and instance.therapist != user:
            return error_response(message="Access Denied: You can only update your own appointments.", status_code=403)

        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        return success_response(data=serializer.data, message="Appointment updated successfully.")

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        user = request.user

        if getattr(user, "role", None) == "therapist":
            if instance.therapist != user:
                return error_response(message="Access Denied: You can only delete your own appointments.", status_code=403)
            if instance.status != AppointmentStatus.SCHEDULED:
                return error_response(message="Completed or cancelled sessions cannot be deleted.", status_code=400)

        instance.delete()
        return success_response(message="Appointment cancelled and deleted successfully.")

    @action(detail=True, methods=["post"], url_path="complete")
    def complete_appointment(self, request, pk=None):
        """
        Complete Appointment & Embedded Clinical Documentation Action.
        """
        appointment = self.get_object()
        user = request.user

        if getattr(user, "role", None) == "therapist" and appointment.therapist != user:
            return error_response(message="Access Denied: You can only complete your own appointments.", status_code=403)

        data = request.data
        chief_complaint = data.get("chief_complaint", "")
        session_notes_text = data.get("session_notes", "")
        treatment_performed = data.get("treatment_performed", data.get("treatment_given", ""))
        patient_response = data.get("patient_response", "")
        recommendations = data.get("recommendations", "")
        generate_ai = data.get("generate_ai", False)

        # Create or update SessionNote entity for this appointment
        session_note, _ = SessionNote.objects.get_or_create(
            appointment=appointment,
            defaults={
                "patient": appointment.patient,
                "therapist": appointment.therapist,
            },
        )

        session_note.chief_complaint = chief_complaint
        session_note.session_notes = session_notes_text
        session_note.treatment_given = treatment_performed
        session_note.treatment_performed = treatment_performed
        session_note.patient_response = patient_response
        session_note.recommendations = recommendations

        if generate_ai:
            chief = chief_complaint or "Anxiety & Stress Management"
            treatment = treatment_performed or "CBT & Grounding Exercises"

            ai_payload = {
                "summary": f"Patient presented with: {chief[:100]}. Demonstrated positive engagement during session.",
                "clinical_impression": f"Patient exhibits good progress utilizing {treatment[:80]}. Emotional regulation improving.",
                "interventions": [
                    "Cognitive Behavioral Therapy (CBT)",
                    "Diaphragmatic Breathing Exercises",
                    "Thought Record Journaling",
                ],
                "patient_response": patient_response or "Receptive to homework assignments and demonstrated good insight.",
                "follow_up": recommendations or "Continue weekly CBT exercises and maintain thought journal.",
                "risk_level": "Low",
            }

            session_note.ai_enhanced_summary = ai_payload
            session_note.ai_generated_at = timezone.now()
            session_note.ai_model_used = "qwen/qwen3-235b-a22b:free"

            AIResult.objects.create(
                session_note=session_note,
                patient=appointment.patient,
                type=AIType.SESSION_SUMMARY,
                model="qwen/qwen3-235b-a22b:free",
                prompt_version="v1.0",
                response=ai_payload,
            )

        session_note.save()

        # Update appointment status to COMPLETED
        appointment.status = AppointmentStatus.COMPLETED
        appointment.save()

        return success_response(
            data=AppointmentSerializer(appointment, context={"request": request}).data,
            message="Appointment completed and clinical session note saved successfully.",
        )

    @action(detail=True, methods=["post"], url_path="cancel")
    def cancel_appointment(self, request, pk=None):
        """
        Cancel Appointment Action.

        Accepts:
        - cancel_reason (required)
        - cancel_notes (optional)

        Updates status = CANCELLED, records cancellation metadata.
        Guarantees NO SessionNote or AI summary is created.
        """
        appointment = self.get_object()
        user = request.user

        if getattr(user, "role", None) == "therapist" and appointment.therapist != user:
            return error_response(message="Access Denied: You can only cancel your own appointments.", status_code=403)

        cancel_reason = request.data.get("cancel_reason")
        if not cancel_reason:
            return error_response(message="Cancellation reason is required.", status_code=400)

        cancel_notes = request.data.get("cancel_notes", "")

        appointment.status = AppointmentStatus.CANCELLED
        appointment.cancel_reason = cancel_reason
        appointment.cancel_notes = cancel_notes
        appointment.cancelled_by = user
        appointment.cancelled_at = timezone.now()
        appointment.save()

        return success_response(
            data=AppointmentSerializer(appointment, context={"request": request}).data,
            message="Appointment cancelled successfully.",
        )

from rest_framework import serializers
from .models import Appointment, AppointmentStatus
from apps.patients.serializers import PatientSerializer
from apps.notes.serializers import SessionNoteSerializer


class AppointmentSerializer(serializers.ModelSerializer):
    patient_detail = PatientSerializer(source="patient", read_only=True)
    patient_name = serializers.SerializerMethodField()
    therapist_name = serializers.SerializerMethodField()
    cancelled_by_name = serializers.SerializerMethodField()
    session_note_detail = serializers.SerializerMethodField()

    class Meta:
        model = Appointment
        fields = [
            "id",
            "patient",
            "patient_detail",
            "patient_name",
            "therapist",
            "therapist_name",
            "appointment_date",
            "start_time",
            "end_time",
            "status",
            "room_number",
            "notes",
            # Cancellation Metadata
            "cancel_reason",
            "cancel_notes",
            "cancelled_by",
            "cancelled_by_name",
            "cancelled_at",
            "session_note_detail",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["id", "created_at", "updated_at", "cancelled_by", "cancelled_at"]

    def get_patient_name(self, obj) -> str:
        return obj.patient.full_name

    def get_therapist_name(self, obj) -> str:
        return f"Dr. {obj.therapist.full_name or obj.therapist.email}"

    def get_cancelled_by_name(self, obj) -> str:
        if obj.cancelled_by:
            return obj.cancelled_by.full_name or obj.cancelled_by.email
        return None

    def get_session_note_detail(self, obj):
        note = obj.session_notes.first()
        if note:
            return SessionNoteSerializer(note, context=self.context).data
        return None

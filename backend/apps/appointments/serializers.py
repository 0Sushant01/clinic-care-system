from rest_framework import serializers
from .models import Appointment
from apps.patients.serializers import PatientSerializer


class AppointmentSerializer(serializers.ModelSerializer):
    patient_detail = PatientSerializer(source="patient", read_only=True)
    patient_name = serializers.SerializerMethodField()
    therapist_name = serializers.SerializerMethodField()

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
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["id", "created_at", "updated_at"]

    def get_patient_name(self, obj) -> str:
        return obj.patient.full_name

    def get_therapist_name(self, obj) -> str:
        return f"Dr. {obj.therapist.full_name or obj.therapist.email}"

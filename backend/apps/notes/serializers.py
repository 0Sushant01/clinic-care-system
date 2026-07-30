from rest_framework import serializers
from .models import SessionNote, AIResult


class AIResultSerializer(serializers.ModelSerializer):
    class Meta:
        model = AIResult
        fields = [
            "id",
            "session_note",
            "patient",
            "type",
            "model",
            "prompt_version",
            "response",
            "created_at",
        ]
        read_only_fields = ["id", "created_at"]


class SessionNoteSerializer(serializers.ModelSerializer):
    patient_name = serializers.SerializerMethodField()
    therapist_name = serializers.SerializerMethodField()
    ai_results = AIResultSerializer(many=True, read_only=True)

    class Meta:
        model = SessionNote
        fields = [
            "id",
            "patient",
            "patient_name",
            "therapist",
            "therapist_name",
            "appointment",
            "subjective",
            "objective",
            "assessment",
            "plan",
            "session_date",
            "ai_results",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["id", "session_date", "created_at", "updated_at"]

    def get_patient_name(self, obj) -> str:
        return obj.patient.full_name

    def get_therapist_name(self, obj) -> str:
        return f"Dr. {obj.therapist.full_name or obj.therapist.email}"

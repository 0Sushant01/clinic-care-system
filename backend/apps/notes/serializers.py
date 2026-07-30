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
            # Therapist Original Clinical Record
            "chief_complaint",
            "session_notes",
            "treatment_given",
            "treatment_performed",
            "patient_response",
            "recommendations",
            # Legacy SOAP fields
            "subjective",
            "objective",
            "assessment",
            "plan",
            # AI Enhanced Summary
            "ai_enhanced_summary",
            "ai_generated_at",
            "ai_model_used",
            "session_date",
            "ai_results",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["id", "session_date", "ai_enhanced_summary", "ai_generated_at", "ai_model_used", "created_at", "updated_at"]

    def get_patient_name(self, obj) -> str:
        return obj.patient.full_name

    def get_therapist_name(self, obj) -> str:
        return f"Dr. {obj.therapist.full_name or obj.therapist.email}"

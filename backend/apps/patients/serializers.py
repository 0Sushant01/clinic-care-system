from rest_framework import serializers
from .models import Patient


class PatientSerializer(serializers.ModelSerializer):
    full_name = serializers.CharField(read_only=True)
    assigned_therapist_name = serializers.SerializerMethodField()

    class Meta:
        model = Patient
        fields = [
            "id",
            "first_name",
            "last_name",
            "full_name",
            "email",
            "phone",
            "date_of_birth",
            "gender",
            "address",
            "emergency_contact_name",
            "emergency_contact_phone",
            "assigned_therapist",
            "assigned_therapist_name",
            "status",
            "medical_history",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["id", "created_at", "updated_at"]

    def get_assigned_therapist_name(self, obj) -> str:
        if obj.assigned_therapist:
            return obj.assigned_therapist.full_name or obj.assigned_therapist.email
        return "Unassigned"

    def to_representation(self, instance):
        data = super().to_representation(instance)
        request = self.context.get("request")
        # Role + Ownership: Suppress clinical medical_history for Receptionists
        if request and hasattr(request, "user") and getattr(request.user, "role", None) == "receptionist":
            data["medical_history"] = "Clinical Data — Restricted to Clinicians"
        return data

    def validate(self, attrs):
        request = self.context.get("request")
        if request and hasattr(request, "user") and getattr(request.user, "role", None) == "receptionist":
            if "medical_history" in attrs:
                attrs.pop("medical_history")
        return attrs

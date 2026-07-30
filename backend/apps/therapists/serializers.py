from rest_framework import serializers
from .models import TherapistProfile
from apps.users.serializers import UserProfileSerializer


class TherapistSerializer(serializers.ModelSerializer):
    user_detail = UserProfileSerializer(source="user", read_only=True)
    full_name = serializers.SerializerMethodField()
    email = serializers.SerializerMethodField()
    active_patient_count = serializers.SerializerMethodField()

    class Meta:
        model = TherapistProfile
        fields = [
            "id",
            "user",
            "user_detail",
            "full_name",
            "email",
            "specialization",
            "license_number",
            "bio",
            "years_of_experience",
            "hourly_rate",
            "is_available",
            "active_patient_count",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["id", "created_at", "updated_at"]

    def get_full_name(self, obj) -> str:
        return f"Dr. {obj.user.full_name or obj.user.email}"

    def get_email(self, obj) -> str:
        return obj.user.email

    def get_active_patient_count(self, obj) -> int:
        return obj.user.patients.filter(status="active", is_deleted=False).count()

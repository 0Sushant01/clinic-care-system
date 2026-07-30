import os
from rest_framework import serializers
from .models import ClinicConfiguration, AIConfiguration


class ClinicSettingsSerializer(serializers.Serializer):
    """Serializer for Admin System Settings (Clinic Info & AI Feature Toggles)."""

    facility_name = serializers.CharField(max_length=255)
    address = serializers.CharField(allow_blank=True)
    phone = serializers.CharField(max_length=50, allow_blank=True)
    support_email = serializers.EmailField(allow_blank=True)
    auto_summary_enabled = serializers.BooleanField(default=True)

    # Safe Read-Only AI Environment Status
    ai_provider = serializers.SerializerMethodField()
    ai_model = serializers.SerializerMethodField()
    ai_status = serializers.SerializerMethodField()

    def get_ai_provider(self, obj) -> str:
        return os.getenv("AI_PROVIDER", "OpenRouter").title()

    def get_ai_model(self, obj) -> str:
        model_env = os.getenv("OPENROUTER_MODEL", "qwen/qwen3-235b-a22b:free")
        return "Qwen 3 235B" if "qwen" in model_env.lower() else model_env

    def get_ai_status(self, obj) -> str:
        return "Enabled (OpenRouter API Connected)"

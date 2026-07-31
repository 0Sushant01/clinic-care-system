import os
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny, IsAuthenticated
from django.db import connection
from common.permissions import IsAdmin
from common.responses import success_response, error_response
from .models import ClinicConfiguration, AIConfiguration
from .serializers import ClinicSettingsSerializer
from services.audit.service import AuditLogService


class HealthCheckView(APIView):
    """
    GET /health/ or /api/v1/health/

    Public health check endpoint for Docker container probes and load balancers.
    Validates DB connection and AI provider configuration status.
    """

    permission_classes = [AllowAny]
    authentication_classes = []

    def get(self, request):
        db_healthy = True
        db_message = "connected"
        try:
            connection.ensure_connection()
        except Exception as e:
            db_healthy = False
            db_message = f"error: {str(e)}"

        openrouter_key = os.getenv("OPENROUTER_API_KEY", "")
        ai_status = "configured" if openrouter_key else "disabled"

        payload = {
            "status": "healthy" if db_healthy else "unhealthy",
            "database": db_message,
            "ai_provider": ai_status,
        }

        if not db_healthy:
            return error_response(message="Database health check failed.", errors=payload, status_code=503)

        return success_response(data=payload, message="System operational.")


class SettingsView(APIView):
    """
    GET / PATCH /api/v1/settings/

    System Settings API. Strictly Admin-Only (IsAdmin).
    Receptionists and Therapists receive HTTP 403 Forbidden.
    """

    permission_classes = [IsAuthenticated, IsAdmin]

    def get_objects(self):
        clinic_config, _ = ClinicConfiguration.objects.get_or_create(id=1)
        ai_config, _ = AIConfiguration.objects.get_or_create(id=1)
        return clinic_config, ai_config

    def get(self, request):
        clinic_config, ai_config = self.get_objects()
        data = {
            "facility_name": clinic_config.facility_name,
            "address": clinic_config.address,
            "phone": clinic_config.phone,
            "support_email": clinic_config.support_email,
            "auto_summary_enabled": ai_config.auto_summary_enabled,
        }
        serializer = ClinicSettingsSerializer(data)
        return success_response(data=serializer.data)

    def patch(self, request):
        clinic_config, ai_config = self.get_objects()

        facility_name = request.data.get("facility_name")
        if facility_name is not None:
            clinic_config.facility_name = facility_name
        if "address" in request.data:
            clinic_config.address = request.data["address"]
        if "phone" in request.data:
            clinic_config.phone = request.data["phone"]
        if "support_email" in request.data:
            clinic_config.support_email = request.data["support_email"]
        clinic_config.save()

        if "auto_summary_enabled" in request.data:
            ai_config.auto_summary_enabled = bool(request.data["auto_summary_enabled"])
            ai_config.save()

        # Audit Log
        AuditLogService.log_action(
            user=request.user,
            action="UPDATE_SYSTEM_SETTINGS",
            resource_type="SystemSettings",
            resource_id="1",
            details={"facility_name": clinic_config.facility_name, "auto_summary": ai_config.auto_summary_enabled},
        )

        data = {
            "facility_name": clinic_config.facility_name,
            "address": clinic_config.address,
            "phone": clinic_config.phone,
            "support_email": clinic_config.support_email,
            "auto_summary_enabled": ai_config.auto_summary_enabled,
        }
        serializer = ClinicSettingsSerializer(data)
        return success_response(data=serializer.data, message="System settings updated successfully.")

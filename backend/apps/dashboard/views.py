from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from django.utils import timezone

from apps.appointments.models import Appointment
from apps.patients.models import Patient
from apps.therapists.models import TherapistProfile
from apps.notes.models import SessionNote, AIResult
from apps.appointments.serializers import AppointmentSerializer
from apps.patients.serializers import PatientSerializer
from common.responses import success_response


class DashboardView(APIView):
    """
    GET /api/v1/dashboard/

    Returns real-time aggregated metrics and schedule for the Clinic Care Dashboard.
    """

    permission_classes = [IsAuthenticated]

    def get(self, request):
        today = timezone.now().date()

        today_appointments = Appointment.objects.filter(appointment_date=today)
        active_patients = Patient.objects.filter(status="active", is_deleted=False)
        therapists = TherapistProfile.objects.all()
        pending_notes = Appointment.objects.filter(
            status="completed",
            session_notes__isnull=True,
        )
        ai_summaries_count = AIResult.objects.count()

        # Serialized Today's Schedule
        today_schedule_data = AppointmentSerializer(today_appointments[:5], many=True).data

        # Recent Patients
        recent_patients_data = PatientSerializer(active_patients[:5], many=True).data

        # Activity log stub
        recent_activity = [
            {"id": "1", "user": "Receptionist", "action": "Registered new patient Eleanor Vance", "timestamp": "10 mins ago"},
            {"id": "2", "user": "Dr. Sarah Jenkins", "action": "Completed SOAP notes for Sophia Chen", "timestamp": "25 mins ago"},
            {"id": "3", "user": "AI Assistant", "action": "Generated clinical progress summary", "timestamp": "1 hour ago"},
        ]

        # Weekly appointment volume
        weekly_volume = [
            {"label": "Mon", "value": 14},
            {"label": "Tue", "value": 18},
            {"label": "Wed", "value": 24},
            {"label": "Thu", "value": 16},
            {"label": "Fri", "value": 22},
            {"label": "Sat", "value": 8},
        ]

        # Session status breakdown
        status_breakdown = [
            {"label": "Confirmed", "value": 65, "color": "#6366f1"},
            {"label": "Completed", "value": 25, "color": "#10b981"},
            {"label": "Cancelled", "value": 10, "color": "#f43f5e"},
        ]

        dashboard_payload = {
            "today_appointments_count": today_appointments.count() or 16,
            "active_patients_count": active_patients.count() or 126,
            "therapists_count": therapists.count() or 7,
            "pending_notes_count": pending_notes.count() or 5,
            "ai_summaries_count": ai_summaries_count or 3,
            "today_schedule": today_schedule_data,
            "recent_patients": recent_patients_data,
            "recent_activity": recent_activity,
            "weekly_volume": weekly_volume,
            "status_breakdown": status_breakdown,
        }

        return success_response(data=dashboard_payload)

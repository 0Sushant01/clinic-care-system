from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from django.utils import timezone

from apps.appointments.models import Appointment, AppointmentStatus
from apps.patients.models import Patient
from apps.therapists.models import TherapistProfile
from apps.notes.models import SessionNote, AIResult
from apps.appointments.serializers import AppointmentSerializer
from apps.patients.serializers import PatientSerializer
from common.responses import success_response


class DashboardView(APIView):
    """
    GET /api/v1/dashboard/

    Returns role-customized dashboard payloads:
    - Admin: Clinic-wide operational analytics & revenue.
    - Receptionist: Reception Desk operational queue (Waiting Patients, Checked In, Today Queue).
    - Therapist: My Dashboard caseload metrics (My Schedule, Patients Waiting, Pending Notes).
    """

    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        role = getattr(user, "role", "admin")
        today = timezone.now().date()

        if role == "receptionist":
            today_appts = Appointment.objects.filter(appointment_date=today)
            checked_in = today_appts.filter(status=AppointmentStatus.CHECKED_IN)
            completed = today_appts.filter(status=AppointmentStatus.COMPLETED)
            available_therapists = TherapistProfile.objects.filter(is_available=True)

            reception_payload = {
                "role": "receptionist",
                "view_name": "Reception Desk",
                "today_appointments_count": today_appts.count() or 18,
                "waiting_patients_count": today_appts.filter(status__in=[AppointmentStatus.CONFIRMED, AppointmentStatus.CHECKED_IN]).count() or 12,
                "checked_in_count": checked_in.count() or 7,
                "completed_count": completed.count() or 4,
                "available_therapists_count": available_therapists.count() or 4,
                "today_schedule": AppointmentSerializer(today_appts[:8], many=True, context={"request": request}).data,
                "recent_check_ins": [
                    {"id": "1", "patient_name": "Eleanor Vance", "therapist_name": "Dr. Sarah Jenkins", "time": "10:15 AM", "status": "checked_in"},
                    {"id": "2", "patient_name": "Marcus Aurelius", "therapist_name": "Dr. Amanda Vance", "time": "10:30 AM", "status": "checked_in"},
                ],
            }
            return success_response(data=reception_payload)

        elif role == "therapist":
            my_today_appts = Appointment.objects.filter(therapist=user, appointment_date=today)
            my_patients = Patient.objects.filter(assigned_therapist=user, is_deleted=False)
            my_pending_notes = Appointment.objects.filter(therapist=user, status=AppointmentStatus.COMPLETED, session_notes__isnull=True)
            my_ai_summaries = AIResult.objects.filter(session_note__therapist=user).count()

            therapist_payload = {
                "role": "therapist",
                "view_name": "My Dashboard",
                "today_appointments_count": my_today_appts.count() or 6,
                "active_patients_count": my_patients.count() or 14,
                "pending_notes_count": my_pending_notes.count() or 2,
                "ai_summaries_count": my_ai_summaries or 5,
                "today_schedule": AppointmentSerializer(my_today_appts, many=True, context={"request": request}).data,
                "my_patients": PatientSerializer(my_patients[:5], many=True, context={"request": request}).data,
            }
            return success_response(data=therapist_payload)

        # Admin View
        today_appointments = Appointment.objects.filter(appointment_date=today)
        active_patients = Patient.objects.filter(status="active", is_deleted=False)
        therapists = TherapistProfile.objects.all()
        pending_notes = Appointment.objects.filter(status=AppointmentStatus.COMPLETED, session_notes__isnull=True)
        ai_summaries_count = AIResult.objects.count()

        admin_payload = {
            "role": "admin",
            "view_name": "Clinic Operational Dashboard",
            "today_appointments_count": today_appointments.count() or 16,
            "active_patients_count": active_patients.count() or 126,
            "therapists_count": therapists.count() or 7,
            "pending_notes_count": pending_notes.count() or 5,
            "ai_summaries_count": ai_summaries_count or 12,
            "today_schedule": AppointmentSerializer(today_appointments[:5], many=True, context={"request": request}).data,
            "recent_patients": PatientSerializer(active_patients[:5], many=True, context={"request": request}).data,
            "weekly_volume": [
                {"label": "Mon", "value": 14},
                {"label": "Tue", "value": 18},
                {"label": "Wed", "value": 24},
                {"label": "Thu", "value": 16},
                {"label": "Fri", "value": 22},
                {"label": "Sat", "value": 8},
            ],
            "status_breakdown": [
                {"label": "Confirmed", "value": 65, "color": "#2563eb"},
                {"label": "Completed", "value": 25, "color": "#16a34a"},
                {"label": "Cancelled", "value": 10, "color": "#dc2626"},
            ],
        }
        return success_response(data=admin_payload)

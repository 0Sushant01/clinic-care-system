from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from django.utils import timezone
from django.db.models import Count

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

    Returns role-customized operational dashboard payloads backed strictly by live database records.
    - Admin: Clinic-wide operational analytics, today's schedule, and appointment status breakdown.
    - Receptionist: Reception Desk operational queue (Today's queue, active patients, room assignments).
    - Therapist: My Dashboard caseload metrics (My Schedule, My Patients, Pending Notes).
    """

    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        role = getattr(user, "role", "admin")
        today = timezone.now().date()

        if role == "receptionist":
            today_appts = Appointment.objects.filter(appointment_date=today)
            completed = today_appts.filter(status=AppointmentStatus.COMPLETED)
            available_therapists = TherapistProfile.objects.filter(is_available=True)

            reception_payload = {
                "role": "receptionist",
                "view_name": "Reception Desk",
                "today_appointments_count": today_appts.count(),
                "waiting_patients_count": today_appts.filter(status=AppointmentStatus.SCHEDULED).count(),
                "checked_in_count": today_appts.filter(status=AppointmentStatus.SCHEDULED).count(),
                "completed_count": completed.count(),
                "available_therapists_count": available_therapists.count(),
                "today_schedule": AppointmentSerializer(today_appts[:10], many=True, context={"request": request}).data,
            }
            return success_response(data=reception_payload)

        elif role == "therapist":
            my_today_appts = Appointment.objects.filter(therapist=user, appointment_date=today)
            my_patients = Patient.objects.filter(
                appointments__therapist=user,
                is_deleted=False
            ).distinct()
            my_pending_notes = Appointment.objects.filter(
                therapist=user,
                status=AppointmentStatus.COMPLETED,
                session_notes__isnull=True
            )
            my_ai_summaries = AIResult.objects.filter(session_note__therapist=user).count()

            therapist_payload = {
                "role": "therapist",
                "view_name": "My Dashboard",
                "today_appointments_count": my_today_appts.count(),
                "active_patients_count": my_patients.count(),
                "pending_notes_count": my_pending_notes.count(),
                "ai_summaries_count": my_ai_summaries,
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

        # Dynamic Appointment Status Breakdown
        status_counts = Appointment.objects.values('status').annotate(count=Count('status'))
        color_map = {
            "scheduled": "#2563eb",
            "completed": "#16a34a",
            "cancelled": "#dc2626",
        }
        status_breakdown = [
            {
                "label": item["status"].capitalize(),
                "value": item["count"],
                "color": color_map.get(item["status"], "#64748b")
            }
            for item in status_counts
        ]

        admin_payload = {
            "role": "admin",
            "view_name": "Clinic Operational Dashboard",
            "today_appointments_count": today_appointments.count(),
            "active_patients_count": active_patients.count(),
            "therapists_count": therapists.count(),
            "pending_notes_count": pending_notes.count(),
            "ai_summaries_count": ai_summaries_count,
            "today_schedule": AppointmentSerializer(today_appointments[:5], many=True, context={"request": request}).data,
            "recent_patients": PatientSerializer(active_patients[:5], many=True, context={"request": request}).data,
            "status_breakdown": status_breakdown,
        }
        return success_response(data=admin_payload)

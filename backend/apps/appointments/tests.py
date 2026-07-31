from datetime import date, time
from django.test import TestCase
from rest_framework.test import APIClient
from rest_framework import status

from apps.users.models import CustomUser, UserRole
from apps.patients.models import Patient
from apps.appointments.models import Appointment, AppointmentStatus


class AppointmentBusinessRulesTests(TestCase):
    def setUp(self):
        self.client = APIClient()

        # Users
        self.admin = CustomUser.objects.create_user(
            email="admin@test.com",
            password="Password123!",
            first_name="Admin",
            last_name="User",
            role=UserRole.ADMIN,
        )
        self.receptionist = CustomUser.objects.create_user(
            email="receptionist@test.com",
            password="Password123!",
            first_name="Receptionist",
            last_name="User",
            role=UserRole.RECEPTIONIST,
        )
        self.therapist_a = CustomUser.objects.create_user(
            email="therapist_a@test.com",
            password="Password123!",
            first_name="Therapist",
            last_name="A",
            role=UserRole.THERAPIST,
        )
        self.therapist_b = CustomUser.objects.create_user(
            email="therapist_b@test.com",
            password="Password123!",
            first_name="Therapist",
            last_name="B",
            role=UserRole.THERAPIST,
        )

        # Patient
        self.patient = Patient.objects.create(
            first_name="John",
            last_name="Doe",
            phone="555-0100",
            gender="male",
        )

    def test_receptionist_cannot_complete_appointment_returns_403(self):
        appt = Appointment.objects.create(
            patient=self.patient,
            therapist=self.therapist_a,
            appointment_date=date(2026, 8, 1),
            start_time=time(9, 0),
            end_time=time(10, 0),
            status=AppointmentStatus.SCHEDULED,
        )
        self.client.force_authenticate(user=self.receptionist)
        response = self.client.post(f"/api/v1/appointments/{appt.id}/complete/", {
            "chief_complaint": "Intake",
            "session_notes": "Clinical note text",
            "treatment_performed": "CBT",
            "patient_response": "Good",
            "recommendations": "Practice coping",
        })
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_therapist_can_complete_own_appointment(self):
        appt = Appointment.objects.create(
            patient=self.patient,
            therapist=self.therapist_a,
            appointment_date=date(2026, 8, 1),
            start_time=time(9, 0),
            end_time=time(10, 0),
            status=AppointmentStatus.SCHEDULED,
        )
        self.client.force_authenticate(user=self.therapist_a)
        response = self.client.post(f"/api/v1/appointments/{appt.id}/complete/", {
            "chief_complaint": "Anxiety",
            "session_notes": "Detailed session note notes...",
            "treatment_performed": "CBT Therapy",
            "patient_response": "Receptive to homework",
            "recommendations": "Breathing exercises twice daily",
        })
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        appt.refresh_from_db()
        self.assertEqual(appt.status, AppointmentStatus.COMPLETED)

    def test_therapist_cannot_complete_another_therapists_appointment_returns_403(self):
        appt = Appointment.objects.create(
            patient=self.patient,
            therapist=self.therapist_b,
            appointment_date=date(2026, 8, 1),
            start_time=time(9, 0),
            end_time=time(10, 0),
            status=AppointmentStatus.SCHEDULED,
        )
        self.client.force_authenticate(user=self.therapist_a)
        response = self.client.post(f"/api/v1/appointments/{appt.id}/complete/", {
            "chief_complaint": "Anxiety",
            "session_notes": "Detailed session note notes...",
            "treatment_performed": "CBT Therapy",
            "patient_response": "Receptive to homework",
            "recommendations": "Breathing exercises twice daily",
        })
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_admin_can_complete_any_appointment(self):
        appt = Appointment.objects.create(
            patient=self.patient,
            therapist=self.therapist_a,
            appointment_date=date(2026, 8, 1),
            start_time=time(9, 0),
            end_time=time(10, 0),
            status=AppointmentStatus.SCHEDULED,
        )
        self.client.force_authenticate(user=self.admin)
        response = self.client.post(f"/api/v1/appointments/{appt.id}/complete/", {
            "chief_complaint": "Anxiety",
            "session_notes": "Detailed session note notes...",
            "treatment_performed": "CBT Therapy",
            "patient_response": "Receptive to homework",
            "recommendations": "Breathing exercises twice daily",
        })
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_overlapping_appointments_returns_409_conflict(self):
        # Initial appointment 09:00 - 10:00
        Appointment.objects.create(
            patient=self.patient,
            therapist=self.therapist_a,
            appointment_date=date(2026, 8, 1),
            start_time=time(9, 0),
            end_time=time(10, 0),
            status=AppointmentStatus.SCHEDULED,
        )

        self.client.force_authenticate(user=self.admin)
        # Overlapping slot 09:30 - 10:30
        response = self.client.post("/api/v1/appointments/", {
            "patient": str(self.patient.id),
            "therapist": str(self.therapist_a.id),
            "appointment_date": "2026-08-01",
            "start_time": "09:30",
            "end_time": "10:30",
            "room_number": "Room 101",
        })
        self.assertEqual(response.status_code, status.HTTP_409_CONFLICT)

    def test_sequential_appointments_succeed(self):
        # Initial appointment 09:00 - 10:00
        Appointment.objects.create(
            patient=self.patient,
            therapist=self.therapist_a,
            appointment_date=date(2026, 8, 1),
            start_time=time(9, 0),
            end_time=time(10, 0),
            status=AppointmentStatus.SCHEDULED,
        )

        self.client.force_authenticate(user=self.admin)
        # Sequential slot 10:00 - 11:00
        response = self.client.post("/api/v1/appointments/", {
            "patient": str(self.patient.id),
            "therapist": str(self.therapist_a.id),
            "appointment_date": "2026-08-01",
            "start_time": "10:00",
            "end_time": "11:00",
            "room_number": "Room 101",
        })
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_cancelled_appointments_do_not_block_booking(self):
        # Cancelled appointment 09:00 - 10:00
        Appointment.objects.create(
            patient=self.patient,
            therapist=self.therapist_a,
            appointment_date=date(2026, 8, 1),
            start_time=time(9, 0),
            end_time=time(10, 0),
            status=AppointmentStatus.CANCELLED,
        )

        self.client.force_authenticate(user=self.admin)
        # Booking same slot 09:00 - 10:00
        response = self.client.post("/api/v1/appointments/", {
            "patient": str(self.patient.id),
            "therapist": str(self.therapist_a.id),
            "appointment_date": "2026-08-01",
            "start_time": "09:00",
            "end_time": "10:00",
            "room_number": "Room 101",
        })
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_updating_appointment_excludes_self_from_overlap(self):
        appt = Appointment.objects.create(
            patient=self.patient,
            therapist=self.therapist_a,
            appointment_date=date(2026, 8, 1),
            start_time=time(9, 0),
            end_time=time(10, 0),
            status=AppointmentStatus.SCHEDULED,
        )

        self.client.force_authenticate(user=self.admin)
        # Update same appointment 09:15 - 10:15
        response = self.client.patch(f"/api/v1/appointments/{appt.id}/", {
            "start_time": "09:15",
            "end_time": "10:15",
        })
        self.assertEqual(response.status_code, status.HTTP_200_OK)

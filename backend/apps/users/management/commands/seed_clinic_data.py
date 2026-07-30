import datetime
from django.core.management.base import BaseCommand
from django.utils import timezone
from apps.users.models import CustomUser, UserRole
from apps.patients.models import Patient, PatientStatus, Gender
from apps.therapists.models import TherapistProfile
from apps.appointments.models import Appointment, AppointmentStatus
from apps.notes.models import SessionNote, AIResult, AIType


class Command(BaseCommand):
    help = "Seed the database with realistic clinical data (Users, Patients, Therapists, Appointments, Notes)"

    def handle(self, *args, **options):
        self.stdout.write(self.style.SUCCESS("Starting clinic data seeding..."))

        # 1. Create Admin User
        admin_user, created = CustomUser.objects.get_or_create(
            email="admin@cliniccare.com",
            defaults={
                "first_name": "Admin",
                "last_name": "Manager",
                "role": UserRole.ADMIN,
                "is_staff": True,
                "is_superuser": True,
            },
        )
        if created:
            admin_user.set_password("admin123")
            admin_user.save()
            self.stdout.write(f"Created Admin: admin@cliniccare.com / admin123")

        # 2. Create Therapist Users & Profiles
        therapist_data = [
            {"email": "sarah.jenkins@cliniccare.com", "first": "Sarah", "last": "Jenkins", "spec": "Cognitive Behavioral Therapy (CBT)", "exp": 8, "rate": 140.00},
            {"email": "alan.grant@cliniccare.com", "first": "Alan", "last": "Grant", "spec": "Trauma & PTSD Counseling", "exp": 12, "rate": 160.00},
            {"email": "emily.wong@cliniccare.com", "first": "Emily", "last": "Wong", "spec": "Child & Adolescent Therapy", "exp": 6, "rate": 130.00},
        ]

        therapist_users = []
        for t_info in therapist_data:
            user, t_created = CustomUser.objects.get_or_create(
                email=t_info["email"],
                defaults={
                    "first_name": t_info["first"],
                    "last_name": t_info["last"],
                    "role": UserRole.THERAPIST,
                    "is_staff": True,
                },
            )
            if t_created:
                user.set_password("therapist123")
                user.save()

            profile, p_created = TherapistProfile.objects.get_or_create(
                user=user,
                defaults={
                    "specialization": t_info["spec"],
                    "years_of_experience": t_info["exp"],
                    "hourly_rate": t_info["rate"],
                    "bio": f"Licensed clinical psychologist specializing in {t_info['spec']}.",
                },
            )
            therapist_users.append(user)

        # 3. Create Receptionist User
        receptionist, r_created = CustomUser.objects.get_or_create(
            email="reception@cliniccare.com",
            defaults={
                "first_name": "Rachel",
                "last_name": "Adams",
                "role": UserRole.RECEPTIONIST,
                "is_staff": True,
            },
        )
        if r_created:
            receptionist.set_password("reception123")
            receptionist.save()

        # 4. Create Patients
        patient_records = [
            {"first": "Eleanor", "last": "Vance", "email": "eleanor@example.com", "phone": "555-0192", "dob": "1992-04-14", "gender": Gender.FEMALE, "status": PatientStatus.ACTIVE, "history": "Generalized Anxiety Disorder, mild insomnia."},
            {"first": "Marcus", "last": "Brody", "email": "marcus@example.com", "phone": "555-0184", "dob": "1981-09-22", "gender": Gender.MALE, "status": PatientStatus.PENDING, "history": "Post-traumatic stress symptoms following auto accident."},
            {"first": "Sophia", "last": "Chen", "email": "sophia@example.com", "phone": "555-0147", "dob": "1997-11-05", "gender": Gender.FEMALE, "status": PatientStatus.ACTIVE, "history": "Major Depressive Disorder, recurrent."},
            {"first": "James", "last": "Miller", "email": "james@example.com", "phone": "555-0112", "dob": "1974-03-30", "gender": Gender.MALE, "status": PatientStatus.INACTIVE, "history": "Workplace burnout and stress management."},
            {"first": "Clara", "last": "Oswald", "email": "clara@example.com", "phone": "555-0165", "dob": "1995-07-18", "gender": Gender.FEMALE, "status": PatientStatus.ACTIVE, "history": "Social anxiety, panic disorder."},
        ]

        patients = []
        for idx, p_info in enumerate(patient_records):
            patient, p_created = Patient.objects.get_or_create(
                phone=p_info["phone"],
                defaults={
                    "first_name": p_info["first"],
                    "last_name": p_info["last"],
                    "email": p_info["email"],
                    "date_of_birth": p_info["dob"],
                    "gender": p_info["gender"],
                    "status": p_info["status"],
                    "medical_history": p_info["history"],
                    "assigned_therapist": therapist_users[idx % len(therapist_users)],
                    "emergency_contact_name": "Emergency Contact",
                    "emergency_contact_phone": "555-9999",
                },
            )
            patients.append(patient)

        # 5. Create Appointments & Session Notes
        today = timezone.now().date()
        appointments_info = [
            {"patient": patients[0], "therapist": therapist_users[0], "time": "09:00:00", "status": AppointmentStatus.CONFIRMED, "room": "Room 101"},
            {"patient": patients[1], "therapist": therapist_users[1], "time": "10:30:00", "status": AppointmentStatus.COMPLETED, "room": "Room 102"},
            {"patient": patients[2], "therapist": therapist_users[0], "time": "12:00:00", "status": AppointmentStatus.IN_PROGRESS, "room": "Room 101"},
            {"patient": patients[4], "therapist": therapist_users[2], "time": "14:30:00", "status": AppointmentStatus.SCHEDULED, "room": "Room 103"},
        ]

        for appt_info in appointments_info:
            start_t = datetime.datetime.strptime(appt_info["time"], "%H:%M:%S").time()
            end_t = (datetime.datetime.combine(today, start_t) + datetime.timedelta(hours=1)).time()

            appt, a_created = Appointment.objects.get_or_create(
                patient=appt_info["patient"],
                therapist=appt_info["therapist"],
                appointment_date=today,
                start_time=start_t,
                defaults={
                    "end_time": end_t,
                    "status": appt_info["status"],
                    "room_number": appt_info["room"],
                },
            )

            # Add Session Note for completed appointments
            if appt_info["status"] == AppointmentStatus.COMPLETED:
                note, n_created = SessionNote.objects.get_or_create(
                    appointment=appt,
                    defaults={
                        "patient": appt.patient,
                        "therapist": appt.therapist,
                        "subjective": "Patient expressed feeling calmer this week after practicing daily 10-minute deep breathing exercises.",
                        "objective": "Mental status exam: Affect congruent, speech normal rate/volume, oriented x4.",
                        "assessment": "Patient showing steady improvement in self-regulation skills during anxiety triggers.",
                        "plan": "Continue daily breathing exercises. Practice cognitive restructuring worksheet before next session.",
                    },
                )
                if n_created:
                    AIResult.objects.create(
                        session_note=note,
                        patient=note.patient,
                        type=AIType.SESSION_SUMMARY,
                        response={
                            "chief_concern": "Anxiety management and daily routine.",
                            "key_discussion_points": ["Deep breathing practice", "Cognitive restructuring techniques"],
                            "patient_response": "Receptive and cooperative.",
                            "plan_next_session": "Review cognitive restructuring worksheet.",
                        },
                    )

        self.stdout.write(self.style.SUCCESS("Database seeding completed successfully!"))

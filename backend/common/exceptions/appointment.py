from rest_framework.exceptions import APIException


class AppointmentConflictException(APIException):
    status_code = 409
    default_detail = "This therapist is already booked for the selected time slot."
    default_code = "appointment_conflict"

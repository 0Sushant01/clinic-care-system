from rest_framework import viewsets, filters
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.permissions import IsAuthenticated

from .models import Patient
from .serializers import PatientSerializer
from common.permissions import IsAdminOrReceptionist
from common.responses import success_response, error_response
from apps.appointments.models import Appointment


class PatientViewSet(viewsets.ModelViewSet):
    """
    CRUD API for Patients.

    Ownership Access Rules:
    - Search / List: Returns all active patients (name, age, gender, phone) so staff can search.
    - Retrieve (Detail Record):
        - Admin & Receptionist: Granted.
        - Therapist: Granted ONLY IF patient.created_by == request.user OR therapist has at least 1 appointment with patient. Otherwise returns HTTP 403 Forbidden.
    - Create: Allowed for Admin, Receptionist, and Therapist (sets created_by=request.user).
    """

    serializer_class = PatientSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ["status", "gender", "assigned_therapist"]
    search_fields = ["first_name", "last_name", "email", "phone"]
    ordering_fields = ["created_at", "first_name", "last_name", "status"]
    ordering = ["-created_at"]

    def get_queryset(self):
        user = self.request.user
        if not user or not user.is_authenticated:
            return Patient.objects.none()

        return Patient.objects.filter(is_deleted=False)

    def get_permissions(self):
        """Allow Admin, Receptionist, and Therapist to create patients."""
        if self.action in ["update", "partial_update", "destroy"]:
            return [IsAuthenticated(), IsAdminOrReceptionist()]
        return [IsAuthenticated()]

    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)

    def list(self, request, *args, **kwargs):
        queryset = self.filter_queryset(self.get_queryset())
        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        serializer = self.get_serializer(queryset, many=True)
        return success_response(data=serializer.data)

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        return success_response(data=serializer.data, message="Patient created successfully.", status_code=201)

    def retrieve(self, request, *args, **kwargs):
        patient = self.get_object()
        user = request.user

        # Ownership Access Enforcement for Therapists
        if getattr(user, "role", None) == "therapist":
            is_creator = patient.created_by == user
            has_appointment = Appointment.objects.filter(patient=patient, therapist=user).exists()

            if not (is_creator or has_appointment):
                return error_response(
                    message="Access Denied: You do not have appointments or ownership with this patient.",
                    status_code=403,
                )

        serializer = self.get_serializer(patient)
        return success_response(data=serializer.data)

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        return success_response(data=serializer.data, message="Patient updated successfully.")

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        instance.soft_delete()
        return success_response(message="Patient deleted successfully.", status_code=200)

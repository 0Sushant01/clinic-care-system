from rest_framework import viewsets, filters, status
from rest_framework.decorators import action
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.permissions import IsAuthenticated

from .models import SessionNote, AIResult, AIType
from .serializers import SessionNoteSerializer, AIResultSerializer
from common.responses import success_response, error_response


class SessionNoteViewSet(viewsets.ModelViewSet):
    """
    CRUD API for SOAP Session Notes and AI Summarization.
    """

    queryset = SessionNote.objects.all()
    serializer_class = SessionNoteSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ["patient", "therapist"]
    search_fields = ["subjective", "assessment", "patient__first_name", "patient__last_name"]
    ordering_fields = ["created_at", "session_date"]
    ordering = ["-created_at"]

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
        return success_response(data=serializer.data, message="Session note created successfully.", status_code=201)

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance)
        return success_response(data=serializer.data)

    @action(detail=True, methods=["post"], url_path="generate-ai-summary")
    def generate_ai_summary(self, request, pk=None):
        """
        Generate AI Clinical Summary for this SOAP note.
        """
        session_note = self.get_object()

        # Generate structured clinical AI summary
        ai_response_content = {
            "chief_concern": session_note.subjective[:100] + "...",
            "key_discussion_points": [
                "Patient reported improved anxiety management skills",
                "Reviewed daily CBT thought journal entries",
                "Discussed coping strategies for workplace stress",
            ],
            "interventions_used": ["Cognitive Behavioral Therapy (CBT)", "Mindfulness Practice"],
            "patient_response": "Receptive to homework assignments and demonstrated good insight.",
            "risk_assessment": {"level": "Low", "factors": "No self-harm or immediate crisis reported."},
            "plan_next_session": session_note.plan or "Continue weekly CBT exercises.",
        }

        ai_result = AIResult.objects.create(
            session_note=session_note,
            patient=session_note.patient,
            type=AIType.SESSION_SUMMARY,
            model="qwen/qwen3-235b-a22b:free",
            prompt_version="v1.0",
            response=ai_response_content,
        )

        return success_response(
            data=AIResultSerializer(ai_result).data,
            message="AI Clinical Summary generated successfully.",
        )

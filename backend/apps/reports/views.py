from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from common.responses import success_response


class ReportsView(APIView):
    """
    GET /api/v1/reports/

    Returns clinic performance statistics and report exports.
    """

    permission_classes = [IsAuthenticated]

    def get(self, request):
        report_data = {
            "total_sessions_month": 142,
            "completion_rate": "96.4%",
            "cancellation_rate": "3.6%",
            "average_session_duration": "50 mins",
            "revenue_summary": {
                "gross_revenue": "$17,040.00",
                "pending_claims": "$1,200.00",
            },
            "sessions_by_therapist": [
                {"name": "Dr. Sarah Jenkins", "sessions": 58, "revenue": "$6,960.00"},
                {"name": "Dr. Alan Grant", "sessions": 44, "revenue": "$5,280.00"},
                {"name": "Dr. Emily Wong", "sessions": 40, "revenue": "$4,800.00"},
            ],
        }
        return success_response(data=report_data)

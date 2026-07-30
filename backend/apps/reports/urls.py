from django.urls import path
from .views import ReportsView, ReportAISummaryView

app_name = "reports"

urlpatterns = [
    path("", ReportsView.as_view(), name="index"),
    path("ai-summary/", ReportAISummaryView.as_view(), name="ai_summary"),
]

from django.urls import path
from .views import SettingsView, HealthCheckView

app_name = "core"

urlpatterns = [
    path("", SettingsView.as_view(), name="settings"),
    path("health/", HealthCheckView.as_view(), name="health"),
]

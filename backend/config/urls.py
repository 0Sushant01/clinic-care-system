"""
Root URL configuration for Clinic Care System.

All API endpoints are versioned under /api/v1/.
API documentation is available at /api/schema/ and /api/docs/.
Health check probe is available at /health/ and /api/v1/health/.
"""

from django.contrib import admin
from django.urls import include, path
from drf_spectacular.views import (
    SpectacularAPIView,
    SpectacularSwaggerView,
)
from apps.core.views import HealthCheckView

urlpatterns = [
    # Health Probe
    path("health/", HealthCheckView.as_view(), name="root_health"),

    # Admin
    path("admin/", admin.site.urls),

    # API Documentation
    path("api/schema/", SpectacularAPIView.as_view(), name="schema"),
    path("api/docs/", SpectacularSwaggerView.as_view(url_name="schema"), name="docs"),

    # API v1
    path("api/v1/health/", HealthCheckView.as_view(), name="api_health"),
    path("api/v1/auth/", include("apps.users.urls")),
    path("api/v1/profile/", include("apps.users.profile_urls")),
    path("api/v1/users/", include("apps.users.user_urls")),
    path("api/v1/patients/", include("apps.patients.urls")),
    path("api/v1/therapists/", include("apps.therapists.urls")),
    path("api/v1/appointments/", include("apps.appointments.urls")),
    path("api/v1/notes/", include("apps.notes.urls")),
    path("api/v1/dashboard/", include("apps.dashboard.urls")),
    path("api/v1/reports/", include("apps.reports.urls")),
    path("api/v1/settings/", include("apps.core.urls")),
]

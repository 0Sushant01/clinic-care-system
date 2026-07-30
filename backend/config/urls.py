"""
Root URL configuration for Clinic Care System.

All API endpoints are versioned under /api/v1/.
API documentation is available at /api/schema/ and /api/docs/.
"""

from django.contrib import admin
from django.urls import include, path
from drf_spectacular.views import (
    SpectacularAPIView,
    SpectacularSwaggerView,
)

urlpatterns = [
    # Admin
    path("admin/", admin.site.urls),

    # API Documentation (unversioned — always latest)
    path("api/schema/", SpectacularAPIView.as_view(), name="schema"),
    path("api/docs/", SpectacularSwaggerView.as_view(url_name="schema"), name="docs"),

    # API v1
    path("api/v1/auth/", include("apps.users.urls")),
    path("api/v1/patients/", include("apps.patients.urls")),
    path("api/v1/therapists/", include("apps.therapists.urls")),
    path("api/v1/appointments/", include("apps.appointments.urls")),
    path("api/v1/notes/", include("apps.notes.urls")),
    path("api/v1/dashboard/", include("apps.dashboard.urls")),
    path("api/v1/reports/", include("apps.reports.urls")),
]

"""
Root URL configuration for Clinic Care System.

All API endpoints are namespaced under /api/.
"""

from django.contrib import admin
from django.urls import include, path
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

urlpatterns = [
    # Admin
    path("admin/", admin.site.urls),
    # JWT Authentication
    path("api/auth/token/", TokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("api/auth/token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    # App endpoints
    path("api/users/", include("apps.users.urls")),
    path("api/patients/", include("apps.patients.urls")),
    path("api/appointments/", include("apps.appointments.urls")),
    path("api/notes/", include("apps.notes.urls")),
    path("api/dashboard/", include("apps.dashboard.urls")),
    path("api/reports/", include("apps.reports.urls")),
]

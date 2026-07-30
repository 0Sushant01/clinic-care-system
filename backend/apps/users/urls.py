from django.urls import path

from .views import (
    CookieTokenObtainView,
    CookieTokenRefreshView,
    CookieLogoutView,
    MeView,
)

app_name = "users"

urlpatterns = [
    path("login/", CookieTokenObtainView.as_view(), name="login"),
    path("refresh/", CookieTokenRefreshView.as_view(), name="refresh"),
    path("logout/", CookieLogoutView.as_view(), name="logout"),
    path("me/", MeView.as_view(), name="me"),
]

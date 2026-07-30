from django.urls import path
from .views import ProfileView, ChangePasswordView

app_name = "profile"

urlpatterns = [
    path("", ProfileView.as_view(), name="detail"),
    path("change-password/", ChangePasswordView.as_view(), name="change_password"),
]

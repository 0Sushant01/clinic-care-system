"""
Serializers for the users app.
"""

from django.contrib.auth import authenticate
from rest_framework import serializers
from .models import CustomUser, UserRole
from apps.therapists.models import TherapistProfile


class TherapistProfileSerializer(serializers.ModelSerializer):
    """Serialize therapist profile details."""

    class Meta:
        model = TherapistProfile
        fields = [
            "id",
            "specialization",
            "license_number",
            "years_of_experience",
            "hourly_rate",
            "bio",
            "is_available",
        ]


class LoginSerializer(serializers.Serializer):
    """Validate login credentials (email + password)."""

    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)

    def validate(self, attrs: dict) -> dict:
        email = attrs.get("email")
        password = attrs.get("password")

        user = authenticate(username=email, password=password)

        if user is None:
            raise serializers.ValidationError("Invalid email or password.")

        if not user.is_active:
            raise serializers.ValidationError("User account is deactivated.")

        attrs["user"] = user
        return attrs


class UserProfileSerializer(serializers.ModelSerializer):
    """Serialize basic user profile data."""

    full_name = serializers.CharField(read_only=True)

    class Meta:
        model = CustomUser
        fields = [
            "id",
            "email",
            "first_name",
            "last_name",
            "full_name",
            "phone",
            "role",
            "is_active",
            "last_login",
            "created_at",
            "updated_at",
        ]
        read_only_fields = fields


class UserDetailSerializer(serializers.ModelSerializer):
    """Detailed staff user serializer including workload metrics and therapist profile."""

    full_name = serializers.CharField(read_only=True)
    therapist_profile = serializers.SerializerMethodField()
    specialization = serializers.SerializerMethodField()
    patients_count = serializers.SerializerMethodField()
    today_appointments_count = serializers.SerializerMethodField()
    pending_notes_count = serializers.SerializerMethodField()

    class Meta:
        model = CustomUser
        fields = [
            "id",
            "email",
            "first_name",
            "last_name",
            "full_name",
            "phone",
            "role",
            "is_active",
            "last_login",
            "specialization",
            "patients_count",
            "today_appointments_count",
            "pending_notes_count",
            "therapist_profile",
            "created_at",
            "updated_at",
        ]
        read_only_fields = fields

    def get_therapist_profile(self, obj):
        if obj.role == UserRole.THERAPIST and hasattr(obj, "therapist_profile"):
            try:
                return TherapistProfileSerializer(obj.therapist_profile).data
            except Exception:
                return None
        return None

    def get_specialization(self, obj) -> str:
        if obj.role == UserRole.THERAPIST and hasattr(obj, "therapist_profile"):
            try:
                return obj.therapist_profile.specialization
            except Exception:
                return "N/A"
        return "N/A"

    def get_patients_count(self, obj) -> int:
        if obj.role == UserRole.THERAPIST:
            return obj.patients.filter(status="active", is_deleted=False).count()
        return 0

    def get_today_appointments_count(self, obj) -> int:
        if obj.role == UserRole.THERAPIST:
            return obj.appointments.filter(status="confirmed").count()
        return 0

    def get_pending_notes_count(self, obj) -> int:
        if obj.role == UserRole.THERAPIST:
            return obj.appointments.filter(status="completed", session_notes__isnull=True).count()
        return 0


class UserCreateSerializer(serializers.Serializer):
    """Serializer for creating staff user (Therapist, Receptionist, Admin)."""

    email = serializers.EmailField()
    first_name = serializers.CharField(max_length=150)
    last_name = serializers.CharField(max_length=150)
    phone = serializers.CharField(max_length=30, required=False, allow_blank=True)
    password = serializers.CharField(write_only=True, min_length=6)
    confirm_password = serializers.CharField(write_only=True, min_length=6)
    role = serializers.ChoiceField(choices=UserRole.choices)

    # Optional Therapist specific attributes
    specialization = serializers.CharField(required=False, allow_blank=True)
    license_number = serializers.CharField(required=False, allow_blank=True)
    years_of_experience = serializers.IntegerField(required=False, default=5)
    hourly_rate = serializers.DecimalField(max_digits=10, decimal_places=2, required=False, default=120.00)
    bio = serializers.CharField(required=False, allow_blank=True)

    def validate_email(self, value):
        if CustomUser.objects.filter(email=value).exists():
            raise serializers.ValidationError("A user with this email address already exists.")
        return value.lower()

    def validate(self, attrs):
        if attrs.get("password") != attrs.get("confirm_password"):
            raise serializers.ValidationError({"confirm_password": "Passwords do not match."})

        if attrs.get("role") == UserRole.THERAPIST:
            attrs["therapist_profile"] = {
                "specialization": attrs.pop("specialization", "General Clinical Therapy") or "General Clinical Therapy",
                "license_number": attrs.pop("license_number", ""),
                "years_of_experience": attrs.pop("years_of_experience", 5),
                "hourly_rate": attrs.pop("hourly_rate", 120.00),
                "bio": attrs.pop("bio", ""),
            }
        return attrs


class UserUpdateSerializer(serializers.Serializer):
    """Serializer for editing staff user attributes without requiring password."""

    first_name = serializers.CharField(max_length=150, required=False)
    last_name = serializers.CharField(max_length=150, required=False)
    email = serializers.EmailField(required=False)
    phone = serializers.CharField(max_length=30, required=False, allow_blank=True)
    role = serializers.ChoiceField(choices=UserRole.choices, required=False)
    is_active = serializers.BooleanField(required=False)

    # Optional Therapist fields
    specialization = serializers.CharField(required=False, allow_blank=True)
    license_number = serializers.CharField(required=False, allow_blank=True)
    years_of_experience = serializers.IntegerField(required=False)
    hourly_rate = serializers.DecimalField(max_digits=10, decimal_places=2, required=False)
    bio = serializers.CharField(required=False, allow_blank=True)

    def validate_email(self, value):
        user_id = self.context.get("user_id")
        if CustomUser.objects.filter(email=value).exclude(id=user_id).exists():
            raise serializers.ValidationError("Another user already uses this email address.")
        return value.lower()

    def validate(self, attrs):
        role = attrs.get("role") or self.context.get("current_role")
        if role == UserRole.THERAPIST:
            therapist_dict = {}
            for field in ("specialization", "license_number", "years_of_experience", "hourly_rate", "bio"):
                if field in attrs:
                    therapist_dict[field] = attrs.pop(field)
            if therapist_dict:
                attrs["therapist_profile"] = therapist_dict
        return attrs


class ProfileUpdateSerializer(serializers.Serializer):
    """Serializer for self profile update (email is strictly read-only)."""

    first_name = serializers.CharField(max_length=150, required=False)
    last_name = serializers.CharField(max_length=150, required=False)
    phone = serializers.CharField(max_length=30, required=False, allow_blank=True)

    # Therapist fields
    specialization = serializers.CharField(required=False, allow_blank=True)
    license_number = serializers.CharField(required=False, allow_blank=True)
    years_of_experience = serializers.IntegerField(required=False)
    hourly_rate = serializers.DecimalField(max_digits=10, decimal_places=2, required=False)
    bio = serializers.CharField(required=False, allow_blank=True)
    is_available = serializers.BooleanField(required=False)

    def validate(self, attrs):
        user = self.context.get("user")
        if user and user.role == UserRole.THERAPIST:
            therapist_dict = {}
            for field in ("specialization", "license_number", "years_of_experience", "hourly_rate", "bio", "is_available"):
                if field in attrs:
                    therapist_dict[field] = attrs.pop(field)
            if therapist_dict:
                attrs["therapist_profile"] = therapist_dict
        return attrs


class ResetPasswordSerializer(serializers.Serializer):
    """Serializer for Admin resetting staff member's password."""

    new_password = serializers.CharField(write_only=True, min_length=6)
    confirm_password = serializers.CharField(write_only=True, min_length=6)

    def validate(self, attrs):
        if attrs.get("new_password") != attrs.get("confirm_password"):
            raise serializers.ValidationError({"confirm_password": "Passwords do not match."})
        return attrs


class ChangePasswordSerializer(serializers.Serializer):
    """Serializer for self password change requiring correct old password."""

    old_password = serializers.CharField(write_only=True)
    new_password = serializers.CharField(write_only=True, min_length=6)
    confirm_password = serializers.CharField(write_only=True, min_length=6)

    def validate_old_password(self, value):
        user = self.context.get("user")
        if user and not user.check_password(value):
            raise serializers.ValidationError("Incorrect current password.")
        return value

    def validate(self, attrs):
        if attrs.get("new_password") != attrs.get("confirm_password"):
            raise serializers.ValidationError({"confirm_password": "Passwords do not match."})
        return attrs

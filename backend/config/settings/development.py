"""
Development settings for Clinic Care System.

Extends base settings with development-friendly defaults:
- DEBUG=True, SQLite, browsable API, permissive CORS, SameSite=Lax cookies.
"""

from .base import *  # noqa: F401, F403

# ---------------------------------------------------------------------------
# Core
# ---------------------------------------------------------------------------

DEBUG = True

# ---------------------------------------------------------------------------
# Database — SQLite for local development
# ---------------------------------------------------------------------------

DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.sqlite3",
        "NAME": BASE_DIR / "db.sqlite3",
    }
}

# ---------------------------------------------------------------------------
# DRF — add browsable API in development
# ---------------------------------------------------------------------------

REST_FRAMEWORK["DEFAULT_RENDERER_CLASSES"] = (  # noqa: F405
    "rest_framework.renderers.JSONRenderer",
    "rest_framework.renderers.BrowsableAPIRenderer",
)

# ---------------------------------------------------------------------------
# Cookie settings — relaxed for local development
# ---------------------------------------------------------------------------

JWT_COOKIE_SECURE = False
JWT_COOKIE_SAMESITE = "Lax"

CSRF_COOKIE_SECURE = False
SESSION_COOKIE_SECURE = False

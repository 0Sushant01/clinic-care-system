"""
Production settings for Clinic Care System.

Extends base settings with production hardening:
- DEBUG=False, persistent SQLite for MVP deployment, secure cookies, HSTS, SSL redirect.
"""

import os
from pathlib import Path
from .base import *  # noqa: F401, F403

# ---------------------------------------------------------------------------
# Core
# ---------------------------------------------------------------------------

DEBUG = False

# ---------------------------------------------------------------------------
# Database — Persistent SQLite for MVP deployment (PostgreSQL ready for future)
# ---------------------------------------------------------------------------

DB_ENGINE = os.getenv("DB_ENGINE", "django.db.backends.sqlite3").lower()

if DB_ENGINE == "django.db.backends.postgresql" or DB_ENGINE == "postgresql":
    DATABASES = {
        "default": {
            "ENGINE": "django.db.backends.postgresql",
            "NAME": os.getenv("DB_NAME", "clinic_care"),
            "USER": os.getenv("DB_USER", "postgres"),
            "PASSWORD": os.getenv("DB_PASSWORD", ""),
            "HOST": os.getenv("DB_HOST", "db"),
            "PORT": os.getenv("DB_PORT", "5432"),
        }
    }
else:
    DATA_DIR = BASE_DIR / "data"  # noqa: F405
    DATA_DIR.mkdir(parents=True, exist_ok=True)
    DATABASES = {
        "default": {
            "ENGINE": "django.db.backends.sqlite3",
            "NAME": DATA_DIR / "db.sqlite3",
        }
    }

# ---------------------------------------------------------------------------
# Security
# ---------------------------------------------------------------------------

SECURE_SSL_REDIRECT = os.getenv("SECURE_SSL_REDIRECT", "False").lower() in ("true", "1")
SECURE_HSTS_SECONDS = 31536000  # 1 year
SECURE_HSTS_INCLUDE_SUBDOMAINS = True
SECURE_HSTS_PRELOAD = True
SECURE_PROXY_SSL_HEADER = ("HTTP_X_FORWARDED_PROTO", "https")

# ---------------------------------------------------------------------------
# Cookie settings — strict for production
# ---------------------------------------------------------------------------

JWT_COOKIE_SECURE = os.getenv("JWT_COOKIE_SECURE", "True").lower() in ("true", "1")
JWT_COOKIE_SAMESITE = "Lax"

CSRF_COOKIE_SECURE = JWT_COOKIE_SECURE
SESSION_COOKIE_SECURE = JWT_COOKIE_SECURE
CSRF_COOKIE_SAMESITE = "Lax"
SESSION_COOKIE_SAMESITE = "Lax"

# ---------------------------------------------------------------------------
# Logging — production level
# ---------------------------------------------------------------------------

LOGGING["loggers"]["django"]["level"] = "INFO"  # noqa: F405
LOGGING["loggers"]["apps"]["level"] = "INFO"  # noqa: F405
LOGGING["loggers"]["services"]["level"] = "INFO"  # noqa: F405

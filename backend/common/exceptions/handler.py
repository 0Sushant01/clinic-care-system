"""
Global exception handler for Django REST Framework.

Ensures ALL API errors return consistent JSON:
{
    "success": false,
    "message": "Human-readable error message",
    "errors": { ... }
}

No Django HTML error pages ever reach the client.
"""

import logging
from typing import Any

from django.http import Http404
from django.core.exceptions import PermissionDenied, ValidationError as DjangoValidationError
from rest_framework import status
from rest_framework.exceptions import APIException, ValidationError
from rest_framework.response import Response
from rest_framework.views import exception_handler

logger = logging.getLogger("apps")


def custom_exception_handler(exc: Exception, context: Any) -> Response | None:
    """
    Custom exception handler that wraps all errors in a consistent format.

    Handles:
    - DRF exceptions (validation errors, auth errors, etc.)
    - Django Http404
    - Django PermissionDenied
    - Django ValidationError
    - Unhandled exceptions (500)
    """
    # Let DRF handle the exception first (sets headers, etc.)
    response = exception_handler(exc, context)

    if response is not None:
        # DRF already handled it — reshape the response
        return _format_error_response(response, exc)

    # Handle Django exceptions not caught by DRF
    if isinstance(exc, Http404):
        return Response(
            {"success": False, "message": "Not found.", "errors": {}},
            status=status.HTTP_404_NOT_FOUND,
        )

    if isinstance(exc, PermissionDenied):
        return Response(
            {"success": False, "message": "Permission denied.", "errors": {}},
            status=status.HTTP_403_FORBIDDEN,
        )

    if isinstance(exc, DjangoValidationError):
        return Response(
            {
                "success": False,
                "message": "Validation error.",
                "errors": exc.message_dict if hasattr(exc, "message_dict") else {"detail": exc.messages},
            },
            status=status.HTTP_400_BAD_REQUEST,
        )

    # Unhandled exception — log and return generic 500
    logger.exception("Unhandled exception: %s", exc)
    return Response(
        {"success": False, "message": "An unexpected error occurred.", "errors": {}},
        status=status.HTTP_500_INTERNAL_SERVER_ERROR,
    )


def _format_error_response(response: Response, exc: Exception) -> Response:
    """Reshape a DRF error response into our standard format."""
    errors: dict = {}
    message = "An error occurred."

    if isinstance(exc, ValidationError):
        message = "Validation error."
        errors = response.data if isinstance(response.data, dict) else {"detail": response.data}
    elif isinstance(response.data, dict) and "detail" in response.data:
        message = str(response.data["detail"])
    elif isinstance(response.data, list):
        message = str(response.data[0]) if response.data else message

    response.data = {
        "success": False,
        "message": message,
        "errors": errors,
    }
    return response

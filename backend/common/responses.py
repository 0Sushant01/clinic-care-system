"""
Consistent API response helpers.

All views should use these helpers to ensure uniform response structure
across the entire API.

Usage:
    from common.responses import success_response, error_response

    return success_response(data=serializer.data, message="Patient created", status_code=201)
    return error_response(message="Not found", status_code=404)
"""

from typing import Any

from rest_framework.response import Response


def success_response(
    data: Any = None,
    message: str = "Success",
    status_code: int = 200,
) -> Response:
    """Return a standardized success response."""
    payload: dict[str, Any] = {
        "success": True,
        "message": message,
    }
    if data is not None:
        payload["data"] = data
    return Response(payload, status=status_code)


def error_response(
    message: str = "An error occurred",
    errors: dict | list | None = None,
    status_code: int = 400,
) -> Response:
    """Return a standardized error response."""
    payload: dict[str, Any] = {
        "success": False,
        "message": message,
    }
    if errors is not None:
        payload["errors"] = errors
    return Response(payload, status=status_code)

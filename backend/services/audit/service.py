"""
Audit logging service.

Provides a unified interface for recording administrative and clinical user actions
(e.g., User X edited Patient Y at timestamp).
"""

import logging
from typing import Any, Optional

logger = logging.getLogger("services.audit")


class AuditLogService:
    """Service to log audit events across the application."""

    @staticmethod
    def log_action(
        user: Any,
        action: str,
        resource_type: str,
        resource_id: Optional[str] = None,
        details: Optional[dict] = None,
    ) -> None:
        """
        Record an audit log entry.

        Args:
            user: User object or string identifier performing the action.
            action: Action performed (e.g. 'CREATE', 'UPDATE', 'DELETE', 'VIEW').
            resource_type: Model or resource name (e.g. 'Patient', 'Appointment').
            resource_id: Optional ID of resource.
            details: Additional context details dict.
        """
        user_str = getattr(user, "email", str(user))
        logger.info(
            "AUDIT | User: %s | Action: %s | Resource: %s | ID: %s | Details: %s",
            user_str,
            action,
            resource_type,
            resource_id or "N/A",
            details or {},
        )

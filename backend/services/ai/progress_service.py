"""
AI-powered patient progress service.

Generates progress reports by analyzing multiple session summaries
over time using the OpenRouter API.

TODO: Implement when AI integration begins.
"""

from typing import Any


class ProgressService:
    """Generate AI-powered patient progress reports."""

    def generate_progress_report(
        self, session_summaries: list[dict[str, Any]]
    ) -> dict[str, Any]:
        """
        Generate a progress report from multiple session summaries.

        Args:
            session_summaries: List of session summary dicts.

        Returns:
            Dict containing the structured progress report.

        Raises:
            NotImplementedError: AI integration is not yet implemented.
        """
        raise NotImplementedError("AI integration is not yet implemented.")

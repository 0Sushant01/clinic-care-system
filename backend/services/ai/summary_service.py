"""
AI-powered session summary service.

Generates concise clinical summaries from therapy session notes
using the OpenRouter API.

TODO: Implement when AI integration begins.
"""

from typing import Any


class SummaryService:
    """Generate AI-powered session summaries."""

    def generate_summary(self, session_notes: str) -> dict[str, Any]:
        """
        Generate a clinical summary from session notes.

        Args:
            session_notes: Raw text of the therapy session notes.

        Returns:
            Dict containing the structured summary.

        Raises:
            NotImplementedError: AI integration is not yet implemented.
        """
        raise NotImplementedError("AI integration is not yet implemented.")

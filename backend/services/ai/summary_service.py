"""
AI-powered session summary service.
"""

from typing import Any, Dict
from .client import AIClientManager


class SummaryService:
    """Generate AI-powered session summaries."""

    def __init__(self) -> None:
        self.ai_client = AIClientManager()

    def generate_summary(self, session_notes: str) -> Dict[str, Any]:
        """
        Generate clinical summary from session notes.

        Raises:
            NotImplementedError: AI integration is planned for a future milestone.
        """
        prompt = self.ai_client.load_prompt("session_summary.txt", notes=session_notes)
        messages = [{"role": "user", "content": prompt}]
        return self.ai_client.chat_completion(messages)

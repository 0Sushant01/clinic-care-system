"""
AI-powered patient progress service.
"""

from typing import Any, Dict, List
from .client import AIClientManager


class ProgressService:
    """Generate AI-powered patient progress reports."""

    def __init__(self) -> None:
        self.ai_client = AIClientManager()

    def generate_progress_report(
        self, session_summaries: List[Dict[str, Any]]
    ) -> Dict[str, Any]:
        """
        Generate progress report from session summaries.

        Raises:
            NotImplementedError: AI integration is planned for a future milestone.
        """
        formatted_summaries = "\n".join([str(s) for s in session_summaries])
        prompt = self.ai_client.load_prompt("progress_summary.txt", summaries=formatted_summaries)
        messages = [{"role": "user", "content": prompt}]
        return self.ai_client.chat_completion(messages)

"""
Google Gemini AI Provider stub.
"""

import os
from typing import Any, Dict, List
from .base import BaseAIProvider


class GeminiProvider(BaseAIProvider):
    """AI Provider for Google Gemini API."""

    def __init__(self) -> None:
        self.api_key: str = os.getenv("GEMINI_API_KEY", "")

    def chat_completion(
        self,
        messages: List[Dict[str, str]],
        model: str | None = None,
        temperature: float = 0.7,
        **kwargs: Any,
    ) -> Dict[str, Any]:
        """Send a chat completion request to Gemini."""
        raise NotImplementedError("Gemini provider is not yet implemented.")

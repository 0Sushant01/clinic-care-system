"""
OpenAI Provider stub.
"""

import os
from typing import Any, Dict, List
from .base import BaseAIProvider


class OpenAIProvider(BaseAIProvider):
    """AI Provider for OpenAI API."""

    def __init__(self) -> None:
        self.api_key: str = os.getenv("OPENAI_API_KEY", "")

    def chat_completion(
        self,
        messages: List[Dict[str, str]],
        model: str | None = None,
        temperature: float = 0.7,
        **kwargs: Any,
    ) -> Dict[str, Any]:
        """Send a chat completion request to OpenAI."""
        raise NotImplementedError("OpenAI provider is not yet implemented.")

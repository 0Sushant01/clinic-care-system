"""
OpenRouter AI Provider implementation.
"""

import os
from typing import Any, Dict, List
from .base import BaseAIProvider


class OpenRouterProvider(BaseAIProvider):
    """AI Provider for OpenRouter API."""

    BASE_URL = "https://openrouter.ai/api/v1"

    def __init__(self) -> None:
        self.api_key: str = os.getenv("OPENROUTER_API_KEY", "")
        self.default_model: str = os.getenv("OPENROUTER_MODEL", "qwen/qwen3-235b-a22b:free")

    def chat_completion(
        self,
        messages: List[Dict[str, str]],
        model: str | None = None,
        temperature: float = 0.7,
        **kwargs: Any,
    ) -> Dict[str, Any]:
        """
        Send a chat completion request to OpenRouter.

        Raises:
            NotImplementedError: AI integration is planned for a future milestone.
        """
        target_model = model or self.default_model
        raise NotImplementedError("OpenRouter integration is not yet implemented.")

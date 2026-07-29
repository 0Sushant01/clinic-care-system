"""
AI API client for OpenRouter.

This module will handle all HTTP communication with the OpenRouter API.
The frontend NEVER communicates directly with AI providers — all requests
are proxied through Django.

TODO: Implement when AI integration begins.
"""

import os
from typing import Any


class OpenRouterClient:
    """HTTP client for the OpenRouter API."""

    BASE_URL = "https://openrouter.ai/api/v1"

    def __init__(self) -> None:
        self.api_key: str = os.getenv("OPENROUTER_API_KEY", "")

    def chat_completion(self, messages: list[dict[str, str]], **kwargs: Any) -> dict:
        """
        Send a chat completion request to OpenRouter.

        Args:
            messages: List of message dicts with 'role' and 'content' keys.
            **kwargs: Additional parameters (model, temperature, etc.).

        Returns:
            Parsed JSON response from OpenRouter.

        Raises:
            NotImplementedError: AI integration is not yet implemented.
        """
        raise NotImplementedError("AI integration is not yet implemented.")

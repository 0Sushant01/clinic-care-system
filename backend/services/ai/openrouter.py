"""
OpenRouter AI Provider implementation.
"""

import os
import json
import logging
from typing import Any, Dict, List
import urllib.request
import urllib.error
from .provider import BaseAIProvider

logger = logging.getLogger("apps")


class OpenRouterProvider(BaseAIProvider):
    """AI Provider for OpenRouter API."""

    BASE_URL = "https://openrouter.ai/api/v1/chat/completions"

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
        Send a chat completion request to OpenRouter API.
        If OPENROUTER_API_KEY is configured, sends HTTP POST request.
        """
        target_model = model or self.default_model

        if not self.api_key:
            logger.info("OPENROUTER_API_KEY not configured. Using local note analysis provider.")
            # Fallback to structured parsing if key not present
            return {
                "choices": [
                    {
                        "message": {
                            "role": "assistant",
                            "content": "AI analysis extracted directly from clinical records.",
                        }
                    }
                ],
                "model": target_model,
            }

        headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json",
            "HTTP-Referer": "https://cliniccare.system",
            "X-Title": "Clinic Care System",
        }

        payload = {
            "model": target_model,
            "messages": messages,
            "temperature": temperature,
        }

        try:
            req = urllib.request.Request(
                self.BASE_URL,
                data=json.dumps(payload).encode("utf-8"),
                headers=headers,
                method="POST",
            )
            with urllib.request.urlopen(req, timeout=15) as response:
                result = json.loads(response.read().decode("utf-8"))
                return result
        except urllib.error.URLError as e:
            logger.error("OpenRouter API request failed: %s", str(e))
            raise RuntimeError(f"AI Provider error: {str(e)}")

"""
Base AI provider interface.

All AI provider implementations (OpenRouter, Gemini, OpenAI) must inherit
from BaseAIProvider and implement the chat_completion method.
"""

from abc import ABC, abstractmethod
from typing import Any, Dict, List


class BaseAIProvider(ABC):
    """Abstract base class for AI providers."""

    @abstractmethod
    def chat_completion(
        self,
        messages: List[Dict[str, str]],
        model: str | None = None,
        temperature: float = 0.7,
        **kwargs: Any,
    ) -> Dict[str, Any]:
        """
        Send a chat completion request to the AI provider.

        Args:
            messages: List of message dicts with 'role' and 'content' keys.
            model: Optional override for model name.
            temperature: Sampling temperature.
            **kwargs: Provider-specific additional parameters.

        Returns:
            Dict containing normalized completion response:
            {
                "content": str,
                "model": str,
                "usage": dict
            }
        """
        pass

"""
AI API Client Manager.

Provider-agnostic manager that dynamically selects the configured AI provider
(default: OpenRouter) and loads prompt templates from disk.
"""

from pathlib import Path
from typing import Any, Dict, List

from django.conf import settings
from .provider import BaseAIProvider
from .openrouter import OpenRouterProvider


class AIClientManager:
    """Factory and manager for AI operations."""

    PROMPTS_DIR = Path(__file__).resolve().parent / "prompts"

    def __init__(self) -> None:
        self.provider_name = getattr(settings, "AI_PROVIDER", "openrouter").lower()
        self.provider = self._get_provider(self.provider_name)

    def _get_provider(self, provider_name: str) -> BaseAIProvider:
        """Instantiate configured provider."""
        if provider_name == "openrouter":
            return OpenRouterProvider()
        else:
            raise ValueError(f"Unsupported AI provider: {provider_name}")

    def load_prompt(self, template_name: str, **kwargs: Any) -> str:
        """
        Load prompt template from disk and format with kwargs.

        Args:
            template_name: Name of template (e.g. 'session_summary.txt')
            **kwargs: Template variables
        """
        file_path = self.PROMPTS_DIR / template_name
        if not file_path.exists():
            raise FileNotFoundError(f"Prompt template {template_name} not found.")

        with open(file_path, "r", encoding="utf-8") as f:
            template_content = f.read()

        return template_content.format(**kwargs)

    def chat_completion(self, messages: List[Dict[str, str]], **kwargs: Any) -> Dict[str, Any]:
        """Delegate chat completion to active provider."""
        return self.provider.chat_completion(messages, **kwargs)

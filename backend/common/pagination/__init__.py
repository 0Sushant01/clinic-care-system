"""
Standard pagination for the Clinic Care System API.

Referenced by REST_FRAMEWORK['DEFAULT_PAGINATION_CLASS'] in settings.

Supports:
    ?page=2          — page number
    ?page_size=50    — override default page size (max 100)
"""

from rest_framework.pagination import PageNumberPagination


class StandardPagination(PageNumberPagination):
    """Default pagination: 20 items per page, max 100."""

    page_size = 20
    page_size_query_param = "page_size"
    max_page_size = 100

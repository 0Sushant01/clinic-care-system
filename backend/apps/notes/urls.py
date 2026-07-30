from rest_framework.routers import DefaultRouter
from .views import SessionNoteViewSet

app_name = "notes"

router = DefaultRouter()
router.register(r"", SessionNoteViewSet, basename="note")

urlpatterns = router.urls

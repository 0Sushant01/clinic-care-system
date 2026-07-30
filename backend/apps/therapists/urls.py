from rest_framework.routers import DefaultRouter
from .views import TherapistViewSet

app_name = "therapists"

router = DefaultRouter()
router.register(r"", TherapistViewSet, basename="therapist")

urlpatterns = router.urls

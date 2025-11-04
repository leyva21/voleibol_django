from rest_framework.routers import DefaultRouter
from .views import TeamRegistrationViewSet

router = DefaultRouter()
router.register(r"equipos", TeamRegistrationViewSet, basename="equipos")

urlpatterns = router.urls

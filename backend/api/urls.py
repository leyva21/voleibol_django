from django.contrib import admin
from django.urls import path, include
from rest_framework import routers
from voleibol.views import TeamRegistrationViewSet
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from django.conf import settings
from django.conf.urls.static import static
from voleibol.views import DetectReceiptView

router = routers.DefaultRouter()
router.register(r"registrations", TeamRegistrationViewSet, basename="registrations")

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/", include(router.urls)),
    # Auth
    path("api/auth/login/", TokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("api/auth/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    path("api/verify-receipt/", DetectReceiptView.as_view(), name="verify_receipt"),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
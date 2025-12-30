from rest_framework.routers import DefaultRouter
from .views import CatViewSet
from django.urls import path, include

router = DefaultRouter()
router.register(r"cat", CatViewSet)

urlpatterns = [
    path("", include(router.urls)),
]
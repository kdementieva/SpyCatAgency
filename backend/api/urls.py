from rest_framework.routers import DefaultRouter
from .views import CatViewSet, MissionViewSet, TargetViewSet
from django.urls import path, include

router = DefaultRouter()
router.register(r"cat", CatViewSet)
router.register(r"mission", MissionViewSet)
router.register(r"target", TargetViewSet)

urlpatterns = [
    path("", include(router.urls)),
]

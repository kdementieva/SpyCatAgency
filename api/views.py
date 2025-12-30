from rest_framework.viewsets import ModelViewSet
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework import status

from .models import Cat, Mission, Target
from .serializers import CatSerializer, MissionSerializer, TargetSerializer


class CatViewSet(ModelViewSet):
    queryset = Cat.objects.all()
    serializer_class = CatSerializer
    permission_classes = [AllowAny]


class MissionViewSet(ModelViewSet):
    queryset = Mission.objects.all()
    serializer_class = MissionSerializer
    permission_classes = [AllowAny]

    def destroy(self, request, *args, **kwargs):
        mission = self.get_object()

        if mission.cat_id:
            return Response(
                {"detail": "A mission assigned to a cat cannot be deleted."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        return super().destroy(request, *args, **kwargs)


class TargetViewSet(ModelViewSet):
    queryset = Target.objects.select_related("mission").all()
    serializer_class = TargetSerializer
    permission_classes = [AllowAny]
    http_method_names = ["get", "patch", "put", "head", "options"]

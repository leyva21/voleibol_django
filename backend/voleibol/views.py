# Create your views here.
from rest_framework import viewsets
from .models import Voleibol
from .serializers import VoleibolSerializer

class VoleibolViewSet(viewsets.ModelViewSet):
    queryset = Voleibol.objects.all().order_by("id")
    serializer_class = VoleibolSerializer

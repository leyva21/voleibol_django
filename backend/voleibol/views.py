from rest_framework import viewsets
from rest_framework.parsers import MultiPartParser, FormParser
from .models import TeamRegistration
from .serializers import TeamRegistrationSerializer

class TeamRegistrationViewSet(viewsets.ModelViewSet):
    queryset = TeamRegistration.objects.all()
    serializer_class = TeamRegistrationSerializer
    parser_classes = [MultiPartParser, FormParser]
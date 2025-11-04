from rest_framework import viewsets
from rest_framework.parsers import MultiPartParser, FormParser
from .models import TeamRegistration
from .serializers import TeamRegistrationSerializer

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .detector import detect_receipt

class TeamRegistrationViewSet(viewsets.ModelViewSet):
    queryset = TeamRegistration.objects.all()
    serializer_class = TeamRegistrationSerializer
    parser_classes = [MultiPartParser, FormParser]

class DetectReceiptView(APIView):
    parser_classes = [MultiPartParser, FormParser]

    def post(self, request):
        file = request.FILES.get("file")
        if not file:
            return Response({"error": "No se envió ningún archivo."}, status=status.HTTP_400_BAD_REQUEST)

        result = detect_receipt(file)
        return Response(result, status=status.HTTP_200_OK)
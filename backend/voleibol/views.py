from .permissions import group_required
from rest_framework import viewsets
from rest_framework.parsers import MultiPartParser, FormParser
from .models import TeamRegistration
from .serializers import TeamRegistrationSerializer
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .detector import detect_receipt

class TeamRegistrationViewSet(viewsets.ModelViewSet):
    queryset = TeamRegistration.objects.all()
    serializer_class = TeamRegistrationSerializer
    parser_classes = [MultiPartParser, FormParser]
    permission_classes = [IsAuthenticated, group_required("Delegado", "Admin")]

    def get_permissions(self):
        if self.action == "create":            # POST /api/registrations/
            return [AllowAny()]
        # Para listar/ver/editar/borrar:
        return [IsAuthenticated(), group_required("Delegado", "Admin")()]

class DetectReceiptView(APIView):
    parser_classes = [MultiPartParser, FormParser]

    def post(self, request):
        file = request.FILES.get("file")
        if not file:
            return Response({"error": "No se envió ningún archivo."}, status=status.HTTP_400_BAD_REQUEST)

        result = detect_receipt(file)
        return Response(result, status=status.HTTP_200_OK)

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def me_view(request):
    u = request.user
    return Response({
        "id": u.id,
        "username": u.username,
        "email": u.email,
        "first_name": u.first_name,
        "last_name": u.last_name,
        "groups": list(u.groups.values_list("name", flat=True)),  # ✅ roles
        "is_superuser": u.is_superuser,
    })
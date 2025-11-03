from rest_framework import serializers
from django.contrib.auth.models import User
from .models import TeamRegistration

class TeamRegistrationSerializer(serializers.ModelSerializer):
    category_display = serializers.CharField(source="get_category_display", read_only=True)

    class Meta:
        model = TeamRegistration
        fields = [
            "id",
            "team_name", "category", "category_display",
            "logo",
            "payment_proof", "payment_reference",
            "delegate_name", "email", "address", "phone",
            "created_at",
        ]
        read_only_fields = ["id", "created_at", "category_display"]

    def create(self, validated_data):
        reg = super().create(validated_data)

        # Crear usuario: username=email, password inicial = phone
        email = validated_data.get("email")
        phone = validated_data.get("phone")
        full_name = validated_data.get("delegate_name", "").split()
        user, created = User.objects.get_or_create(
            username=email,
            defaults={
                "email": email,
                "first_name": full_name[0] if full_name else "",
                "last_name": " ".join(full_name[1:]) if len(full_name) > 1 else "",
            },
        )
        if created:
            user.set_password(phone)  # cambia después del primer login
            user.save()

        return reg

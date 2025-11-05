from rest_framework import serializers
from django.contrib.auth.models import User, Group
from .models import TeamRegistration
import re

PHONE_RE = re.compile(r"^\d{10}$")

class TeamRegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=8)
    password_confirm = serializers.CharField(write_only=True)
    category_display = serializers.CharField(source="get_category_display", read_only=True)

    class Meta:
        model = TeamRegistration
        fields = [
            "id",
            "team_name", "category", "category_display",
            "logo",
            "payment_proof", "payment_reference",
            "delegate_name", "email", "address", "phone",
            "password", "password_confirm",
            "created_at",
        ]
        read_only_fields = ["id", "created_at", "category_display"]

    def validate_phone(self, value):
        # quitar espacios o guiones si quieres permitirlos:
        value = re.sub(r"\D", "", value)  # deja solo dígitos
        if not PHONE_RE.match(value):
            raise serializers.ValidationError("El teléfono debe tener exactamente 10 dígitos.")
        return value

    def validate_password(self, value):
        # Al menos 8, una letra y un número
        if not re.match(r"^(?=.*[A-Za-z])(?=.*\d).{8,}$", value):
            raise serializers.ValidationError(
                "La contraseña debe tener mínimo 8 caracteres e incluir al menos una letra y un número."
            )
        return value

    def validate(self, attrs):
        if attrs.get("password") != attrs.get("password_confirm"):
            raise serializers.ValidationError({"password_confirm": "Las contraseñas no coinciden."})
        return attrs

    def create(self, validated_data):
        password = validated_data.pop("password")
        validated_data.pop("password_confirm", None)

        reg = super().create(validated_data)

        email = validated_data.get("email")
        name = validated_data.get("delegate_name", "").split()

        user, created = User.objects.get_or_create(
            username=email,
            defaults={
                "email": email,
                "first_name": name[0] if name else "",
                "last_name": " ".join(name[1:]) if len(name) > 1 else "",
            },
        )
        user.set_password(password)
        user.save()

        delegado, _ = Group.objects.get_or_create(name="Delegado")
        user.groups.add(delegado)

        return reg
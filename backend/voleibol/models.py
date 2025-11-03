from django.db import models
from django.core.validators import FileExtensionValidator

def validate_file_size(file_obj):
    max_mb = 5
    if file_obj.size > max_mb * 1024 * 1024:
        from django.core.exceptions import ValidationError
        raise ValidationError(f"El archivo supera {max_mb}MB.")

class TeamRegistration(models.Model):
    CATEGORY_CHOICES = [
        ("M", "Varonil"),
        ("F", "Femenil"),
    ]

    # Datos del equipo
    team_name = models.CharField("Nombre del Equipo", max_length=150)
    category = models.CharField("Categoría", max_length=1, choices=CATEGORY_CHOICES)
    logo = models.ImageField(
        "Logo del Equipo (Opcional)",
        upload_to="logos/", blank=True, null=True,
        validators=[validate_file_size, FileExtensionValidator(["jpg","jpeg","png","gif"])]
    )
    payment_proof = models.FileField(
        "Comprobante de Pago",
        upload_to="payments/",
        validators=[validate_file_size, FileExtensionValidator(["jpg","jpeg","png","pdf","doc","docx"])]
    )
    payment_reference = models.CharField("Número de Referencia de Pago", max_length=80)

    # Delegado/entrenador
    delegate_name = models.CharField("Nombre Completo", max_length=150)
    email = models.EmailField("Correo Electrónico")
    address = models.CharField("Dirección", max_length=200)
    phone = models.CharField("Teléfono/Celular", max_length=20)

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = "Registro de Equipo"
        verbose_name_plural = "Registros de Equipos"
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.team_name} ({self.get_category_display()})"
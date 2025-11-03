from django.contrib import admin
from .models import TeamRegistration

@admin.register(TeamRegistration)
class TeamRegistrationAdmin(admin.ModelAdmin):
    list_display = ("team_name","category","delegate_name","email","phone","created_at")
    list_filter = ("category","created_at")
    search_fields = ("team_name","delegate_name","email","payment_reference")
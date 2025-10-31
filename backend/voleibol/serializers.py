from rest_framework import serializers
from .models import Voleibol

class VoleibolSerializer(serializers.ModelSerializer):
    class Meta:
        model = Voleibol
        fields = ["id", "team_name", "coach_name", "founded_year", "championships_won"]

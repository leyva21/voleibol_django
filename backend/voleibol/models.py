from django.db import models

# Create your models here.
class Voleibol(models.Model):
    team_name = models.CharField(max_length=100)
    coach_name = models.CharField(max_length=100)
    founded_year = models.IntegerField()
    championships_won = models.IntegerField()

    def __str__(self):
        return self.team_name
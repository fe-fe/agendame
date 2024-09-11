from django.db import models
from django.conf import settings

class Materia(models.Model):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL, 
        on_delete=models.CASCADE, 
        related_name="materias"    
    )
    nome = models.CharField(max_length=50)
    horas = models.IntegerField(default=0)
    faltas = models.IntegerField(default=0)

    def __str__(self):
        return self.nome

class Nota(models.Model):
    nome = models.CharField(max_length=40)
    peso = models.IntegerField(default=0)
    resultado = models.IntegerField(default=0)
    materia = models.ForeignKey(Materia, on_delete=models.CASCADE)
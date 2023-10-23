from django.db import models

# Create your models here.
from django.contrib.auth.models import User

class Photo(models.Model):
    image = models.ImageField()
    description = models.TextField()
    user = models.ForeignKey(User, on_delete=models.CASCADE)

    def __str__(self):
        return self.description


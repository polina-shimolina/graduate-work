from django.db import models
from django.contrib.auth.models import User
# Create your models here.

class Photo(models.Model):
    name = models.CharField(max_length=60)
    image = models.ImageField(default='default_image.jpg')

    def __str__(self):
        return self.name
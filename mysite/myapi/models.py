from django.db import models

# Create your models here.

class Photo(models.Model):
    name = models.CharField(max_length=60)
    path_to_file = models.FileField()
    class_name = models.CharField(max_length=60)

    def __str__(self):
        return self.name
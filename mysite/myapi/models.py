from django.db import models
from django.contrib.auth.models import User
# Create your models here.

class UploadedFile(models.Model):
    file = models.FileField(upload_to='uploads/')
    uploaded_at = models.DateTimeField(auto_now_add=True)
    
class SegmentedPhoto(models.Model):
    photo = models.ImageField(upload_to='segmented/')

class UserPhoto(models.Model):
    uploaded_photo = models.ImageField(upload_to='photos/')
    segmented_photo = models.OneToOneField(SegmentedPhoto, on_delete=models.CASCADE)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    is_visible_to_team = models.BooleanField(default=False)

class Team(models.Model):
    teamname = models.CharField(max_length=100)
    description = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    creator = models.ForeignKey(User, on_delete=models.CASCADE, related_name='teams')
    
    def __str__(self):
        return self.teamname
    

class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    team = models.ForeignKey(Team, on_delete=models.SET_NULL, null=True, blank=True)

# Расширяем базовую модель пользователя Django
User.profile = property(lambda u: UserProfile.objects.get_or_create(user=u)[0])
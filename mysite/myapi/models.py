from django.db import models
from django.contrib.auth.models import User
# Create your models here.

class Photo(models.Model):
    name = models.CharField(max_length=60)
    image = models.ImageField()

    def __str__(self):
        return self.name
    
class Team(models.Model):
    teamname = models.CharField(max_length=100)
    description = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    creator = models.ForeignKey(User, on_delete=models.CASCADE, related_name='teams')
    
    def __str__(self):
        return self.teamname


class UserPhoto(models.Model):
    photo = models.ForeignKey(Photo, on_delete=models.CASCADE, related_name='user_photos')
    owner = models.ForeignKey(User, on_delete=models.CASCADE, related_name='owned_photos')
    segmented_photo = models.ForeignKey(Photo, on_delete=models.CASCADE, related_name='segmentated_photos')
    is_visible_for_team = models.BooleanField(default=True)
    def __str__(self):
        return f"UserPhoto {self.id} - Owner: {self.owner.username}"
    

class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    team = models.ForeignKey(Team, on_delete=models.SET_NULL, null=True, blank=True)

# Расширяем базовую модель пользователя Django
User.profile = property(lambda u: UserProfile.objects.get_or_create(user=u)[0])
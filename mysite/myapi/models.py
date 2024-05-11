from django.db import models
from django.contrib.auth.models import User
# Create your models here.

class UploadedPhoto(models.Model):
    photo = models.ImageField(upload_to='uploads/')
    

class SegmentedPhoto(models.Model):
    photo = models.ImageField(upload_to='segmented/')


class UserPhoto(models.Model):
    uploaded_photo = models.OneToOneField(UploadedPhoto, on_delete=models.CASCADE)
    segmented_photo = models.OneToOneField(SegmentedPhoto, on_delete=models.CASCADE)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    is_visible_to_team = models.BooleanField(default=False)

class TeamPhoto(models.Model):
    uploaded_photo = models.OneToOneField(UploadedPhoto, on_delete=models.CASCADE)
    segmented_photo = models.OneToOneField(SegmentedPhoto, on_delete=models.CASCADE)
    owner = models.ForeignKey(User, on_delete=models.CASCADE, related_name='team_photos_owned')
    team = models.ForeignKey(User, on_delete=models.CASCADE, related_name='team_photos')


class Comment(models.Model):
    user_photo = models.ForeignKey('UserPhoto', on_delete=models.CASCADE)
    author = models.ForeignKey(User, on_delete=models.CASCADE)
    publication_datetime = models.DateTimeField(auto_now_add=True)
    text = models.TextField()

    def __str__(self):
        return f'Comment by {self.author.username} on {self.user_photo}'
    

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
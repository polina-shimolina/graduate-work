from django.contrib import admin
# Register your models here.

from .models import UploadedPhoto, Team, UserProfile, SegmentedPhoto, UserPhoto, TeamPhoto, Comment

admin.site.register(UploadedPhoto)
admin.site.register(SegmentedPhoto)
admin.site.register(UserPhoto)
admin.site.register(TeamPhoto)
admin.site.register(Comment)
admin.site.register(Team)
admin.site.register(UserProfile)

from django.contrib import admin
# Register your models here.

from .models import UploadedPhoto, Team, UserProfile

admin.site.register(UploadedPhoto)
admin.site.register(Team)
admin.site.register(UserProfile)

from django.contrib import admin
# Register your models here.

from .models import UploadedFile, Team, UserProfile

admin.site.register(UploadedFile)
admin.site.register(Team)
admin.site.register(UserProfile)

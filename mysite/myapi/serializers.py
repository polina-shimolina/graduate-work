from rest_framework import serializers
from .models import Photo
from django.contrib.auth.models import User

class PhotoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Photo
        fields = ('id', 'name', 'path_to_file', 'class_name')




class UserSerializer(serializers.ModelSerializer):
       class Meta:
           model = User
           fields = ['username', 'first_name', 'last_name', 'email', 'date_joined']

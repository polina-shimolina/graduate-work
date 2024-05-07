from rest_framework import serializers
from .models import Team, UserProfile, UploadedPhoto, SegmentedPhoto, UserPhoto
from django.contrib.auth.models import User
from rest_framework.serializers import Serializer, ModelSerializer, CharField
from rest_framework.authtoken.models import Token

class UploadedPhotoSerializer(serializers.ModelSerializer):
    class Meta:
        model = UploadedPhoto
        fields = ['id', 'file']

class SegmentedPhotoSerializer(serializers.ModelSerializer):
       class Meta:
           model = SegmentedPhoto
           fields = '__all__'

class UserPhotoSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserPhoto
        fields = '__all__'

class LoginRequestSerializer(Serializer):
    model = User

    username = CharField(required=True)
    password = CharField(required=True)


class TeamSerializer(serializers.ModelSerializer):
    class Meta:
        model = Team
        fields = '__all__'


class UserProfileSerializer(serializers.ModelSerializer):
    team = TeamSerializer()

    class Meta:
        model = UserProfile
        fields = '__all__'


class UserSerializer(serializers.ModelSerializer):
        profile = UserProfileSerializer()
        class Meta:
           model = User
           fields = ['id', 'username', 'first_name', 'last_name', 'email', 'date_joined', 'profile']
        
        def create(self, validated_data):
            profile_data = validated_data.pop('profile')
            user = User.objects.create(**validated_data)
            UserProfile.objects.create(user=user, **profile_data)
            return user

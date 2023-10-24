from django.shortcuts import render
from django.contrib.auth.decorators import login_required
# Create your views here.
from rest_framework import viewsets, permissions

from .serializers import PhotoSerializer, UserSerializer
from .models import Photo
from django.contrib.auth.models import User

@login_required
class PhotoViewSet(viewsets.ModelViewSet):
    queryset = Photo.objects.all().order_by('name')
    serializer_class = PhotoSerializer


class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.AllowAny]  # Разрешите доступ всем

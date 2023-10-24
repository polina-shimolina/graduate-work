from django.shortcuts import render

# Create your views here.
from rest_framework import viewsets

from .serializers import PhotoSerializer
from .models import Photo


class PhotoViewSet(viewsets.ModelViewSet):
    queryset = Photo.objects.all().order_by('name')
    serializer_class = PhotoSerializer
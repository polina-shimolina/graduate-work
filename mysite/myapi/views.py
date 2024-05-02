from rest_framework import viewsets, permissions
from .serializers import PhotoSerializer, UserSerializer
from .models import Photo
from django.contrib.auth.models import User
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes, authentication_classes
from myapi.serializers import UserSerializer, LoginRequestSerializer
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework_simplejwt.authentication import JWTAuthentication
from django.contrib.auth import authenticate, login

class PhotoViewSet(viewsets.ModelViewSet):
    queryset = Photo.objects.all().order_by('name')
    serializer_class = PhotoSerializer


class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.AllowAny]  # Разрешите доступ всем

@csrf_exempt
def upload_photo(request):
    if request.method == 'POST' and request.FILES.get('photo'):
        photo = request.FILES['photo']
        new_photo = Photo(image=photo)
        new_photo.save()
        response = JsonResponse({'message': 'Файл успешно загружен'})
        response["Access-Control-Allow-Origin"] = "http://localhost:3000"
        return response
    else:
        return JsonResponse({'message': 'Ошибка загрузки файла'})
    

@api_view()
@permission_classes([IsAuthenticated])
@authentication_classes([JWTAuthentication])
def user(request: Request):
    return Response({
        'data': UserSerializer(request.user).data
    })
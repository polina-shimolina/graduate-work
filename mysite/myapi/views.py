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
from rest_framework.authentication import SessionAuthentication
from rest_framework.authtoken.models import Token
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
    

@api_view(['POST'])
@permission_classes([AllowAny])
def login(request: Request):
    serializer = LoginRequestSerializer(data=request.data)
    if serializer.is_valid():
        authenticated_user = authenticate(**serializer.validated_data)
        if authenticated_user is not None:
            login(request, authenticated_user)
            return Response({'status': 'Success'})
        else:
            return Response({'error': 'Invalid credentials'}, status=403)
    else:
        return Response(serializer.errors, status=400)


@api_view()
@permission_classes([IsAuthenticated])
@authentication_classes([SessionAuthentication])
def user(request: Request):
    return Response({
        'data': UserSerializer(request.user).data
    })
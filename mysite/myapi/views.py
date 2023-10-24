from rest_framework import viewsets, permissions
from .serializers import PhotoSerializer, UserSerializer
from .models import Photo
from django.contrib.auth.models import User
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt

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
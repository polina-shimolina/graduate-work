from rest_framework import viewsets, permissions, generics
from .serializers import UploadedFileSerializer, UserSerializer, UserProfileSerializer, TeamSerializer
from .models import UploadedFile, Team, UserProfile
from django.contrib.auth.models import User
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes, authentication_classes, action
from myapi.serializers import UserSerializer, LoginRequestSerializer
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework_simplejwt.authentication import JWTAuthentication
from django.contrib.auth import authenticate, login, logout
from rest_framework.views import APIView, View
from rest_framework.response import Response
from rest_framework.status import HTTP_201_CREATED
from rest_framework.generics import RetrieveUpdateAPIView


class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.AllowAny]  # Разрешите доступ всем
    

class FileUploadView(APIView):
    def post(self, request):
        file_obj = request.data.get('file')
        if not file_obj:
            return Response({'error': 'Файл не был загружен'}, status=400)
        
        uploaded_file = UploadedFile(file=file_obj)
        uploaded_file.save()

        serializer = UploadedFileSerializer(uploaded_file)

        return Response({'message': 'Файл успешно загружен'})
    

@api_view(['GET', 'PUT'])
@permission_classes([IsAuthenticated])
@authentication_classes([JWTAuthentication])
def user(request):
    if request.method == 'GET':
        return Response({
            'data': UserSerializer(request.user).data
        })
    elif request.method == 'PUT':
        user = User.objects.get(id=request.user.id)
        serializer = UserSerializer(user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
def register_user(request):
    username = request.data.get('username')
    password = request.data.get('password')
    if not username or not password:
        return Response({'error': 'Username and password are required'}, status=status.HTTP_400_BAD_REQUEST)

    try:
        user = User.objects.create_user(username=username, password=password)
        return Response({'message': 'User registered successfully'}, status=status.HTTP_201_CREATED)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
    


class UpdateUserView(APIView):
    def put(self, request):
        user = User.objects.get(id=request.user.id)
        serializer = UserSerializer(user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
@api_view(['GET'])
def get_team(request):
    teams = Team.objects.all()
    serializer = TeamSerializer(teams, many=True)
    return Response(serializer.data)


class UserDetail(RetrieveUpdateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer

class UserTeamView(View):
    def get(self, request, user_id):
        try:
            user_profile = UserProfile.objects.select_related('team').get(user_id=user_id)
            team_data = {
                'user_id': user_id,
                'team_name': user_profile.team.teamname,
                'team_description': user_profile.team.description,
                'team_created_at': user_profile.team.created_at,
                'team_creator': user_profile.team.creator.username,
            }
            return JsonResponse(team_data)
        except UserProfile.DoesNotExist:
            return JsonResponse({'error': 'User profile not found'}, status=404)
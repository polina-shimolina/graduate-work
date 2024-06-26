from rest_framework import viewsets, permissions, generics
from .serializers import UploadedPhotoSerializer, UserSerializer, UserProfileSerializer, TeamSerializer, SegmentedPhotoSerializer, UserPhotoSerializer
from .models import UploadedPhoto, Team, UserProfile, UserPhoto
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
from rest_framework.generics import RetrieveUpdateAPIView
import json
import logging

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.AllowAny]  # Разрешите доступ всем
    

class UploadPhotoView(APIView):
    def post(self, request):
        logger = logging.getLogger(__name__)
        logger.info("Starting post method")
        serializer = UploadedPhotoSerializer(data=request.data)
        logger.info("Checking if serializer is valid")
        if not serializer.is_valid():
            errors = serializer.errors
            logger.info("Errors: %s", errors) 
        if serializer.is_valid():
            logger.info("Serializer is valid")
            uploaded_photo = serializer.save()
            logger.info("Uploaded photo saved")
            user = request.user
            logger.info("User retrieved")
            user_photo = UserPhoto.objects.create(uploaded_photo=uploaded_photo, user=user)
            logger.info("User photo created")
            # Временно присваиваем segmented_photo ссылку на uploaded_photo
            user_photo.segmented_photo = uploaded_photo
            user_photo.save()
            logger.info("User photo saved")
            logger.info("Returning response with status 201 Created")
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            logger.error("Serializer is not valid")
            logger.error(serializer.errors)
            logger.error("Returning response with status 400 Bad Request")
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    

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


class RegisterUser(APIView):
    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')
        first_name = request.data.get('first_name')
        last_name = request.data.get('last_name')
        email = request.data.get('email')
        if not username or not password:
            return Response({'error': 'Username and password are required'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            user = User.objects.create_user(username=username, password=password, first_name=first_name, last_name=last_name, email=email)            
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


        


class UserProfileView(View):
    def get(self, request, username):
        try:
            user = User.objects.get(username=username)
            user_data = {
                'id': user.id,
                'username': user.username,
                'email': user.email,
                'first_name': user.first_name,
                'last_name': user.last_name,
            }
            return JsonResponse(user_data)
        except User.DoesNotExist:
            return JsonResponse({'error': 'User not found'}, status=404)
        
    
class UserTeamView(View):
    def get(self, request, user_id):
        try:
            user_profile = UserProfile.objects.select_related('team').get(user_id=user_id)
            team_data = {
                'user_id': user_id,
                'team_id': user_profile.team.id,
                'team_name': user_profile.team.teamname,
                'team_description': user_profile.team.description,
                'team_created_at': user_profile.team.created_at,
                'team_creator': user_profile.team.creator.username,
            }
            return JsonResponse(team_data)
        except UserProfile.DoesNotExist:
            return JsonResponse({'error': 'User profile not found'}, status=404)
    
    def post(self, request, user_id):
        try:
            team_id = json.loads(request.body).get('team_id')  # Извлечение данных из тела запроса
            team = Team.objects.get(id=team_id)
            user_profile, created = UserProfile.objects.get_or_create(user_id=user_id, defaults={'team': team})
            if not created:
                user_profile.team = team
                user_profile.save()
            return JsonResponse({'message': 'Team assigned successfully'})
        except Team.DoesNotExist:
            return JsonResponse({'error': 'Team not found'}, status=404)
        
    def put(self, request, user_id):
        try:
            user_profile = UserProfile.objects.get(user_id=user_id)
            data = json.loads(request.body)
            team_id = data.get('team_id')
            team = Team.objects.get(id=team_id)

            user_profile.team = team
            user_profile.save()
            
            return JsonResponse({'message': f'Team assigned to user {user_id}'})
        except UserProfile.DoesNotExist:
            return JsonResponse({'error': 'UserProfile not found'}, status=404)
        except Team.DoesNotExist:
            return JsonResponse({'error': 'Team not found'}, status=404)
    
    def delete(self, request, user_id):
        try:
            user_profile = UserProfile.objects.get(user_id=user_id)
            user_profile.team = None
            user_profile.save()
            
            return JsonResponse({'message': f'User {user_id} removed from team'})
        except UserProfile.DoesNotExist:
            return JsonResponse({'error': 'UserProfile not found'}, status=404)

class TeamUsersView(View):
    def get(self, request, team_id):
        try:
            users = UserProfile.objects.filter(team_id=team_id).values('user_id', 'user__username', 'user__email')
            users_list = list(users)
            return JsonResponse(users_list, safe=False)
        except UserProfile.DoesNotExist:
            return JsonResponse({'error': 'Team not found'}, status=404)
        


class TeamView(APIView):
    def post(self, request):
        serializer = TeamSerializer(data=request.data)
        if serializer.is_valid():
            teamname = serializer.validated_data.get('teamname')
            description = serializer.validated_data.get('description')
            created_at = serializer.validated_data.get('created_at')
            creator = serializer.validated_data.get('creator')

            # Создание команды в базе данных
            team = Team.objects.create(teamname=teamname, description=description, created_at=created_at, creator=creator)

            return Response({'message': 'Команда успешно создана', 'team_id': team.id}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def get(self, request):
        teams = Team.objects.all()
        serializer = TeamSerializer(teams, many=True)
        return Response(serializer.data)
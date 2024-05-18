from rest_framework import viewsets, permissions, generics
from .serializers import UploadedPhotoSerializer, UserSerializer, UserProfileSerializer, TeamSerializer, SegmentedPhotoSerializer, UserPhotoSerializer, TeamPhotoSerializer, CommentSerializer
from .models import UploadedPhoto, Team, UserProfile, UserPhoto, TeamPhoto, Comment, SegmentedPhoto
from django.contrib.auth.models import User
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes, authentication_classes, action
from myapi.serializers import UserSerializer, LoginRequestSerializer, CommentCreateSerializer
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework_simplejwt.authentication import JWTAuthentication
from django.contrib.auth import authenticate, login, logout
from rest_framework.views import APIView, View
from rest_framework.response import Response
from rest_framework.generics import RetrieveUpdateAPIView
import json
import logging
from django.shortcuts import get_object_or_404
from django.core.files.base import ContentFile

from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi
from rest_framework.parsers import MultiPartParser, FormParser

from django.http import JsonResponse
from django.views.decorators.http import require_http_methods 
from django.views.decorators.csrf import csrf_exempt
from django.db import IntegrityError

import numpy as np
import pandas as pd
import matplotlib.pyplot as plt

from sklearn.model_selection import train_test_split

import torch
import torch.nn as nn
from torch.utils.data import Dataset, DataLoader
from torchvision import transforms as T
import torchvision
import torch.nn.functional as F
from torch.autograd import Variable
from torchviz import make_dot

from PIL import Image
import cv2

import time
import os
from tqdm.notebook import tqdm

from torchsummary import summary
import segmentation_models_pytorch as smp

from django.core.files.base import ContentFile
import numpy as np
import io

from ml_model.predict import predict

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.AllowAny]  # Разрешите доступ всем
    

@permission_classes([IsAuthenticated])
@authentication_classes([JWTAuthentication])
class UploadPhotoView(APIView):
    parser_classes = [MultiPartParser, FormParser]

    @swagger_auto_schema(
        manual_parameters=[
            openapi.Parameter(
                name='photo',
                in_=openapi.IN_FORM,
                description='Upload a photo',
                type=openapi.TYPE_FILE,
                required=True,
            )
        ],
        responses={200: UploadedPhotoSerializer(many=False)}
    )
    def post(self, request, *args, **kwargs):
        logger = logging.getLogger(__name__)
        logger.info("Starting post method")
        serializer = UploadedPhotoSerializer(data=request.data)
        if serializer.is_valid():
            logger.info("Serializer is valid")
            uploaded_photo = serializer.save()
            logger.info("Uploaded photo saved")
            user = request.user
            logger.info("User retrieved")
            segmented_photo = SegmentedPhoto()
            transformed_image = predict(uploaded_photo.photo.path)

            image_pil = Image.fromarray(np.uint8(transformed_image))
            temp_buffer = io.BytesIO()
            image_pil.save(temp_buffer, format='PNG')

            segmented_photo.photo.save('segmented_image.jpg', ContentFile(temp_buffer.getvalue()), save=False)
            segmented_photo.save()
            logger.info("Segmented photo created and saved")

            user_photo = UserPhoto.objects.create(uploaded_photo=uploaded_photo, segmented_photo=segmented_photo, user=user)
            logger.info("User photo created and saved")
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            logger.error("Serializer is not valid")
            logger.error(serializer.errors)
            logger.error("Returning response with status 400 Bad Request")
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class UserPhotoView(APIView):
    def get(self, request, user_id):
        user_photos = UserPhoto.objects.filter(user_id=user_id)
        serialized_data = []
        for user_photo in user_photos:
            user_data = UserSerializer(user_photo.user).data
            serialized_data.append({
                'id': user_photo.id,
                'uploaded_photo': user_photo.uploaded_photo.photo.url,
                'segmented_photo': user_photo.segmented_photo.photo.url,  # Получаем URL изображения
                'user': user_data,
                'is_visible_to_team': user_photo.is_visible_to_team,
            })
        return Response(serialized_data)
    

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
        

class UserPhotoDetail(APIView):
    def get(self, request, photo_id):
        userphoto = UserPhoto.objects.get(id=photo_id)
        serializer = UserPhotoSerializer(userphoto)
        return Response(serializer.data)
    
class UserTeamView(View):
    def get(self, request, user_id):
        try:
            user_profile = UserProfile.objects.select_related('team').get(user_id=user_id)
            if user_profile.team is not None:
                team_data = {
                    'user_id': user_id,
                    'team_id': user_profile.team.id,
                    'team_name': user_profile.team.teamname,
                    'team_description': user_profile.team.description,
                    'team_created_at': user_profile.team.created_at,
                    'team_creator': user_profile.team.creator.username,
                }
            else:
                team_data = {
                    'user_id': user_id,
                    'team_id': None,
                    'team_name': None,
                    'team_description': None,
                    'team_created_at': None,
                    'team_creator': None,
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
    
@require_http_methods(["POST"]) 
@csrf_exempt
def update_team_photo(request, photo_id, team_id, checked):
    print("===============================")
    print(f"Request Method: {request.method}")
    print(f"Photo ID: {photo_id}")
    print(f"Team ID: {team_id}")
    print(f"Checked: {checked}")
    print("===============================")
    
    checked = checked.lower() == 'true'

    try:
        team = Team.objects.get(id=team_id)
        segmented_photo = SegmentedPhoto.objects.get(id=photo_id)
        
        # Если у segmented_photo уже есть uploaded_photo, используй его
        if hasattr(segmented_photo, 'userphoto'):
            user_photo = segmented_photo.userphoto
            uploaded_photo = segmented_photo.userphoto.uploaded_photo
        else:
            # Или создай новое uploaded_photo, если это необходимо
            uploaded_photo = UploadedPhoto.objects.create(photo=segmented_photo.photo)  # Пример создания нового объекта
            user_photo = UserPhoto.objects.create(uploaded_photo=uploaded_photo, segmented_photo=segmented_photo, user=request.user)

        team_photo, created = TeamPhoto.objects.get_or_create(
            user_photo=user_photo,
            team=team,
            defaults={
                'owner': team.creator,
            }
        )
        
        if created:
            print("Created a new TeamPhoto")
        else:
            print("Found an existing TeamPhoto")
        
        if checked:
            user_photo.is_visible_to_team = True
            user_photo.save()
            team_photo.save()
        else:
            user_photo.is_visible_to_team = False
            user_photo.save()
            team_photo.delete()

        return JsonResponse({'message': 'Team photo updated successfully'})
    
    except Team.DoesNotExist:
        print("Team not found")
        return JsonResponse({'error': 'Team not found'}, status=404)
    except SegmentedPhoto.DoesNotExist:
        print("Segmented Photo not found")
        return JsonResponse({'error': 'Segmented Photo not found'}, status=404)
    except IntegrityError as e:
        print(f"Integrity error: {e}")
        return JsonResponse({'error': 'Failed to create or update the team photo'}, status=500)
    except Exception as e:
        print(f"Unhandled error: {e}")
        return JsonResponse({'error': 'An error occurred'}, status=500)


class TeamPhotosAPIView(APIView):
    def get(self, request, team_id):
        team_photos = TeamPhoto.objects.filter(team_id=team_id)
        serializer = TeamPhotoSerializer(team_photos, many=True)
        return Response(serializer.data)
    
class CommentViewSet(viewsets.ModelViewSet):
    serializer_class = CommentSerializer

    def list(self, request, teamphoto_id=None):
        comments = Comment.objects.filter(team_photo=teamphoto_id)
        serializer = CommentSerializer(comments, many=True)
        return Response(serializer.data)

    def create(self, request, teamphoto_id=None):
        team_photo = TeamPhoto.objects.get(pk=teamphoto_id)
        request.data['team_photo'] = team_photo.id  # Заменяем ID на объект TeamPhoto
        serializer = CommentCreateSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

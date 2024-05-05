"""
URL configuration for mysite project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from rest_framework import permissions
from drf_yasg.views import get_schema_view
from drf_yasg import openapi

from django.contrib import admin
from django.urls import path, include
from myapi import views
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

schema_view = get_schema_view(
    openapi.Info(
    title="Сервис сегментации изображений",
    default_version='v1',
    description="API для сервиса сегментации объектов на изображении",
    terms_of_service="https://www.example.com/policies/terms/",
    contact=openapi.Contact(email="shimolinapk@gamil.com.com"),
    license=openapi.License(name="Лицензия BSD"),
),
    public=True,
    permission_classes=(permissions.AllowAny,),
)

urlpatterns = [
    path("admin/", admin.site.urls),
    path('', include('myapi.urls')),
    path('api/user/', views.user, name='user'),
    path('api/user/<str:username>', views.UserProfileView.as_view(), name='user_profile'),
    path('api/user/<int:pk>/', views.UserDetail.as_view(), name='author-detail'),
    path('api/user/<int:user_id>/team/', views.UserTeamView.as_view(), name='user_team'),
    path('api/user/login', views.user, name='login'),
    path('api/user/register/', views.RegisterUser.as_view(), name='register'),
    path('api/token/obtain', TokenObtainPairView.as_view(), name='token_obtain'),
    path('api/token/refresh', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/photo/upload/', views.UploadPhotoView.as_view(), name='file-upload'),
    path('api/team/', views.TeamView.as_view(), name='team-create'),
    path('api/team/<int:team_id>/users/', views.TeamUsersView.as_view(), name='team_users'),
    path('swagger/', schema_view.with_ui('swagger', cache_timeout=0), name='schema-swagger-ui'),
]
 
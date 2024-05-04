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
from django.contrib import admin
from django.urls import path, include
from myapi import views
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

urlpatterns = [
    path("admin/", admin.site.urls),
    path('', include('myapi.urls')),
    path('api/user/', views.user, name='user'),
    path('api/user/<int:pk>/', views.UserDetail.as_view(), name='author-detail'),
    path('api/user/<int:user_id>/team', views.UserTeamView.as_view(), name='user_team'),
    path('api/user/login', views.user, name='login'),
    path('api/user/register', views.register_user, name='register'),
    path('api/token/obtain', TokenObtainPairView.as_view(), name='token_obtain'),
    path('api/token/refresh', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/upload/', views.FileUploadView.as_view(), name='file-upload'),
    path('api/team/', views.get_team),
]
 
from django.urls import include, path
from rest_framework import routers
from . import views
from django.contrib.auth import views as auth_views

router = routers.DefaultRouter()
router.register(r'photos', views.PhotoViewSet)
router.register(r'users', views.UserViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('api-auth/', include('rest_framework.urls', namespace='rest_framework')),
    path('login/', auth_views.LoginView.as_view(), name='login'),
]
from django.urls import path, include
from django.shortcuts import render
from django.contrib.auth import views as auth_views
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from . import views

from .views import AccountInfoList, DetailInfo, LoginView
from .views import ChatAPIView

# from .views import CustomTokenObtainPairView

app_name = 'user'
urlpatterns = [
    # path('', views.user_info),
    path('api/join', views.AccountInfoList.as_view()),
    
    # path('join/', views.join, name='join'),
    
    # path('detail/<id>/', views.detail_info),
    path('api/<int:pk>', views.DetailInfo.as_view()),
    
    # path('login/', views.login, name='login'),
    path('api/login', views.LoginView.as_view(), name='api_login'),
    
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),

    path('api/chat/',ChatAPIView.as_view(), name='chatinit'),
    path('api/chat/<str:account_id>',ChatAPIView.as_view(), name='chatinit'),

]
    
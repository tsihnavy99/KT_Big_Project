from django.urls import path, include
from . import views
from django.shortcuts import render


app_name = 'userpill'
urlpatterns = [
    path('', views.userpill_updata, name='userpill_updata'),
    path('api/userpill', views.user_eat_pill2, name='user_eat_pill2'),
    path('api/userpilljoin', views.UserPillList.as_view(), name='UserPillList'),
]

from django.urls import path, include
from . import views
from django.shortcuts import render


app_name = 'qna'
urlpatterns = [
    path('', views.qna_home, name='home'),
    path('qna_list/', views.qna_list, name='qna_list'),
    path('qna_create/',  views.QnaCreate.as_view(), name='qna_create'),
    path('qna_detail/', views.qna_detail, name='qna_detail'),
    # path('qna_update/', views.qna_update, name='qna_update'),
    # path('qna_answer_update/', views.QnaUpdate.as_view(), name='qna_answer_update'),
    path('qna_answer_update/<int:pk>/', views.QnaUpdate.as_view(), name='qna_answer_update'),
    path('qna_delete/<int:pk>/', views.qna_delete, name='qna_delete'),
    # path('qna_user_detail/', views.qna_user_detail, name='qna_user_detail'),
]

from django.urls import path, include
from django.shortcuts import render

from . import views



app_name = 'pillinfo'
urlpatterns = [
    path('', views.pillinfo_main, name='pillinfo_main'),
    path('pillinfo/', views.pillinfo, name='pillinfo'),
    path('prescription_upload/', views.prescription_upload, name='prescription_upload'),
    path('pill_upload/', views.upload_image, name='pill_upload'),
    path('api/pill_upload/', views.PillUploadView.as_view(), name='api-pill-upload'),
    path('api/pill_name_upload/', views.PillUploadNameView.as_view(), name='api-pill-name-upload'),
    path('api/PillInfoView/', views.PillInfoView.as_view(), name='api-Pill-InfoView'),
    path('api/PillInfoView_inter/', views.PillInfoView_inter.as_view(), name='api-Pill-InfoView-inter'),
    path('api/PillInfoView_inter_full/', views.PillInfoView_inter_full.as_view(), name='api-Pill-InfoView-inter-full'),
]
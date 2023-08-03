# from django.urls import path, include
# from django.shortcuts import render

# from . import views


# app_name = 'prescription'
# urlpatterns = [
#     # path('', views.prescription_main, name='prescription_main'),
#     path('', views.prescription_upload, name='prescription_upload'),
# ]

from django.urls import path, include
from django.shortcuts import render
from . import views

app_name = 'prescription'
urlpatterns = [
    path('api/prescription_ocr/', views.PrescriptionOcrView.as_view(), name = 'api-prescription_upload'),
]


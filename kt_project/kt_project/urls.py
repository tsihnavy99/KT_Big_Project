from django.contrib import admin
from django.urls import path, include
from . import views
from django.shortcuts import render
from django.conf.urls.static import static
from django.conf import settings

app_name = 'main'
urlpatterns = [
    path('admin/', admin.site.urls),
    path('', views.test, name='main'),
    path('user/', include('userinformation.urls')),
    path('qna/', include('qna.urls')),
    path('pillinfo/', include('pillinfo.urls')),
    path('prescription/', include('prescription.urls')),
    path('userpill/', include('userpill.urls')),

] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

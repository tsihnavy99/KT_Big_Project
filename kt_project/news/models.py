from django.db import models


# Create your models here.

class news(models.Model):
    disease = models.CharField(max_length=10)
    뉴스 = models.CharField(max_length=300)

from django.db import models

# Create your models here.
class Medications_For_Use_Of(models.Model):
    id = models.CharField(max_length=50, primary_key=True)
    제품명A = models.CharField(max_length=50)
    disease = models.CharField(max_length=100)
    admin = models.CharField(max_length=50)
    성분 = models.CharField(max_length=50)

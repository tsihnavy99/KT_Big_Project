from django.db import models

# Create your models here.
class User_disease_connect(models.Model):
    # id = models.IntegerField()
    user_id = models.CharField(max_length=20)
    disease = models.CharField(max_length=50)
from django.db import models

# Create your models here.
class Detection_record(models.Model):
    admin = models.CharField(max_length=50)
    건수 = models.IntegerField()
    조합 = models.CharField(max_length=50)
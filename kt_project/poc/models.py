from django.db import models

# Create your models here.
class Prohibition_Of_Combination(models.Model):
    제품명A = models.CharField(max_length=50, primary_key=True)
    업체명A = models.CharField(max_length=50)
    성분명A = models.CharField(max_length=100, default='')
    성분코드A = models.CharField(max_length=100, default='')
    제품코드A = models.CharField(max_length=100, default='')
    제품명B = models.CharField(max_length=50)
    업체명B = models.CharField(max_length=50)
    성분명B = models.CharField(max_length=100, default='')
    성분코드B = models.CharField(max_length=100, default='')
    제품코드B = models.CharField(max_length=100, default='')
    상세정보 = models.CharField(max_length=100)
from django.db import models

# Create your models here.
# class qna(models.Model):
#     no = models.AutoField(primary_key=True)
#     user_info = models.CharField(max_length=15)
#     질문 = models.CharField(max_length=100)
#     answer_info = models.CharField(max_length=100, default='익명')
#     답변 = models.CharField(max_length=100, default='')
#     user_img = models.ImageField(null=True, blank=True, upload_to='media/')

class qna(models.Model):
    no = models.AutoField(primary_key=True)
    user_info = models.CharField(max_length=15)
    질문 = models.CharField(max_length=100, blank=True)
    answer = models.CharField(max_length=100, blank=True)
    answer_info = models.CharField(max_length=100, default='익명')
    답변 = models.CharField(max_length=100, default='')
    question = models.CharField(max_length=100, default='')
    user_img = models.ImageField(null=True, blank=True, upload_to='media/')
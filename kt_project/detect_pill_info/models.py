from django.db import models

class e_pill_info(models.Model):
    제품명A = models.CharField(max_length=500)
    품목일련번호 = models.CharField(max_length=500)
    주성분 = models.CharField(max_length=500)
    효능 = models.CharField(max_length=500)
    사용법 = models.CharField(max_length=500)
    사전지식 = models.CharField(max_length=500)
    주의음식= models.CharField(max_length=500)
    이상반응 = models.CharField(max_length=500)
    보관법 = models.CharField(max_length=500)
    사업자번호 = models.CharField(max_length=500)
    url_key = models.CharField(max_length=600)

    def __str__(self):
        return self.제품명A
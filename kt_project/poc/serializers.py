from rest_framework import serializers
from .models import Prohibition_Of_Combination


class PocSerializer(serializers.ModelSerializer):
    class Meta:
        model = Prohibition_Of_Combination
        fields = ['제품명A','업체명A','성분명A','성분코드A','제품코드A','제품명B','업체명B','성분명B','성분코드B','제품코드B','상세정보']
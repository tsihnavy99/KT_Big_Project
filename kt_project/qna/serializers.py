from rest_framework import serializers
from .models import qna
from .validators import validate_file_extension

class QnaSerializer(serializers.ModelSerializer):
    user_img = serializers.ImageField(validators=[validate_file_extension])

    class Meta:
        model = qna
        fields = ['user_info', 'question', 'user_img']



class Qna_A_Serializer(serializers.ModelSerializer):

    class Meta:
        model = qna
        fields = ['no', 'user_info', 'question', 'answer_info', 'answer']
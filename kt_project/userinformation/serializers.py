from django.contrib.auth.hashers import make_password

from rest_framework import serializers
import json
import codecs

# from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

from .models import AccountInfo

#user_info 모델 역직렬화 (JSON -> 모델 인스턴스 생성을 위한 객체)
class AccountInfoSerializer(serializers.ModelSerializer):
    disease = serializers.ListField(child = serializers.CharField())
    class Meta:
        model = AccountInfo
        fields = ['id','user_id','pw','name','gender','phone',
                  'admin','disease','birthdate','has_surgery','dt_created','dt_modified', 'user_pill',
                  'user_specialnote','pharmacy','license_number']

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        # print(f"1representation['disease']: {representation['disease']}")
        representation['disease'] = self.deserialize_array(representation['disease'])

        return representation

    def to_internal_value(self, data):
        #print(f"data['disease']: {data['disease']}")
        data['disease'] = data.get('disease', [])
        return super().to_internal_value(data)

    def serialize_array(self, array):
        return json.dumps(array)

    def deserialize_array(self, array_string):
        try:
            byte_array = [bytes(element, 'utf-8') for element in array_string]
            cleaned_string = b''.join(byte_array)
            return cleaned_string.decode('utf-8')
        except Exception as e:
            print(f'역직렬화 오류: {e}')
            return []
        
#region JWT사용 시리얼라이저
# class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
#     @classmethod
#     def get_token(cls, user):
#         token = super().get_token(user)

#         # 사용자 정의 클레임 추가 예시
#         token['username'] = user.username

#         return token
#endregion

#로그인 시리얼라이저
class LoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField()
    
def serialize_array(arr):
    return json.dumps(arr)

def deserialize_array(string):
    return json.loads(string)
    
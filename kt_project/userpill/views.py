from django.shortcuts import render

# Create your views here.
from . import models
from .serializers import UserPillSerializer
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.generics import ListCreateAPIView
from rest_framework.views import APIView
from rest_framework import generics
# Create your views here.


def userpill_updata(req):
    if req.method == "POST":
        user_id = req.POST.get('user_id')
        pill_name = req.POST.get('pill_name')

        new_info = models.user_pill.objects.create(
            user_id = user_id,
            pill_name = pill_name
        )

    return render(req, 'userpill/userpill.html')



# 프론트에 전달해줄 정보
# 충돌 파악을 위해 해당 아이디를 가진 유저의 알약이름을 리스트로 반환



#####


# API 통신을 위한 함수 변형
@api_view(['POST'])
def userpill_updata2(request):
    serializer = UserPillSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response({'message': '알약 정보가 성공적으로 업데이트되었습니다.'})
    else:
        return Response(serializer.errors, status=400)


@api_view(['POST'])
def user_eat_pill2(request):
    user_id = request.data['user_id'] #request.GET.get('user_id')
    print(user_id)
    pill_names = models.user_pill.objects.filter(user_id=user_id).values_list('pill_name', flat=True)
    pill_names_list = list(pill_names)
    print(pill_names_list)
    return Response({'pill_names': pill_names_list})


class UserPillList(generics.CreateAPIView):
    queryset = models.user_pill.objects.all()
    serializer_class = UserPillSerializer

    def get(self, request, format=None):
        queryset = self.get_queryset()
        serializer = self.serializer_class(queryset, many=True)
        return Response(serializer.data)

    
    # def post(self, request, format=None):
    #     serializer = UserPillSerializer(data=request.data)
    #     if serializer.is_valid():
    #         user_id = serializer.validated_data['user_id']
    #         pill_name = serializer.validated_data['pill_name']
    #         new_info = models.user_pill.objects.create(user_id=user_id, pill_name=pill_name)

    #         return Response({'message': '알약 정보가 성공적으로 업데이트되었습니다.'}, status=201)
        
    #     return Response(serializer.errors, status=400)
    
    
    def post(self, request, format=None):
        serializer = UserPillSerializer(data=request.data)

        if serializer.is_valid():
            user_id = serializer.validated_data['user_id']
            pill_name = serializer.validated_data['pill_name']

            # 장고 모델에서 user_id를 검색하여 이미 존재하는지 확인
            try:
                existing_info = models.user_pill.objects.get(user_id=user_id)
                existing_pill_name = existing_info.pill_name
                updated_pill_name = f"{existing_pill_name}{pill_name}"
                existing_info.pill_name = updated_pill_name
                existing_info.save()

                return Response({'message': '22알약 정보가 성공적으로 업데이트되었습니다.'}, status=201)
            except models.user_pill.DoesNotExist:
                new_info = models.user_pill.objects.create(user_id=user_id, pill_name=pill_name)

                return Response({'message': '알약 정보가 성공적으로 업데이트되었습니다.'}, status=201)

            return Response(serializer.errors, status=400)
    # def post(self, request, format=None):

    #     serializer = UserPillSerializer(data=request.data)

       

    #     if serializer.is_valid():

    #         user_id = serializer.validated_data['user_id']

    #         pill_name = serializer.validated_data['pill_name']

           

    #         # 장고 모델에서 user_id를 검색하여 이미 존재하는지 확인

    #         if models.user_pill.objects.filter(user_id=user_id).exists():

    #             return Response({'message': '해당 user_id는 이미 존재합니다.'}, status=400)

           

    #         new_info = models.user_pill.objects.create(user_id=user_id, pill_name=pill_name)

           

    #         return Response({'message': '알약 정보가 성공적으로 업데이트되었습니다.'}, status=201)

    #     return Response(serializer.errors, status=400)

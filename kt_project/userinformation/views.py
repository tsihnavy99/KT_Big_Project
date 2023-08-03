from django.shortcuts import render, redirect
from django.http import HttpResponse
from django.contrib.auth.hashers import make_password, check_password
from django.contrib.auth import authenticate, login
from django.contrib.sessions.backends.db import SessionStore
from django.contrib.auth import get_user_model
from django.core.exceptions import PermissionDenied

from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from rest_framework.generics import get_object_or_404
from rest_framework.views import APIView
from rest_framework.generics import ListCreateAPIView, RetrieveUpdateDestroyAPIView
from rest_framework import generics, mixins
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib import messages
import logging


from .models import AccountInfo
from .serializers import LoginSerializer
from . import models
from .serializers import AccountInfoSerializer
from .models import CustomUserManager

from django.views.decorators.csrf import csrf_exempt
from django.views import View
from django.utils import timezone
import datetime



# Create your views here.

class ChatAPIView(generics.GenericAPIView, mixins.CreateModelMixin):
    queryset = models.AccountInfo.objects.all()
    serializer_class = AccountInfoSerializer

    # def get_all_account(self, request):
    #     serializer = self.get_serializer(queryset)
    #     return self.success_response(serializer.data)

    # def get(self, request, *args, **kwargs):
    def get(self, request):
        queryset = models.AccountInfo.objects.all()
        serializer = self.get_serializer(queryset, many = True)

        return self.success_response(serializer.data)

    # def get_chat_account(self, request):
    #     try:
    #         user_id = request.session['user_id']
    #         account_ids = [account.user_id for account in models.AccountInfo.objects.all()]
    #     except models.AccountInfo.DoesNotExist:
    #         return self.not_found_response()

    #     # login_user = request.session.get('user_id')
    #     # account_ids = [account_id for account_id in account_ids if account_id != login_user]
    #     account_ids = [account_id for account_id in account_ids if account_id != user_id]

    #     return self.success_response(account_ids)

    def not_found_response(self):
        return self.error_response("Account not found", status=404)

    def success_response(self, data, status=200):
        return self.response(data, status=status)

    def error_response(self, message, status=400):
        return self.response({"message": message}, status=status)

    def response(self, data, status):
        return Response(data, status=status)

# Account 생성     
class AccountInfoList(ListCreateAPIView):
    queryset = models.AccountInfo.objects.all()
    serializer_class = AccountInfoSerializer
    
    def perform_create(self, serializer):
        password = serializer.validated_data['pw']
        hashed_password = make_password(password)
        serializer.save(pw=hashed_password)
    # def perform_create(self, serializer):
    #     password = serializer.validated_data['pw']
    #     # hashed_password = make_password(password)
    #     serializer.save(pw=password)

    def post(self, request, *args, **kwargs):
        action = request.data.get('action')
        print(f'action , {action}')
        if action == 'idcheck':
            return self.check_userId(request)
        else:
            return super().post(request, *args, **kwargs)

    def check_userId(self, request):
        already_used = models.AccountInfo.objects.filter(user_id=request.data.get('user_id', ''))
        print('확인')
        print(already_used)
        if already_used:
            return Response({'message': '이미 존재하는 ID입니다.'}, status=status.HTTP_400_BAD_REQUEST)
        else:
            return Response({'message': '사용할 수 있는 ID입니다.'}, status=status.HTTP_200_OK)



# Account 상세보기, 수정, 삭제
class DetailInfo(RetrieveUpdateDestroyAPIView):
    queryset = models.AccountInfo.objects.all()
    serializer_class = AccountInfoSerializer



#로그인 횟수제한 로그인
class LoginView(generics.GenericAPIView, mixins.CreateModelMixin):
    serializer_class = LoginSerializer
    LOGIN_TRY_LIMIT = 2
    # logger = logging.getLogger(__name__)
    

    def post(self, request, *args, **kwargs):
        #로그인 실패 시 대기시간 : 30초
        LOGIN_RETRY_INTERVAL = datetime.timedelta(seconds = 30.0)
        logger = logging.getLogger(__name__)

        #request에서 user_id를 가져와 로그인 실패 이력 저장 객체 호출
        login_fail = models.LoginFail.objects.filter(user_id = request.POST.get('user_id', ''))

        #로그인 요청이 들어왔을 시, 해당 id 로그인 실패 수와 로그인 시도 가능 횟수 비교. 횟수 초과 시
        if login_fail.exists():
        #로그인 시도 횟수를 초과했을 때
            if login_fail.count() >= self.LOGIN_TRY_LIMIT:
                #현재 시간 - 해당 계정 로그인 시도가 마지막으로 실패한 시간을 저장
                last_fail_time = login_fail.last().timestamp
                now = timezone.now()  
                #time_diff에 로그인 다시 시도까지 남은 시간 저장
                time_diff = now - last_fail_time

                #마지막 로그인 실패 후 지난 시간이 대기시간보다 크다면
                if time_diff.total_seconds() >= LOGIN_RETRY_INTERVAL.total_seconds():
                    #해당 로그인 실패 이력을 삭제.
                    login_fail.delete()
                else:
                    return Response({'message': '로그인 횟수 초과: ' + str(int(float(LOGIN_RETRY_INTERVAL.total_seconds()) - float(time_diff.total_seconds()))) + '초 남음'}, status=status.HTTP_400_BAD_REQUEST)
                
                # return Response({'message': '로그인 횟수 초과: ' + str(self.LOGIN_TRY_LIMIT - login_fail.count()) + '회 남음'}, status=status.HTTP_400_BAD_REQUEST)
                # return Response({'message': '로그인 횟수 초과 : ' + LOGIN_TRY_LIMIT - login_fail.count() '회 남음'}, status=status.TTP_400_BAD_REQUEST)
        
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        username = serializer.validated_data['username']
        password = serializer.validated_data['password']
        
        user = authenticate(request=request, username=username, password=password)
        
        if user is not None:
            login(request, user)
            #로그인에 성공했을 때도 해당 로그인 실패 이력을 삭제
            logger.info('User %s logged in successfully', username)
            login_fail.delete()
            user_id = request.session.get('user_id')
            token = self.generate_jwt_token(user)
            return self.get_response(token,user)
        else:
            #로그인에 실패했고 실패 이력이 없다면 로그인 실패 이력을 생성
            if not login_fail.exists():
                logger.warning('User %s failed to log in', username)
                models.LoginFail.objects.create(user_id=request.POST.get('user_id', ''))
                login_fail = models.LoginFail.objects.filter(user_id=request.POST.get('user_id', ''))


            if login_fail.count() + 1 >= self.LOGIN_TRY_LIMIT:
                # return Response({'message': '로그인 횟수 초과.'}, status=status.HTTP_400_BAD_REQUEST)
                last_fail_time = login_fail.last().timestamp
                now = timezone.now()
                #time_diff에 로그인 다시 시도까지 남은 시간 저장
                time_diff = now - last_fail_time

                #마지막 로그인 실패 후 지난 시간이 대기시간보다 크다면
                if time_diff.total_seconds() >= LOGIN_RETRY_INTERVAL.total_seconds():
                    #해당 로그인 실패 이력을 삭제.
                    login_fail.delete()
                else:
                    return Response({'message': '로그인 횟수 초과: ' + str(int(float(LOGIN_RETRY_INTERVAL.total_seconds()) - float(time_diff.total_seconds()))) + '초 남음'}, status=status.HTTP_400_BAD_REQUEST)

            # raise PermissionDenied({'message':"아이디 또는 비밀번호가 틀렸습니다."})
            customErrorMsg = '아이디 또는 비밀번호가 틀렸습니다 :' + str(self.LOGIN_TRY_LIMIT - login_fail.count()) + '회 남음'
            raise PermissionDenied(customErrorMsg)

    
    # def login(self, request, user):
    #     # 세션에 사용자 정보를 저장
    #     request.session['user'] = user.user_id

    def generate_jwt_token(self, user):
        refresh = RefreshToken.for_user(user)
        token = {
            'refresh': str(refresh),
            'access': str(refresh.access_token),
        }
        return token

    def get_response(self, token, user):
            # 로그인 성공 후 응답 데이터를 구성하고 토큰을 포함시킵니다.
            
            account = models.AccountInfo.objects.get(user_id=user.user_id)
            # serialized_account = AccountInfoSerializer.seialize('json',[account])
            # serializer = self.get_serializer(data=account)
            # serializer.is_valid(raise_exception=True)
            
            serializer = AccountInfoSerializer(account)
            serialized_data = serializer.data
            
            response_data = {
                'message': '로그인되었습니다.',
                'user_id': user.user_id,
                'data' : serialized_data,
            }
            response = Response(response_data)

            # JWT 토큰을 Authorization 헤더에 추가합니다.
            jwt_token = token['access']
            response['Authorization'] = 'Bearer ' + jwt_token

            session = SessionStore()
            session['user_id'] = user.user_id
            session['username'] = user.user_id
            session.save()
            print('세션 확인:'+ session['user_id'])
            response.cookies['sessionid'] = session.session_key
            # response.cookies['sessionid']['httponly'] = True
            return response
    


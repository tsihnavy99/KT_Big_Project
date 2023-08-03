from django.shortcuts import render
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status
from rest_framework.parsers import JSONParser
from . import models
import requests
import json
import xmltodict
from urllib.parse import quote
from django.core.files.storage import FileSystemStorage
from ultralytics import YOLO
from PIL import Image
import logging
import os
import tempfile
import base64
from io import BytesIO
import io

from detect_pill_info.models import e_pill_info
from pill_img_info.models import pill_img_info

from userinformation.models import AccountInfo
from userpill.models import user_pill
from pill_img_info.models import pill_img_info
from detect_pill_info.models import e_pill_info

NUM_OF_ROWS = 100

logging.basicConfig(level=logging.INFO)
model = YOLO('')# 본인이 가지고 있는 모델 위치 (클라우드 서비스시 변경)

API_KEY = '' #공란" # api key와 endpoint

base_url = "http://apis.data.go.kr/1471000/DURPrdlstInfoService02"
endpoint_interaction = "/getUsjntTabooInfoList02"
endpoint_age_restriction = "/getSpcifyAgrdeTabooInfoList2"
endpoint_pregnancy_restriction = "/getPwnmTabooInfoList2"
endpoint_elderly_caution = "/getOdsnAtentInfoList2"


def decode_base64_image(data):
    if 'data:' in data and ';base64,' in data:
        header, data = data.split(';base64,')

    decoded_data = base64.b64decode(data)
    image = BytesIO(decoded_data)

    image = Image.open(image)

    return image

def return_pill_name(image):
    fs = FileSystemStorage()
    filename = fs.save(image.name, image)
    file_path = fs.path(filename)
    results = model(file_path)
    cls_results = results[0].boxes.cls.tolist()
    pills = [results.names[int(index)] for index in cls_results]
    return pills



def get_pill_info(item_name):
    encoded_item_name = quote(item_name)
    url = f"{base_url}{endpoint_interaction}?serviceKey={API_KEY}&numOFRows={NUM_OF_ROWS}&itemName={encoded_item_name}"
    try:
        response = requests.get(url, verify=False)
        response_dict = xmltodict.parse(response.text)

        if 'response' in response_dict and 'body' in response_dict['response'] and 'items' in response_dict['response']['body']:
            items = response_dict['response']['body']['items']['item']
            pill_info = []

            if isinstance(items, list):
                for item in items:
                    info = {
                        'TYPE_NAME': item['TYPE_NAME'],
                        'ITEM_NAME': item['ITEM_NAME'],
                        'MIXTURE_INGR_KOR_NAME': item['MIXTURE_INGR_KOR_NAME'],
                        'INGR_ENG_NAME': item['INGR_ENG_NAME'],
                        'MIXTURE_ITEM_NAME': item['MIXTURE_ITEM_NAME'],
                        'INGR_CODE': item['INGR_CODE'],
                        'PROHBT_CONTENT': item['PROHBT_CONTENT'],
                        'ENTP_NAME': item['ENTP_NAME'],
                    }
                    pill_info.append(info)
            else:
                item = items
                info = {
                    'TYPE_NAME': item['TYPE_NAME'],
                    'ITEM_NAME': item['ITEM_NAME'],
                    'MIXTURE_INGR_KOR_NAME': item['MIXTURE_INGR_KOR_NAME'],
                    'INGR_ENG_NAME': item['INGR_ENG_NAME'],
                    'MIXTURE_ITEM_NAME': item['MIXTURE_ITEM_NAME'],
                    'INGR_CODE': item['INGR_CODE'],
                    'PROHBT_CONTENT': item['PROHBT_CONTENT'],
                    'ENTP_NAME': item['ENTP_NAME'],
                }

                pill_info.append(info)
            return pill_info

    except Exception as e:
        print(f"API 통신 중 에러 발생: {e}")

    return []  # 데이터가 없거나 API 통신 중 예외가 발생한 경우 빈 리스트 반환

def pillinfo(pill_names):

    pill_info_list = []
    
    for pill_name in pill_names:
        pill_info = e_pill_info.objects.filter(제품명A__contains=pill_name)

        if not pill_info:
            pill_info_list.append({})
            continue

        for pill in pill_info:
            pill_info_list.append({
                '제품명A': pill.제품명A,
                '품목일련번호': pill.품목일련번호,
                '주성분': pill.주성분,
                '효능': pill.효능,
                '사용법': pill.사용법,
                '사전지식': pill.사전지식,
                '주의음식': pill.주의음식,
                '이상반응': pill.이상반응,
                '보관법': pill.보관법,
                '사업자번호': pill.사업자번호,
                'url_key': pill.url_key
            })
            
    return pill_info_list

def get_pill_img_info(pill_names):

    pill_img_info_list = []
    
    for pill_name in pill_names:
        pill_info = pill_img_info.objects.filter(dl_name__contains=pill_name)

        if not pill_info:
            pill_img_info_list.append({})
            continue

        for pill_img in pill_info:
            pill_img_info_list.append({
                'item_seq': pill_img.item_seq,
                'dl_name': pill_img.dl_name,
                'img_key': pill_img.img_key,
                'drug_shape': pill_img.drug_shape,
                'print_front': pill_img.print_front,
                'print_back': pill_img.print_back,
                'color_class1': pill_img.color_class1,
                'color_class2': pill_img.color_class2,
            })
            
    return pill_img_info_list


def pillinfo_main(req):
    return render(req, 'pillinfo/pillinfo_main.html')

def prescription_upload(req):
    return render(req, 'pillinfo/prescription_upload.html')


def pill_upload(req):
    return render(req, 'pillinfo/pill_upload.html')

def string_to_ASCII(item):
    return quote(item)

def get_restriction_info(url, item_key):
    response = requests.get(url)
    response_dict = xmltodict.parse(response.text)

    if response_dict['response']['header']['resultCode'] != '00':
        print(f"Error: {response_dict['response']['header']['resultMsg']}")
        return []

    items = response_dict['response']['body'].get('items')

    if not items:
        return []

    items = items['item']

    return [(item.get(item_key), item.get('PROHBT_CONTENT')) for item in items] if isinstance(items, list) else [
        (items.get(item_key), items.get('PROHBT_CONTENT'))]

def check_interaction_info(item_name):
    url = f"{base_url}{endpoint_interaction}?serviceKey={API_KEY}&numOFRows={NUM_OF_ROWS}&itemName={string_to_ASCII(item_name)}"
    return get_restriction_info(url, 'MIXTURE_ITEM_NAME')

def get_age_restriction_info(item_name):
    url = f"{base_url}{endpoint_age_restriction}?serviceKey={API_KEY}&numOFRows={NUM_OF_ROWS}&itemName={string_to_ASCII(item_name)}"
    return get_restriction_info(url, 'ITEM_NAME')

def get_pregnancy_restriction_info(item_name):
    url = f"{base_url}{endpoint_pregnancy_restriction}?serviceKey={API_KEY}&numOFRows={NUM_OF_ROWS}&itemName={string_to_ASCII(item_name)}"
    return get_restriction_info(url, 'ITEM_NAME')

def get_elderly_caution_info(item_name):
    url = f"{base_url}{endpoint_elderly_caution}?serviceKey={API_KEY}&numOFRows={NUM_OF_ROWS}&itemName={string_to_ASCII(item_name)}"
    return get_restriction_info(url, 'ITEM_NAME')

def check_medication(medication, is_pregnant, user_num):
    is_safe_to_take = True
    restriction_issues = []  # 문제가 있는 약물과 이유를 저장할 리스트 생성

    is_elderly = 23 <= int(user_num[:2]) < 60
    is_specific_age = 10 < int(user_num[:2]) <= 23

    if is_pregnant == 'Y':
        logs = get_pregnancy_restriction_info(medication)
        if logs:
            for log in logs:
                restriction_issues.append({'medication': log[0], 'reason': log[1], 'type': '임부금기'})
            is_safe_to_take = False

    if is_elderly:
        logs = get_elderly_caution_info(medication)
        if logs:
            for log in logs:
                restriction_issues.append({'medication': log[0], 'reason': log[1], 'type': '노인주의'})
            is_safe_to_take = False

    if is_specific_age:
        logs = get_age_restriction_info(medication)
        if logs:
            for log in logs:
                restriction_issues.append({'medication': log[0], 'reason': log[1], 'type': '특정 연령주의'})
            is_safe_to_take = False

    return is_safe_to_take, restriction_issues  # 문제 여부와 문제 정보를 모두 반환


def upload_image(request):
    context = {}
    current_medication = []

    if request.method == 'POST':
        if 'pill_image' not in request.FILES:
            # context에 error message 추가하고 template을 반환
            context['error_message'] = '알약 이미지를 선택해주세요.'
            return render(request, 'pillinfo/pill_upload.html', context)

        uploaded_file = request.FILES['pill_image']

        # 임시 파일 생성
        with tempfile.NamedTemporaryFile(delete=False) as temp_file:
            temp_file.write(uploaded_file.read())
            temp_file_path = temp_file.name
        results = model(temp_file_path)
        cls_indices = results[0].boxes.cls.tolist()
        detected_names = [results[0].names[int(index)] for index in cls_indices]
        temp_current_medication = []
        interaction_issues = []

        for pill in detected_names:
            temp_current_medication.append(pill)

        for medication in temp_current_medication + sum(current_medication, []):
            logs = check_interaction_info(medication)

            for log in logs:
                if log[0] in temp_current_medication + sum(current_medication, []):
                    issue = {
                        'medication': log[0],
                        'reason': log[1],
                        'current_medication': medication
                    }
                    interaction_issues.append(issue)

        if interaction_issues:
            context['interaction_issues'] = interaction_issues

        is_safe_to_take, restriction_issues = check_medication(
            temp_current_medication
        )

        if restriction_issues:
            context['restriction_issues'] = restriction_issues

        if is_safe_to_take:
            context['medication_valid'] = True

        context['results'] = detected_names
        context['pill_info'] = interaction_issues

        os.remove(temp_file_path)

    return render(request, 'pillinfo/pill_upload.html', context)

class PillUploadView(APIView):
    parser_classes = (JSONParser, )

    def post(self, request, *args, **kwargs):
        context = {}
        current_medication = []

        if 'pill_image' not in request.data:
            return Response({"error_message": '알약 이미지를 선택해주세요.'}, status=status.HTTP_400_BAD_REQUEST)

        # base64 이미지 데이터 디코딩
        uploaded_image = decode_base64_image(request.data['pill_image'])

        # 이미지를 파일 시스템에 저장하고 경로 얻기
        fs = FileSystemStorage()

        # BytesIO 객체를 만들어 이미지를 저장합니다.
        byte_arr = io.BytesIO()
        uploaded_image.save(byte_arr, format='PNG')

        # BytesIO 객체를 이용해 파일을 저장합니다.
        filename = fs.save('pill_image.png', io.BytesIO(byte_arr.getvalue()))

        file_path = fs.path(filename)
        results = model(file_path)
        cls_indices = results[0].boxes.cls.tolist()
        detected_names = [results[0].names[int(index)] for index in cls_indices]
        temp_current_medication = []
        interaction_issues = []

        for pill in detected_names:
            temp_current_medication.append(pill)

        for medication in temp_current_medication + sum(current_medication, []):
            logs = check_interaction_info(medication)
            for log in logs:
                if log[0] in temp_current_medication + sum(current_medication, []):
                    issue = {
                        'medication': log[0],
                        'reason': log[1],
                        'current_medication': medication
                    }
                    interaction_issues.append(issue)

        context['results'] = detected_names
        pill_info_list = pillinfo(detected_names)
        context['pill_info'] = pill_info_list


        if interaction_issues:
            context['interaction_issues'] = interaction_issues

        is_safe_to_take, restriction_issues = check_medication(
            temp_current_medication
        )

        if restriction_issues:
            # restriction_issues를 type 별로 분류
            restriction_issues_by_type = {}
            for issue in restriction_issues:
                if issue['type'] not in restriction_issues_by_type:
                    restriction_issues_by_type[issue['type']] = []
                restriction_issues_by_type[issue['type']].append(issue)
            
            context['restriction_issues_by_type'] = restriction_issues_by_type

        if is_safe_to_take:
            context['medication_valid'] = True
      
        return Response(context, status=status.HTTP_200_OK)
    
    
class PillUploadNameView(APIView):
    parser_classes = (JSONParser, )

    def post(self, request, *args, **kwargs):
        context = {}
        current_medication = []

        if 'pill_image' not in request.data:
            return Response({"error_message": '알약 이미지를 선택해주세요.'}, status=status.HTTP_400_BAD_REQUEST)

        # base64 이미지 데이터 디코딩
        uploaded_image = decode_base64_image(request.data['pill_image'])

        # 이미지를 파일 시스템에 저장하고 경로 얻기
        fs = FileSystemStorage()

        # BytesIO 객체를 만들어 이미지를 저장합니다.
        byte_arr = io.BytesIO()
        uploaded_image.save(byte_arr, format='PNG')

        # BytesIO 객체를 이용해 파일을 저장합니다.
        filename = fs.save('pill_image.png', io.BytesIO(byte_arr.getvalue()))

        file_path = fs.path(filename)
        results = model(file_path)
        cls_indices = results[0].boxes.cls.tolist()
        detected_names = [results[0].names[int(index)] for index in cls_indices]
        context['results'] = detected_names
        pill_img_info_list = get_pill_img_info(detected_names)
        context['pill_img_info'] = pill_img_info_list
        return Response(context, status=status.HTTP_200_OK)
  
class PillInfoView(APIView):
    parser_classes = (JSONParser, )

    def post(self, request, *args, **kwargs):
        context = {}

        if 'pill_names' not in request.data:
            return Response({"error_message": '알약 이름을 입력해주세요.'}, status=status.HTTP_400_BAD_REQUEST)

        if 'user_id' not in request.data:
            return Response({"error_message": '유저 ID를 입력해주세요.'}, status=status.HTTP_400_BAD_REQUEST)

        pill_names = request.data['pill_names']
        user_id = request.data['user_id']
        all_pill_info = []
        
        

        is_pregnant = 'Y'
        user_num = '970705'

        is_elderly = 23 <= int(user_num[:2]) < 60
        is_specific_age = 10 < int(user_num[:2]) <= 23

        for pill_name in pill_names:
            pill_info = {'pill_name': pill_name}
            logs = check_interaction_info(pill_name)
            interaction_issues = [{'medication': log[0], 'reason': log[1], 'current_medication': pill_name} for log in logs if pill_name in pill_names]
            for issue in interaction_issues:
                if issue['medication'] in pill_names:
                    pill_info['safe_to_take'] = False
                    pill_info['reason'] = f'알약 "{issue["medication"]}"와 {issue["reason"]}로 인해 병용에 주의하세요.'
                    break

            if 'safe_to_take' not in pill_info:
                is_safe_to_take, restriction_issues = check_medication(pill_name, is_pregnant, user_num)
                if restriction_issues:
                    pill_info['safe_to_take'] = False
                    reason_list = []
                    for issue in restriction_issues:
                        if issue['type'] == '임부금기' and is_pregnant:
                            reason_list.append(f'{issue["reason"]}로 인해 임부는 복용에 주의하세요.')
                        elif issue['type'] == '노인주의' and is_elderly:
                            reason_list.append(f'{issue["reason"]}로 인해 노인은 복용에 주의하세요.')
                        elif issue['type'] == '특정 연령주의' and is_specific_age:
                            reason_list.append(f'{issue["reason"]}로 인해 특정 연령은 복용에 주의하세요.')
                    pill_info['reason'] = " ".join(reason_list)
                else:
                    pill_info['safe_to_take'] = True
                    pill_info['reason'] = 'DUR 금기목록에 검색되지 않았습니다.'

            all_pill_info.append(pill_info)

        context['result'] = all_pill_info

        return Response(context, status=status.HTTP_200_OK)

class PillInfoView_inter(APIView):
    parser_classes = (JSONParser, )

    def post(self, request, *args, **kwargs):
        context = {}

        # 알약 이름이 입력되지 않은 경우 에러 메시지 반환
        if 'pill_names' not in request.data:
            return Response({"error_message": '알약 이름을 입력해주세요.'}, status=status.HTTP_400_BAD_REQUEST)

        # 사용자 ID가 입력되지 않은 경우 에러 메시지 반환
        if 'user_id' not in request.data:
            return Response({"error_message": '유저 ID를 입력해주세요.'}, status=status.HTTP_400_BAD_REQUEST)

        # 요청된 알약 이름과 사용자 ID를 각각 pill_names와 user_id에 저장
        pill_names = request.data['pill_names']
        user_id = request.data['user_id']
        
        # 사용자 ID로 계정 정보 가져오기
        user_info = AccountInfo.objects.get(user_id = user_id)
        # 사용자 특이사항 가져오기
        user_specialnote = user_info.user_specialnote
        # 사용자 생년월일 가져오기
        birthdate = user_info.birthdate
        # 사용자가 현재 사용 중인 알약 이름 가져오기
        try:
            active_pill_names = user_pill.objects.get(user_id = user_id).pill_name.rstrip('~').split('~')
        except user_pill.DoesNotExist:
            active_pill_names = []

        # 사용자 특이사항에 '임신'이 포함되어 있다면 임신 여부를 'Y'로 설정
        is_pregnant = 'Y' if '임신' in user_specialnote else 'N'   
        user_num = str(birthdate.year)
        temp = []

        # 노인, 특정 연령대 여부 확인
        is_elderly = 23 <= int(user_num[2:]) < 60
        is_specific_age = 10 < int(user_num[2:]) <= 23

        # 각 알약에 대한 정보 초기화
        all_pill_info = {pill_name: {'pill_name': pill_name, 'safe_to_take': True, 'reason': []} for pill_name in pill_names}

        # 모든 알약 이름에 대해 약물 상호작용 정보 체크
        for pill_name in pill_names + active_pill_names:
            logs = check_interaction_info(pill_name)
            
            interaction_issues = [{'medication': log[0], 'reason': log[1], 'current_medication': pill_name} 
                                for log in logs if log[0] in pill_names + active_pill_names]
            
            # 상호작용 문제가 발생하는 경우 정보 업데이트
            for issue in interaction_issues:
                if issue['medication'] in pill_names:
                    all_pill_info[issue['medication']]['safe_to_take'] = False
                    all_pill_info[issue['medication']]['reason'].append(f'알약 "{issue["current_medication"]}"와 {issue["reason"]}로 인해 병용에 주의하세요.')
                if issue['current_medication'] in pill_names:
                    all_pill_info[issue['current_medication']]['safe_to_take'] = False
                    all_pill_info[issue['current_medication']]['reason'].append(f'알약 "{issue["medication"]}"와 {issue["reason"]}로 인해 병용에 주의하세요.')


        # 각 알약에 대해 복용 제한 확인
        for pill_name in pill_names:
            is_safe_to_take, restriction_issues = check_medication(pill_name, is_pregnant, user_num)
            if restriction_issues:
                all_pill_info[pill_name]['safe_to_take'] = False
                for issue in restriction_issues:
                    if issue['type'] == '임부금기' and is_pregnant:
                        all_pill_info[pill_name]['reason'].append(f'{issue["reason"]}로 인해 임부는 복용에 주의하세요.')
                    if issue['type'] == '노인주의' and is_elderly:
                        all_pill_info[pill_name]['reason'].append(f'{issue["reason"]}로 인해 노인은 복용에 주의하세요.')
                    if issue['type'] == '특정 연령주의' and is_specific_age:
                        all_pill_info[pill_name]['reason'].append(f'{issue["reason"]}로 인해 특정 연령은 복용에 주의하세요.')
            
            # 수정한 코드
            if all_pill_info[pill_name]['reason'] is None or len(all_pill_info[pill_name]['reason']) == 0:
                all_pill_info[pill_name]['reason'].append('DUR 금기목록에 검색되지 않았습니다.')

            all_pill_info[pill_name]['reason'] = list(set(all_pill_info[pill_name]['reason']))


        # 각 알약에 대한 URI 정보 추가
        for pill_name in pill_names:
            try:
                pill_uri = pill_img_info.objects.get(dl_name = pill_name).img_key
            except pill_img_info.DoesNotExist:
                try:
                    pill_uri = e_pill_info.objects.get(제품명A=pill_name).url_key
                except e_pill_info.DoesNotExist:
                    pill_uri = None  # Or any default value you prefer

        
            # URI 정보 추가
            all_pill_info[pill_name]['uri'] = pill_uri

        # 알약 이름이 all_pill_info에 있는 경우만 결과에 추가
        context['result'] = [all_pill_info[pill_name] for pill_name in pill_names if pill_name in all_pill_info]

        return Response(context, status=status.HTTP_200_OK)
    

class PillInfoView_inter_full(APIView):
    parser_classes = (JSONParser, )

    def post(self, request, *args, **kwargs):
        context = {}

        # 사용자 ID가 입력되지 않은 경우 에러 메시지 반환
        if 'user_id' not in request.data:
            return Response({"error_message": '유저 ID를 입력해주세요.'}, status=status.HTTP_400_BAD_REQUEST)

        # 요청된 사용자 ID를 user_id에 저장
        user_id = request.data['user_id']
        
        # 사용자 ID로 계정 정보 가져오기
        user_info = AccountInfo.objects.get(user_id = user_id)
        # 사용자 특이사항 가져오기
        user_specialnote = user_info.user_specialnote
        # 사용자 생년월일 가져오기
        birthdate = user_info.birthdate
        # 사용자가 현재 사용 중인 알약 이름 가져오기
        try:
            active_pill_names = user_pill.objects.get(user_id = user_id).pill_name.rstrip('~').split('~')
        except user_pill.DoesNotExist:
            active_pill_names = []


        # 사용자 특이사항에 '임신'이 포함되어 있다면 임신 여부를 'Y'로 설정
        is_pregnant = 'Y' if '임신' in user_specialnote else 'N'   
        user_num = str(birthdate.year)

        # 노인, 특정 연령대 여부 확인
        is_elderly = 23 <= int(user_num[2:]) < 60
        is_specific_age = 10 < int(user_num[2:]) <= 23

        # 각 알약에 대한 정보 초기화
        all_pill_info = {pill_name: {'pill_name': pill_name, 'safe_to_take': True, 'reason': []} for pill_name in active_pill_names}

        # 모든 알약 이름에 대해 약물 상호작용 정보 체크
        for pill_name in active_pill_names:
            logs = check_interaction_info(pill_name)
            
            interaction_issues = [{'medication': log[0], 'reason': log[1], 'current_medication': pill_name} 
                                for log in logs if log[0] in active_pill_names]
            
            # 상호작용 문제가 발생하는 경우 정보 업데이트
            for issue in interaction_issues:
                if issue['medication'] in active_pill_names:
                    all_pill_info[issue['medication']]['safe_to_take'] = False
                    all_pill_info[issue['medication']]['reason'].append(f'알약 "{issue["current_medication"]}"와 {issue["reason"]}로 인해 병용에 주의하세요.')
                if issue['current_medication'] in active_pill_names:
                    all_pill_info[issue['current_medication']]['safe_to_take'] = False
                    all_pill_info[issue['current_medication']]['reason'].append(f'알약 "{issue["medication"]}"와 {issue["reason"]}로 인해 병용에 주의하세요.') 

        # 각 알약에 대해 복용 제한 확인
        for pill_name in active_pill_names:
            is_safe_to_take, restriction_issues = check_medication(pill_name, is_pregnant, user_num)
            if restriction_issues:
                all_pill_info[pill_name]['safe_to_take'] = False
                for issue in restriction_issues:
                    if issue['type'] == '임부금기' and is_pregnant:
                        all_pill_info[pill_name]['reason'].append(f'{issue["reason"]}로 인해 임부는 복용에 주의하세요.')
                    if issue['type'] == '노인주의' and is_elderly:
                        all_pill_info[pill_name]['reason'].append(f'{issue["reason"]}로 인해 노인은 복용에 주의하세요.')
                    if issue['type'] == '특정 연령주의' and is_specific_age:
                        all_pill_info[pill_name]['reason'].append(f'{issue["reason"]}로 인해 특정 연령은 복용에 주의하세요.')
            
            if not all_pill_info[pill_name]['reason']:
                all_pill_info[pill_name]['reason'].append('DUR 금기목록에 검색되지 않았습니다.')

            all_pill_info[pill_name]['reason'] = list(set(all_pill_info[pill_name]['reason']))

        # 각 알약에 대한 URI 정보 추가
        for pill_name in active_pill_names:
            try:
                pill_uri = pill_img_info.objects.get(dl_name = pill_name).img_key
            except pill_img_info.DoesNotExist:
                try:
                    pill_uri = e_pill_info.objects.get(제품명A=pill_name).url_key
                except e_pill_info.DoesNotExist:
                    pill_uri = None  # Or any default value you prefer

            # URI 정보 추가
            all_pill_info[pill_name]['uri'] = pill_uri

        for pill_name in active_pill_names:
            try:
                pill_use = e_pill_info.objects.get(제품명A=pill_name).사용법
            except e_pill_info.DoesNotExist:
                pill_use = None
            try:
                pill_effect = e_pill_info.objects.get(제품명A=pill_name).효능
            except e_pill_info.DoesNotExist:
                pill_effect = None

            all_pill_info[pill_name]['use'] = pill_use
            all_pill_info[pill_name]['effect'] = pill_effect

        # 알약 이름이 all_pill_info에 있는 경우만 결과에 추가
        context['result'] = [all_pill_info[pill_name] for pill_name in active_pill_names if pill_name in all_pill_info]

        print(context)

        return Response(context, status=status.HTTP_200_OK)








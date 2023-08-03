from django.shortcuts import render
import requests
import json
import uuid, time, base64, re
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status
from rest_framework.parsers import JSONParser
from django.core.files.storage import FileSystemStorage
from io import BytesIO
import io
from PIL import Image
import base64

from pill_img_info.models import pill_img_info

# Create your views here.
def prescription_ocr_api(image_file):
    api_url = 'https://l24svhy8u7.apigw.ntruss.com/custom/v1/23090/00090a886d64d140d4b205c9b4b95b3e8ebc37971d96f127c42076da2785a74c/infer'
    secret_key = 'eGZmc0dobUp5dHl5YU5RTlJRdkVaYWp1T3ZqWXlhSGY='

    with open(image_file, "rb") as f:
        img = base64.b64encode(f.read())

    request_json = {
        'images': [
            {
                'format': 'png',
                'name': 'sample_image',
                'templateIds': ['25154'],
            }
        ],
        'requestId': str(uuid.uuid4()),
        'version': 'V2',
        'timestamp': int(round(time.time() * 1000))
    }

    payload = {'message': json.dumps(request_json).encode('UTF-8')}
    files = [
    ('file', open(image_file, 'rb'))
    ]
    headers = {
    'X-OCR-SECRET': secret_key
    }

    response = requests.request("POST", api_url, headers=headers, data = payload, files = files)

    res = json.loads(response.text.encode('utf8'))

    if res['images'][0]['inferResult'] == 'FAILURE':
        return '처방전 사진을 제대로 인식하지 못했습니다.'
    else:
        text_list = []
        subfields = res['images'][0]["fields"][0]['subFields']
        for i in range(len(subfields)):
            text = subfields[i]['inferText']
            if text.isdecimal():
                continue
            elif re.match('[0-9]', text):
                continue
            elif '연고' in text or '점안액' in text:
                continue
            else:
                text = text.replace('/1정', '').replace('/개', '')
                text_list.append(text)

        return text_list

def decode_base64_image(data):
    if 'data:' in data and ';base64,' in data:
        header, data = data.split(';base64,')

    decoded_data = base64.b64decode(data)
    image = BytesIO(decoded_data)

    image = Image.open(image)

    return image
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

class PrescriptionOcrView(APIView):
    parser_classes = (JSONParser, )    
    
    def post(self, request, *args, **kwargs):
        context = {}

        if 'pill_image' not in request.data:
            return Response({"error_message": '처방전 이미지를 선택해주세요.'}, status=status.HTTP_400_BAD_REQUEST)
            
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
        results = prescription_ocr_api(file_path)
        context['results'] = results
        pill_img_info_list = get_pill_img_info(results)
        context['pill_img_info'] = pill_img_info_list
        return Response(context, status=status.HTTP_200_OK)
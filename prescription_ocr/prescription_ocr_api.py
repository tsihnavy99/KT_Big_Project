import requests, uuid, time, json, base64, re

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
            text = text.replace('/1정', ' ').replace('/개', ' ')
            text_list.append(text)

    return text_list

print(prescription_ocr_api('/content/drive/MyDrive/BigProject/prescription/prescription_test1.jpg'))
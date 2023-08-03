import requests, uuid, time, json

def pill_ocr_api1(image_file):
    api_url = 'https://l24svhy8u7.apigw.ntruss.com/custom/v1/23195/a380fe32aad61020df99248d73959ce5088576a228a983ab073eae6b682a58eb/general'
    secret_key = 'TndMT0x3VG1SeHdUVGlBa09EdHRsT1VXSGdaSHNpbno='

    request_json = {
        'images': [
            {
                'format': 'png',
                'name': 'demo'
            }
        ],
        'requestId': str(uuid.uuid4()),
        'version': 'V2',
        'timestamp': int(round(time.time() * 1000))
    }

    payload = {'message': json.dumps(request_json).encode('UTF-8')}
    img = cv2.imread(image_file)
    img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
    upimg = cv2.pyrUp(img)
    _, encoded_image = cv2.imencode('.png', upimg)
    image_bytes = encoded_image.tobytes()
    files = [('file', io.BytesIO(image_bytes))]
    headers = {
        'X-OCR-SECRET': secret_key
    }

    response = requests.request("POST", api_url, headers=headers, data = payload, files = files)

    res = json.loads(response.text.encode('utf8'))

    result1 = []
    for i in range(len(res['images'][0]["fields"])):
        temp = res['images'][0]["fields"][i]
        dic = {'text': temp['inferText'],
               'confidence': temp['inferConfidence'],
               'boundingbox': []}
        for j in range(4):
            dic['boundingbox'].append([temp['boundingPoly']['vertices'][j]['x'] / 2,
                                    temp['boundingPoly']['vertices'][j]['y'] / 2])
        result1.append(dic)

    return result1


def pill_ocr_api2(image_file):
    api_url = 'https://l24svhy8u7.apigw.ntruss.com/custom/v1/23195/a380fe32aad61020df99248d73959ce5088576a228a983ab073eae6b682a58eb/general'
    secret_key = 'TndMT0x3VG1SeHdUVGlBa09EdHRsT1VXSGdaSHNpbno='

    request_json = {
        'images': [
            {
                'format': 'png',
                'name': 'demo'
            }
        ],
        'requestId': str(uuid.uuid4()),
        'version': 'V2',
        'timestamp': int(round(time.time() * 1000))
    }

    payload = {'message': json.dumps(request_json).encode('UTF-8')}
    img = cv2.imread(image_file)
    img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
    upimg = cv2.pyrUp(img)
    _, encoded_image = cv2.imencode('.png', upimg)
    image_bytes = encoded_image.tobytes()
    files = [('file', io.BytesIO(image_bytes))]
    headers = {
        'X-OCR-SECRET': secret_key
    }

    response = requests.request("POST", api_url, headers=headers, data = payload, files = files)

    res = json.loads(response.text.encode('utf8'))

    result2 = {'text': [], 'confidence': [], 'boundingbox': []}
    for i in range(len(res['images'][0]["fields"])):
        temp = res['images'][0]["fields"][i]
        result2['text'].append(temp['inferText'])
        result2['confidence'].append(temp['inferConfidence'])
        bb = []
        for j in range(4):
            bb.append([temp['boundingPoly']['vertices'][j]['x'] / 2,
                       temp['boundingPoly']['vertices'][j]['y'] / 2])
        result2['boundingbox'].append(bb)

    return result2

print(pill_ocr_api1('/content/drive/MyDrive/BigProject/data/dataset/test/images/synthetic_59.png'))
print(pill_ocr_api2('/content/drive/MyDrive/BigProject/data/dataset/test/images/synthetic_59.png'))
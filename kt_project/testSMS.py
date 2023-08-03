import hmac
import hashlib
import base64
import time
import requests
import json
<<<<<<< HEAD
=======
import random
>>>>>>> main

def make_signature(secret_key, access_key, timestamp, uri):
    secret_key = bytes(secret_key, 'UTF-8')
    method = "POST"
    message = method + " "  + uri + "\n" + timestamp + "\n" + access_key
    message = bytes(message, 'UTF-8')
    signingKey = base64.b64encode(hmac.new(secret_key, message, digestmod=hashlib.sha256).digest())
    return signingKey

<<<<<<< HEAD
access_key = "####"
secret_key = "####"
service_key = "####"
=======
def generate_check_number():
    return ''.join(random.sample('0123456789', 4))

access_key = "##"
secret_key = "##"
service_key = "##"
>>>>>>> main

# <https://api.ncloud-docs.com/docs/ko/ai-application-service-sens-smsv2>
url = "https://sens.apigw.ntruss.com"
uri = f"/sms/v2/services/{service_key}/messages"

timestamp = str(int(time.time() * 1000))

# 받는 상대방
<<<<<<< HEAD
number = "####"

# message 내용
contents = "문자가 잘 가나요??? 왜 안갈까요 화나네요 문자가 간다면 답장 주세요!"
=======
number = "0100000000"

# message 내용
contents = " "
>>>>>>> main

header = {
    "Content-Type": "application/json; charset=utf-8",
    "x-ncp-apigw-timestamp": timestamp,
    "x-ncp-iam-access-key": access_key,
    "x-ncp-apigw-signature-v2": make_signature(secret_key, access_key, timestamp, uri).decode('UTF-8')
}

<<<<<<< HEAD
# from : SMS 인증한 사용자만 가능
data = {
    "type": "SMS",
    "from": "####",
=======
# from: SMS 인증한 사용자만 가능
data = {
    "type": "SMS",
    "from": "0100000000",
>>>>>>> main
    "content": contents,
    "subject": "SENS",
    "messages": [
        {
<<<<<<< HEAD
            "to": number,
            "content": "으아악"
=======
            "to": number
>>>>>>> main
        }
    ]
}

<<<<<<< HEAD
=======
# 랜덤한 체크 번호 생성 후 발송
check_num = generate_check_number()
data["content"] = f"약올사의 회원가입 인증번호는 \n{check_num}입니다."
>>>>>>> main
res = requests.post(url + uri, headers=header, data=json.dumps(data))
datas = json.loads(res.text)
reid = datas['requestId']

print("메시지 전송 상태")
print(res.text + "\n")
<<<<<<< HEAD
=======

# 사용자로부터 체크 번호 입력 요청
user_input = input("체크 번호를 입력하세요: ")

# 입력한 번호가 생성된 체크 번호와 일치하는지 확인
result_ok = 1 if user_input == check_num else 0

print("결과:", result_ok)
>>>>>>> main

# print('test입니다.')
# print('test2입니다.')
# print('test3입니다.')
# print('test5입니다.')
# print('test6입니다.')
# print('aaaaa')
# print('깃 나눴습니다 ')
# print('asdasdasd')
# print('깃 나눴습니다 ')
# print('테스트')
# print('테스트111')
# print('테스트1112222')
# print('wwww')
# # print('테스트1112222')
# print('wwww')
# print('정화님 브런치')
# print('수영님 pull하세요')
# print('박기범의 깃 여행기')
# print('박기범의 깃 여행기 제발 DB야 쫌 올라가줘라~')
# print('박기범의 깃 여행기')
# print('박기범의 깃 여행기 제발 DB야 쫌 올라가줘라~')
# print('박기범의 깃 여행기')
# print('박기범의 깃 여행기 제발 DB야 쫌 올라가줘라~')
# print('박기범의 깃 여행기')
# print('박기범의 깃 여행기 제발 DB야 쫌 올라가줘라~')
# print('이번엔 될까요?')
# print('이번엔 될까요? 체크아웃 박기범이 체크아웃합니다.')
# 살려주새요
# 프론트 되돌리기

import requests
import json
import xmltodict
from urllib.parse import quote

base_url = "http://apis.data.go.kr/1471000/DURIrdntInfoService02"
endpoint = "/getUsjntTabooInfoList01"
service_key = "6%2FBZRxNWs8dwSWMBNFk4YXzxB8tAKqONGDN9Qfqo9AJObQTkju5Efo%2B3P7uj08K59XXfVCGm7sn9iWWDklkHtw%3D%3D"
num_of_rows = 2


ingr_code = 'D000455'
url = f"{base_url}{endpoint}?serviceKey={service_key}&numOfRows={num_of_rows}&ingr_code={ingr_code}"

# itemName = '트리아졸람'
# encoded_item_name = quote(itemName)
# url = f"{base_url}{endpoint}?serviceKey={service_key}&numOfRows={num_of_rows}&itemName={encoded_item_name}"


response = requests.get(url)
response_dict = xmltodict.parse(response.text)
items = response_dict['response']['body']['items']['item']
for item in items:
    print("TYPE_NAME: ", item['TYPE_NAME'])
    print("MIXTURE_INGR_KOR_NAME: ", item['MIXTURE_INGR_KOR_NAME'])
    print("PROHBT_CONTENT: ", item['PROHBT_CONTENT'])
    print("INGR_CODE: ", item['INGR_CODE'])
    print("\n")
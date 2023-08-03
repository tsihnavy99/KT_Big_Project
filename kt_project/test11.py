import json

with open('poc.json', 'r', encoding='utf-8') as f:
    poc = json.load(f)

new_list = []  # 빈 리스트 생성
for animation in poc:
    new_data = {
        "model": "poc.prohibition_of_combination",  # 넣고자 하는 모델의 경로
        "fields": {
            "제품명A": animation.get("제품명A"),  # 필드에 맞는 값 할당
            "업체명A": animation.get("업체명A"),
            "성분명A": animation.get("성분명A", ""),
            "성분코드A": animation.get("성분코드A", ""),
            "제품코드A": animation.get("제품코드A", ""),
            "제품명B": animation.get("제품명B"),
            "업체명B": animation.get("업체명B"),
            "성분명B": animation.get("성분명B", ""),
            "성분코드B": animation.get("성분코드B", ""),
            "제품코드B": animation.get("제품코드B", ""),
            "상세정보": animation.get("상세정보")
        }
    }
    new_list.append(new_data)  # new_list에 전체 데이터를 추가

with open('poc_data.json', 'w', encoding='UTF-8') as f:
    json.dump(new_list, f, ensure_ascii=False, indent=2)  # JSON 파일로 저장

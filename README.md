# 약쏙
### 만성질환 환자를 위한 의약품 오복용 방지 서비스
#### 다제약물 복용자에게 병용금기 정보를 제공하고 약사와 소통창구를 제공해 보다 안전한 의약품 사용을 돕기 위한 서비스

<br>
<hr>

## Service Flow
![image](https://github.com/tsihnavy99/KT_Big_Project/assets/70021587/c761ac3c-516b-413d-b7a5-c1a0e6bdbe17)

<br>

## 메인 서비스
![image](https://github.com/tsihnavy99/KT_Big_Project/assets/70021587/7c17ca98-ecc5-49cd-98b5-75fde71fb9be)

OCR을 통한 처방전 인식: OCR기술을 활용하여 처방전을 스캔하고 인식. 각 회원의 DB에 처방전 정보를 저장하여 중복 및 병용가능 안내 기준으로 사용.<br>
 
ObjectDetection 경구약제 인식: 사용자가 경구약제를 찍으면 처방전을 기반으로 해당 의약품이 중복약제 인지 병용가능한 의약품인지 정보제공.

<br>

## App 부가 기능
일반 사용자
-	로그인 : 일반 사용자의 특징을 통해 맞춤 복약지도 가능
-	1대1 채팅 : 약사와의 상담을 위한 실시간 채팅 기능 
-	게시판 : Q&A 질문 등록
-	뉴스 :  회원가입 시 입력한 사용자의 질환과 관련된 뉴스 제공
  
<br>

약사 계정 사용자
-	게시판 : Q&A 답변 등록
-	1대1 채팅 : 상담을 신청한 일반 사용자와의 실시간 채팅

<br>

## 시연 영상
[시연 영상](https://clipchamp.com/watch/gZ0hZvqGMsC)

<br>
        
## 사용된 API
- 네이버 OCR API
- 복용금지 DUR 항목 API
- 네이버 SENS API
- 네이버 오픈 API(검색-뉴스)

<br><br>
<hr>

# 사용 환경설정
Front-end: React native <br>
Back-end: Django, Firebase <br>
Database: SQLite <br>
형상관리: Git hub, Slack <br>

<br><br>
<hr>

# 추가 수정사항
- Secret Key가 포함된 파일은 제외(문자 인증, Firebase 등) <br>
- lfs 초과로 인해 AI 모델 제외


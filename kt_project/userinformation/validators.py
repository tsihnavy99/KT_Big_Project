import re
from django.core.exceptions import ValidationError

def validate_id_input(value):

    pattern = r'^[a-zA-Z0-9]+$'

    if not re.match(pattern, value):

        raise ValidationError('영문과 숫자만 입력하세요.')
    

def validate_pw_input(value):

    pattern = r'^[a-zA-Z0-9!@#$%^&*()-=_+`~[\]{}\\|;:\'",.<>/?]+$'

    if not re.match(pattern, value):

        raise ValidationError('영문, 숫자, 특수문자만 입력하세요.')
    elif len(value) < 8:
        raise ValidationError('8자 이상의 비밀번호를 입력하세요.')
    
def validate_phone_input(value):
    pattern = r'^[0-9-]+$'
    
    if not re.match(pattern, value):
        raise ValidationError('숫자와 하이픈(-)만 입력하세요.')
    elif len(value)!= 13:
        raise ValidationError('휴대폰 번호 길이가 아닙니다.') 
    
def validate_gender_input(value):
    
    if value not in ['F','M']:
        raise ValidationError('유효하지 않은 성별입니다.')
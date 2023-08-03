from django.db import models
from django.conf import settings
from cryptography.fernet import Fernet

class user_pill(models.Model):
    user_id = models.CharField(max_length=100)
    pill_name = models.CharField(max_length=100)

 
#region userfill 암호화
    # def save(self, *args, **kwargs):
    #     self.pill_name = self.encrypt(self.pill_name)
    #     super().save(*args, **kwargs)

    # def get_pill_name(self):
    #     return self.decrypt(self.pill_name)

    # def encrypt(self, plain_text):
    #     cipher_suite = Fernet(settings.ENCRYPTION_KEY)

    #     if isinstance(plain_text, str):
    #         plain_text = plain_text.encode()

    #     cipher_text = cipher_suite.encrypt(plain_text)  # bytes

    #     return cipher_text.decode()  # str

 

    # def decrypt(self, cipher_text):
    #     cipher_suite = Fernet(settings.ENCRYPTION_KEY)

    #     if isinstance(cipher_text, str):
    #         cipher_text = cipher_text.encode()

    #     plain_text = cipher_suite.decrypt(cipher_text)  # bytes

    #     return plain_text.decode()  # str
#endregion
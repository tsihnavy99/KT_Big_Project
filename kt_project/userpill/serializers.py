from rest_framework import serializers
from .models import user_pill

class UserPillSerializer(serializers.ModelSerializer):
    class Meta:
        model = user_pill
        fields = ('user_id', 'pill_name')

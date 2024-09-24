# serializers.py

from rest_framework import serializers
from .models import Chat
from users.serializers import UserChatSerializer

class GetChatSerializer(serializers.ModelSerializer):
    user = UserChatSerializer()

    class Meta:
        model = Chat
        fields = '__all__'

class ChatSerializer(serializers.ModelSerializer):
    content = serializers.CharField(required=False, allow_blank=True)
    file_url = serializers.URLField(required=False, allow_blank=True)

    class Meta:
        model = Chat
        fields = ['content', 'file_url']

    def validate(self, data):
        content = data.get('content')
        file_url = data.get('file_url')

        if not content and not file_url:
            raise serializers.ValidationError("Cần ít nhất một trong hai trường content hoặc file_url")
        
        return data
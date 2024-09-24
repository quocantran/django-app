# serializers.py

from rest_framework import serializers

class OtpSerializer(serializers.Serializer):
    email = serializers.EmailField()
from rest_framework import serializers
import os

class UploadedFileSerializer(serializers.Serializer):
    fileUpload = serializers.FileField()
    uploaded_at = serializers.DateTimeField(read_only=True)
    
    def validate_fileUpload(self, value):
        valid_extensions = ['.jpg', '.jpeg', '.png', '.webp']
        ext = os.path.splitext(value.name)[1].lower()
        if ext not in valid_extensions:
            raise serializers.ValidationError("Unsupported file extension. Allowed extensions are: jpg, jpeg, png, webp.")
        return value
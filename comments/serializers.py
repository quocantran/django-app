from rest_framework import serializers
from .models import Comment

class CommentCreateSerializer(serializers.ModelSerializer):
    company_id = serializers.CharField(write_only=True, required=True, error_messages={
        'required': 'company_id không được để trống',
        'blank': 'company_id không được để trống'
    })
    parent_id = serializers.CharField(write_only=True, required=False, allow_null=True)

    content = serializers.CharField(write_only=True, required=True, error_messages={
        'required': 'content không được để trống',
        'blank': 'content không được để trống'
    })

    class Meta:
        model = Comment
        fields = ['company_id', 'content', 'parent_id']

    def validate_company_id(self, value):
        if not value.isdigit():
            raise serializers.ValidationError("Invalid company id")
        return value

    def validate_parent_id(self, value):
        if value and not value.isdigit():
            raise serializers.ValidationError("Invalid parent id")
        return value
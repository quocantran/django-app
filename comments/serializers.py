from rest_framework import serializers
from .models import Comment
from users.serializers import UserComment
from companies.serializers import CompanyResumeSerializer

class GetCommentByCompanySerializer(serializers.ModelSerializer):
    user = UserComment()
    company = CompanyResumeSerializer()
    class Meta:
        model = Comment
        fields = '__all__'

class CommentCreateSerializer(serializers.ModelSerializer):
    company_id = serializers.CharField(write_only=True, required=True, error_messages={
        'required': 'company_id không được để trống',
        'blank': 'company_id không được để trống'
    })
    parent_id = serializers.CharField(write_only=True, required=False, allow_null=True)
    content = serializers.CharField(required=True, error_messages={
        'required': 'content không được để trống',
        'blank': 'content không được để trống'
    })

    # Thêm các trường read_only để trả về dữ liệu
    id = serializers.IntegerField(read_only=True)
    user = UserComment(read_only=True)
    company = CompanyResumeSerializer(read_only=True)
    left = serializers.IntegerField(read_only=True)
    right = serializers.IntegerField(read_only=True)
    created_at = serializers.DateTimeField(read_only=True)
    updated_at = serializers.DateTimeField(read_only=True)

    class Meta:
        model = Comment
        fields = '__all__'

    def validate_company_id(self, value):
        if not value.isdigit():
            raise serializers.ValidationError("Invalid company id")
        return value

    def validate_parent_id(self, value):
        if value and not value.isdigit():
            raise serializers.ValidationError("Invalid parent id")
        return value
    
    def validate(self, data):
        company_id = data.get('company_id')
        parent_id = data.get('parent_id')
        if parent_id:
            parent_comment = Comment.objects.filter(id=parent_id).first()
            if not parent_comment:
                raise serializers.ValidationError("Parent comment not found")
        return data
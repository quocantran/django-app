from rest_framework import serializers
from .models import User, Role, Company
from roles.serializers import UserRoleSerializer
from companies.serializers import UserCompanySerializer

class UserChatSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'name']  # Thêm các trường khác nếu cần


class UserCreateSerializer(serializers.ModelSerializer):
    role = UserRoleSerializer()
    company = UserCompanySerializer()
    class Meta:
        model = User
        fields = [
            'id', 'name', 'email', 'password', 'gender', 'address', 'age', 'role', 'company'
        ]
        extra_kwargs = {
            'id': {'read_only': True},
            'password': {'write_only': True},
            'gender': {'required': False, 'allow_null': True},
            'address': {'required': False, 'allow_null': True},
            'age': {'required': False, 'allow_null': True},
            'role': {'required': False, 'allow_null': True},
            'company': {'required': False, 'allow_null': True},
        }

    def create(self, validated_data):
        role_id = validated_data.pop('role', 2)  # Role for normal user
        company_id = validated_data.pop('company', None)
        
        user = User.objects.create_user(
            email=validated_data['email'],
            password=validated_data['password'],
            name=validated_data['name'],
            gender=validated_data.get('gender'),
            address=validated_data.get('address'),
            age=validated_data.get('age')
        )
        
        if role_id:
            user.role_id = role_id
        if company_id:
            user.company_id = company_id
        
        user.save()
        return user


class UserUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'name', 'email', 'gender', 'address', 'age', 'role', 'company']
        extra_kwargs = {
            'id': {'read_only': True},
            'gender': {'required': False, 'allow_null': True},
            'address': {'required': False, 'allow_null': True},
            'age': {'required': False, 'allow_null': True},
            'role': {'required': False, 'allow_null': True},
            'company': {'required': False, 'allow_null': True},
        }
    
    def update(self, instance, validated_data):
        instance.name = validated_data.get('name', instance.name)
        instance.email = validated_data.get('email', instance.email)
        instance.gender = validated_data.get('gender', instance.gender)
        instance.address = validated_data.get('address', instance.address)
        instance.age = validated_data.get('age', instance.age)
        
        role_id = validated_data.get('role')
        if role_id is not None:
            instance.role_id = role_id
        
        company_id = validated_data.get('company')
        if company_id is not None:
            instance.company_id = company_id
        
        instance.save()
        return instance
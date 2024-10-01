from rest_framework import serializers
from .models import Company

class CompanyResumeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Company
        fields = ['id', 'name', 'logo']

class UserCompanySerializer(serializers.ModelSerializer):
    class Meta:
        model = Company
        fields = ['id', 'name']

class CompanyCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Company
        fields = '__all__'
        read_only_fields = ['id', 'created_at', 'updated_at', 'users_followed']

    def create(self, validated_data):
        company = Company.objects.create(
            name=validated_data['name'],
            description=validated_data['description'],
            address=validated_data['address'],

            logo=validated_data.get('logo', None)
        )
        return company

class CompanyJobsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Company
        fields = ['id', 'name','logo']

class CompanyUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Company
        fields = ['id','name', 'description', 'address', 'logo']
        read_only_fields = ['id']

    def update(self, instance, validated_data):
        instance.name = validated_data.get('name', instance.name)
        instance.description = validated_data.get('description', instance.description)
        instance.address = validated_data.get('address', instance.address)
        instance.logo = validated_data.get('logo', instance.logo)
        instance.save()
        return instance
    
class FollowCompanySerializer(serializers.Serializer):
    company = serializers.IntegerField()

    def validate_company(self, value):
        if not Company.objects.filter(id=value).exists():
            raise serializers.ValidationError("Company does not exist.")
        return value
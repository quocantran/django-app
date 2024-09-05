from rest_framework import serializers
from .models import Company

class CompanyCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Company
        fields = ['id','name', 'description', 'address', 'logo']
        read_only_fields = ['id','created_at', 'updated_at', 'id']

    def create(self, validated_data):
        company = Company.objects.create(
            name=validated_data['name'],
            description=validated_data['description'],
            address=validated_data['address'],
            logo=validated_data.get('logo', None)
        )
        return company

class CompanyUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Company
        fields = ['id','name', 'description', 'address', 'logo']
        read_only_fields = ['id','created_at', 'updated_at']

    def update(self, instance, validated_data):
        instance.name = validated_data.get('name', instance.name)
        instance.description = validated_data.get('description', instance.description)
        instance.address = validated_data.get('address', instance.address)
        instance.logo = validated_data.get('logo', instance.logo)
        instance.save()
        return instance
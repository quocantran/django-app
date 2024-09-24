from rest_framework import serializers
from permissions.models import Permission

class RolePermissionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Permission
        fields = '__all__'

class GetPermissionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Permission
        fields = '__all__'

class PermissionSerializer(serializers.ModelSerializer):
    apiPath = serializers.CharField(source='api_path')

    class Meta:
        model = Permission
        fields = ['name', 'apiPath', 'method', 'module']
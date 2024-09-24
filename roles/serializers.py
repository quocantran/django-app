# serializers.py

from rest_framework import serializers
from roles.models import Role
from permissions.models import Permission
from permissions.serializers import RolePermissionSerializer

class UserRoleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Role
        fields = ['id', 'name']

class GetRoleSerializer(serializers.ModelSerializer):
    permissions = RolePermissionSerializer(many=True)
    class Meta:
        model = Role
        fields = '__all__'

class RoleSerializer(serializers.ModelSerializer):
    permissions = serializers.PrimaryKeyRelatedField(queryset=Permission.objects.all(), many=True)

    class Meta:
        model = Role
        fields = ['name', 'description', 'permissions']
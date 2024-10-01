import django_filters
from django_filters import rest_framework as filters
from .models import Permission

class PermissionFilter(filters.FilterSet):
    name = filters.CharFilter(field_name='name', lookup_expr='icontains')
    module = filters.CharFilter(field_name='module', lookup_expr='icontains')
    sort = filters.OrderingFilter(fields=['name', 'created_at'])

    class Meta:
        model = Permission
        fields = ['name', 'created_at', 'module']
import django_filters
from django_filters import rest_framework as filters
from .models import Role

class RoleFilter(filters.FilterSet):
    name = filters.CharFilter(field_name='name', lookup_expr='iregex')
    sort = filters.OrderingFilter(fields=['name', 'created_at', 'updated_at'])

    class Meta:
        model = Role
        fields = ['name']
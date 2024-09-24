import django_filters
from django_filters import rest_framework as filters
from .models import Company

class CompanyFilter(filters.FilterSet):
    name = filters.CharFilter(field_name='name', lookup_expr='icontains')
    created_at = filters.DateFromToRangeFilter()
    sort = filters.OrderingFilter(fields=['name', 'created_at'])

    class Meta:
        model = Company
        fields = ['name', 'created_at']
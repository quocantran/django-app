import django_filters
from django_filters import rest_framework as filters
from .models import Job

class JobFilter(filters.FilterSet):
    name = filters.CharFilter(field_name='name', lookup_expr='iregex')
    location = filters.CharFilter(field_name='location', lookup_expr='icontains')
    created_at = filters.DateFromToRangeFilter()
    sort = filters.OrderingFilter(fields=['name', 'created_at', 'location', 'updated_at'])

    class Meta:
        model = Job
        fields = ['name', 'created_at', 'location']
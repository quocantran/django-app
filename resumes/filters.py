import django_filters
from django_filters import rest_framework as filters
from .models import Resume

class ResumeFilter(filters.FilterSet):
    status = filters.CharFilter(field_name='status', lookup_expr='iregex')
    sort = filters.OrderingFilter(fields=['name', 'created_at', 'location', 'updated_at'])

    class Meta:
        model = Resume
        fields = ['status']
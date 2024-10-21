import django_filters
from django_filters import rest_framework as filters
from .models import User

class UserFilter(filters.FilterSet):
    name = filters.CharFilter(field_name='name', lookup_expr='iregex')

    class Meta:
        model = User
        fields = ['name',]
# urls.py

from django.urls import path
from .views import PermissionView

urlpatterns = [
    path('', PermissionView.as_view(), name='create_get_permission'),
    path('/<int:pk>', PermissionView.as_view(), name='update_delete_permission'),
]
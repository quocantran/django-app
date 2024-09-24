# urls.py

from django.urls import path
from .views import RoleView

urlpatterns = [
    path('', RoleView.as_view(), name='create_get_role'),
    path('/<int:pk>', RoleView.as_view(), name='update_delete_role'),
]
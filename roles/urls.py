# urls.py

from django.urls import path
from .views import RoleView, GetRoleById

urlpatterns = [
    path('', RoleView.as_view(), name='create_get_role'),
    path('/<int:pk>', RoleView.as_view(), name='update_delete_role'),

    path('/get-one/<int:pk>', GetRoleById.as_view(), name='get_role_by_id'),
]
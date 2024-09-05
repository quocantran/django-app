from django.urls import path
from .views import UserView

urlpatterns = [
    path('', UserView.as_view(), name='user_list_create'),
    path('/<int:pk>', UserView.as_view(), name='user_update_delete'),
]
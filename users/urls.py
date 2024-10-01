from django.urls import path
from .views import UserView,ForgotPasswordView,CountUsersView

urlpatterns = [
    path('', UserView.as_view(), name='user_list_create'),
    path('/<int:pk>', UserView.as_view(), name='user_update_delete'),
    path('/password/forgot-password', ForgotPasswordView.as_view(), name='forgot-password'),
    path('/record/count', CountUsersView.as_view(), name='count_users'),
]
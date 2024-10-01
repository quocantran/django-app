from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from .views import CustomTokenObtainPairView, LogoutView, RefreshTokenView, GetAccountView, RegisterView
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import permission_classes

urlpatterns = [
    path('/login', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('/logout', permission_classes([IsAuthenticated])(LogoutView.as_view()), name='logout'),
    path('/refresh', (RefreshTokenView), name='token_refresh'),
    path('/account', permission_classes([IsAuthenticated])(GetAccountView), name='account'),
    path('/register', RegisterView.as_view(), name='register'),
]
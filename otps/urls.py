# urls.py

from django.urls import path
from .views import OtpCreateView

urlpatterns = [
    path('', OtpCreateView.as_view(), name='create-otp'),
]
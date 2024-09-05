from django.urls import path
from .views import FileUploadAPIView

urlpatterns = [
    path('/upload', FileUploadAPIView.as_view(), name='api_file_upload'),
]
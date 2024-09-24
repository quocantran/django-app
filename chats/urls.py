# urls.py

from django.urls import path
from .views import CreateChatView

urlpatterns = [
    path('', CreateChatView.as_view(), name='create-get-chat'),
    path('/<int:pk>', CreateChatView.as_view(), name='delete-chat'),
]
from django.urls import path
from .views import CommentCreateView

urlpatterns = [
    path('', CommentCreateView.as_view(), name='create-comment'),
]
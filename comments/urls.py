from django.urls import path
from .views import CommentCreateView, GetCommentByCompany

urlpatterns = [
    path('', CommentCreateView.as_view(), name='create-comment'),
    path('/by-company/<int:company_id>', GetCommentByCompany.as_view(), name='get-comment-by-company')
]
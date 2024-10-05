from django.urls import path
from .views import CommentCreateView, GetCommentByCompany, GetCommentByParent

urlpatterns = [
    path('', CommentCreateView.as_view(), name='create-comment'),
    path('/<int:id>', CommentCreateView.as_view(), name='delete-comment'),
    path('/by-company/<int:company_id>', GetCommentByCompany.as_view(), name='get-comment-by-company'),
    path('/parent/<int:parent_id>', GetCommentByParent.as_view(), name='get-comment-by-parent')

]
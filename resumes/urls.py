from django.urls import path
from .views import ResumeView, getByUser

urlpatterns = [
    path('', ResumeView.as_view(), name='resume_list_create'),
    path('/<int:pk>', ResumeView.as_view(), name='resume_update_delete'),

    path('/by-user', getByUser.as_view(), name='resume_getByUser'),
]
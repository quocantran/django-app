from django.urls import path
from .views import JobView, GetById

urlpatterns = [
    path('', JobView.as_view(), name='job_list_create'),
    path('/<int:pk>', JobView.as_view(), name='job_update_delete'),

    path('/get-one/<int:pk>', GetById.as_view(), name='job_getById'),
]
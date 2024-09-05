from django.urls import path
from .views import CompanyView, GetById

urlpatterns = [
    path('', CompanyView.as_view(), name='company_list_create'),
    path('/<int:pk>', CompanyView.as_view(), name='company_update_delete'),

    path('/get-one/<int:pk>', GetById.as_view(), name='company_jobs_list_create'),

]
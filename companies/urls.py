from django.urls import path
from .views import CompanyView, GetById, FollowCompanyView, UnfollowCompanyView, CountCompaniesView

urlpatterns = [
    path('', CompanyView.as_view(), name='company_list_create'),
    path('/<int:pk>', CompanyView.as_view(), name='company_update_delete'),

    path('/get-one/<int:pk>', GetById.as_view(), name='company_jobs_list_create'),

    path('/follow', FollowCompanyView.as_view(), name='follow_company'),

    path('/unfollow', UnfollowCompanyView.as_view(), name='unfollow_company'),

    path('/record/count', CountCompaniesView.as_view(), name='count_companies'),

]
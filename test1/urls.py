"""
URL configuration for test1 project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path
import home.views
from django.urls import include
from auths.views import CustomTokenObtainPairView
from rest_framework_simplejwt.views import TokenRefreshView

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', home.views.getHome),
    path('api/v1/auth', include('auths.urls')), 
    path('api/v1/users', include('users.urls')), 
    path('api/v1/files', include('uploads.urls')),
    path('api/v1/companies', include('companies.urls')),
    path('api/v1/jobs', include('jobs.urls')),
    path('api/v1/resumes', include('resumes.urls')),
]

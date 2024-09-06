from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.shortcuts import get_object_or_404
from .serializers import CompanyCreateSerializer, CompanyUpdateSerializer, FollowCompanySerializer
from .models import Company
from users.pagination import CustomPagination

class CompanyView(APIView):
    def get_permissions(self):
        if self.request.method in ['POST', 'PUT', 'PATCH', 'DELETE']:
            return [IsAuthenticated()]
        return [AllowAny()]

    def get(self, request, *args, **kwargs):
        queryset = Company.objects.all()
        paginator = CustomPagination()
        page = paginator.paginate_queryset(queryset, request)
        if page is not None:
            serializer = CompanyCreateSerializer(page, many=True)
            return paginator.get_paginated_response(serializer.data)
        serializer = CompanyCreateSerializer(queryset, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    

    def post(self, request, *args, **kwargs):
        serializer = CompanyCreateSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def patch(self, request, *args, **kwargs):
        company = get_object_or_404(Company, pk=kwargs.get('pk'))
        serializer = CompanyUpdateSerializer(company, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, *args, **kwargs):
        company = get_object_or_404(Company, pk=kwargs.get('pk'))
        company.delete()
        return Response(status=status.HTTP_200_OK)
    
class GetById(APIView):
    def get(self, request, *args, **kwargs):
        company = get_object_or_404(Company, pk=kwargs.get('pk'))
        serializer = CompanyCreateSerializer(company)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
class FollowCompanyView(APIView):
    permission_classes = [IsAuthenticated]
    def post(self, request, *args, **kwargs):
        serializer = FollowCompanySerializer(data=request.data)
        if serializer.is_valid():
            company = get_object_or_404(Company, id=serializer.validated_data['companyId'])
            user = request.user
            if user in company.users_followed.all():
                return Response({"detail": "You are already following this company."}, status=status.HTTP_400_BAD_REQUEST)
            company.users_followed.add(user)
            return Response({"detail": "Company followed successfully."}, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class UnfollowCompanyView(APIView):
    permission_classes = [IsAuthenticated]
    def post(self, request, *args, **kwargs):
        serializer = FollowCompanySerializer(data=request.data)
        if serializer.is_valid():
            company = get_object_or_404(Company, id=serializer.validated_data['companyId'])
            user = request.user
            if user not in company.users_followed.all():
                return Response({"detail": "You are not following this company."}, status=status.HTTP_400_BAD_REQUEST)
            company.users_followed.remove(user)
            return Response({"detail": "Company unfollowed successfully."}, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
# views.py

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import Permission
from .serializers import PermissionSerializer, GetPermissionSerializer
from rest_framework.permissions import IsAuthenticated, AllowAny
from test1.pagination import CustomPagination
from permissions.models import Permission
from django_filters.rest_framework import DjangoFilterBackend, OrderingFilter
from permissions.filters import PermissionFilter

class PermissionView(APIView):

    def get_permissions(self):
            return [IsAuthenticated()]
        
    filter_backends = [DjangoFilterBackend, OrderingFilter]
    filterset_class = PermissionFilter
    ordering_fields = ['name', 'created_at', 'module']
    pagination_class = CustomPagination
    def get(self, request):
        queryset = Permission.objects.all()
        
        # Apply filters
        filter_backend = DjangoFilterBackend()
        queryset = filter_backend.filter_queryset(request, queryset, self)

        # Apply pagination
        paginator = self.pagination_class()
        page = paginator.paginate_queryset(queryset, request)
        if page is not None:
            serializer = GetPermissionSerializer(page, many=True)
            return paginator.get_paginated_response(serializer.data)
        
        serializer = GetPermissionSerializer(queryset, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request):
        serializer = PermissionSerializer(data=request.data)
        method = request.data.get('method')
        api_path = request.data.get('api_path')
       
        if Permission.objects.filter(method=method, api_path=api_path).exists():
            return Response({'Permission already exists!'}, status=status.HTTP_400_BAD_REQUEST)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    def patch(self, request, pk):
        try:
            permission = Permission.objects.get(pk=pk)
            serializer = PermissionSerializer(permission, data=request.data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_200_OK)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except:
            return Response(status=status.HTTP_400_BAD_REQUEST)
    def delete(self, request, pk):
        try:
            permission = Permission.objects.get(pk=pk)
            permission.delete()
            return Response(status=status.HTTP_200_OK)
        except:
            return Response(status=status.HTTP_400_BAD_REQUEST)

       
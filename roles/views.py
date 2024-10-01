# views.py

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import Role, Permission
from .serializers import RoleSerializer,GetRoleSerializer
from roles.models import Role
from permissions.models import Permission
from rest_framework.permissions import IsAuthenticated, AllowAny
from test1.pagination import CustomPagination


class RoleView(APIView):

    def get_permissions(self):
        return [IsAuthenticated()]

    def get(self, request, *args, **kwargs):
        queryset = Role.objects.all()
        paginator = CustomPagination()
        page = paginator.paginate_queryset(queryset, request)
        if page is not None:
            serializer = GetRoleSerializer(page, many=True)
            return paginator.get_paginated_response(serializer.data)
        serializer = GetRoleSerializer(queryset, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request):
        serializer = RoleSerializer(data=request.data)
        if serializer.is_valid():
            permission_ids = request.data.get('permissions', [])
            for perm_id in permission_ids:
                if not Permission.objects.filter(id=perm_id).exists():
                    return Response({'Permission not found!'}, status=status.HTTP_400_BAD_REQUEST)
            
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    def patch(self, request, *args, **kwargs):
        try:

            role = Role.objects.get(id=kwargs.get('pk'))
            serializer = RoleSerializer(role, data=request.data, partial=True)
            if serializer.is_valid():
                permission_ids = request.data.get('permissions', [])
                for perm_id in permission_ids:
                    if not Permission.objects.filter(id=perm_id).exists():
                        return Response({'Permission not found!'}, status=status.HTTP_400_BAD_REQUEST)
                serializer.save()
                return Response(serializer.data, status=status.HTTP_200_OK)
        except:
            return Response({'Role not found!'}, status=status.HTTP_400_BAD_REQUEST)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    def delete(self, request, *args, **kwargs):
        try:

            role = Role.objects.get(id=kwargs.get('pk'))
            role.delete()
            return Response(status=status.HTTP_200_OK)
        except:
            return Response({'Role not found!'}, status=status.HTTP_400_BAD_REQUEST)
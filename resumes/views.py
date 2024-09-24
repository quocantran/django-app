from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.shortcuts import get_object_or_404
from .serializers import CreateResumeSerializer, UpdateResumeStatusSerializer, ResumeSerializer
from .models import Resume
from test1.pagination import CustomPagination

class ResumeView(APIView):
    def get_permissions(self):
        return [IsAuthenticated()]

    def get(self, request, *args, **kwargs):
        queryset = Resume.objects.all()
        paginator = CustomPagination()
        page = paginator.paginate_queryset(queryset, request)
        if page is not None:
            serializer = ResumeSerializer(page, many=True)
            return paginator.get_paginated_response(serializer.data)
        serializer = ResumeSerializer(queryset, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    

    def post(self, request, *args, **kwargs):
        serializer = CreateResumeSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def patch(self, request, *args, **kwargs):
        resume = get_object_or_404(Resume, pk=kwargs.get('pk'))
        serializer = UpdateResumeStatusSerializer(resume, data=request.data, partial=True, context={'request': request})
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, *args, **kwargs):
        company = get_object_or_404(Resume, pk=kwargs.get('pk'))
        company.delete()
        return Response(status=status.HTTP_200_OK)
    
class getByUser(APIView):
    permission_classes = [IsAuthenticated]
    def post(self, request, *args, **kwargs):
        user = request.user
        resume = Resume.objects.filter(user=user)
        serializer = ResumeSerializer(resume, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
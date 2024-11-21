from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.shortcuts import get_object_or_404
from .serializers import CreateResumeSerializer, UpdateResumeStatusSerializer, ResumeSerializer
from .models import Resume
from test1.pagination import CustomPagination
from resumes.filters import ResumeFilter
from django_filters.rest_framework import DjangoFilterBackend, OrderingFilter


class ResumeView(APIView):
    filter_backends = [DjangoFilterBackend, OrderingFilter]
    filterset_class = ResumeFilter
    ordering_fields = ['status', 'created_at', 'updated_at']
    pagination_class = CustomPagination
    def get_permissions(self):
        return [IsAuthenticated()]

    def get(self, request, *args, **kwargs):
        queryset = None
        if request.user.role.name == 'HR':
            queryset = Resume.objects.filter(company=request.user.company)
        filter_backend = DjangoFilterBackend()
        queryset = filter_backend.filter_queryset(request, queryset, self)
        paginator = CustomPagination()
        if(request.query_params.get('sort') == 'updated_at'):
            queryset = queryset.order_by('-updated_at')
        if(request.query_params.get('sort') == 'created_at'):
            queryset = queryset.order_by('-created_at')
        
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
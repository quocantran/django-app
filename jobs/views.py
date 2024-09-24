from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django_filters.rest_framework import DjangoFilterBackend, OrderingFilter
from rest_framework.permissions import IsAuthenticated, AllowAny
from .models import Job
from .serializers import JobListSerializer, JobCreateSerializer, JobUpdateSerializer
from .filters import JobFilter
from django.shortcuts import get_object_or_404
from test1.pagination import CustomPagination

class JobView(APIView):
    filter_backends = [DjangoFilterBackend, OrderingFilter]
    filterset_class = JobFilter
    ordering_fields = ['name', 'created_at', 'location']
    pagination_class = CustomPagination
    def get_permissions(self):
        if self.request.method in ['POST', 'PUT', 'PATCH', 'DELETE']:
            return [IsAuthenticated()]
        return [AllowAny()]

    def get(self, request, *args, **kwargs):
        queryset = Job.objects.all()
        filter_backend = DjangoFilterBackend()
        queryset = filter_backend.filter_queryset(request, queryset, self)
        paginator = CustomPagination()
        page = paginator.paginate_queryset(queryset, request)
        if page is not None:
            serializer = JobListSerializer(page, many=True)
            return paginator.get_paginated_response(serializer.data)
        serializer = JobListSerializer(queryset, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request, *args, **kwargs):
        serializer = JobCreateSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def patch(self, request, *args, **kwargs):
        job = get_object_or_404(Job, pk=kwargs.get('pk'))
        serializer = JobUpdateSerializer(job, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, *args, **kwargs):
        job = get_object_or_404(Job, pk=kwargs.get('pk'))
        job.delete()
        return Response(status=status.HTTP_200_OK)
    
class GetById(APIView):
    def get(self, request, *args, **kwargs):
        company = get_object_or_404(Job, pk=kwargs.get('pk'))
        serializer = JobListSerializer(company)
        return Response(serializer.data, status=status.HTTP_200_OK)
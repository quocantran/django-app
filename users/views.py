from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.shortcuts import get_object_or_404
from .serializers import UserCreateSerializer, UserUpdateSerializer,GetUserSerializer
from .models import User
from test1.pagination import CustomPagination
from otps.views import verify_otp
from django_filters.rest_framework import DjangoFilterBackend, OrderingFilter
from .filters import UserFilter
from django.shortcuts import render

class UserView(APIView):
    filter_backends = [DjangoFilterBackend, OrderingFilter]
    filterset_class = UserFilter
    ordering_fields = ['name']
    pagination_class = CustomPagination
    def get_permissions(self):
            return [IsAuthenticated()]
        
    def get(self, request, *args, **kwargs):
        queryset = User.objects.all()
        filter_backend = DjangoFilterBackend()
        queryset = filter_backend.filter_queryset(request, queryset, self)
        paginator = CustomPagination()
        page = paginator.paginate_queryset(queryset, request)
        if page is not None:
            serializer = GetUserSerializer(page, many=True)
            return paginator.get_paginated_response(serializer.data)
        serializer = GetUserSerializer(queryset, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request, *args, **kwargs):
        serializer = UserCreateSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def patch(self, request, *args, **kwargs):
        user = get_object_or_404(User, pk=kwargs.get('pk'))
        serializer = UserUpdateSerializer(user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, *args, **kwargs):
        user = get_object_or_404(User, pk=kwargs.get('pk'))
        user.delete()
        return Response(status=status.HTTP_200_OK)

class ForgotPasswordView(APIView):
    def get(self, request, *args, **kwargs):
        token = request.query_params.get('token')
        isValid = verify_otp(token)

        if not isValid:
            return Response('Invalid OTP', status=status.HTTP_400_BAD_REQUEST)
        return render(request, 'forgot-password.html')

class CountUsersView(APIView):
    def get(self, request, *args, **kwargs):
        count = User.objects.count()
        return Response(count, status=status.HTTP_200_OK)
    
class ChangePasswordView(APIView):
    def patch(self, request, *args, **kwargs):
        user = request.user
        old_password = request.data.get('password')
        new_password = request.data.get('newPassword')
        repeate_password = request.data.get('repeatedPassword')
        if not user.check_password(old_password):
            return Response('Mật khẩu cũ không chính xác', status=status.HTTP_400_BAD_REQUEST)
        
        if new_password != repeate_password:
            return Response('Mật khẩu mới không khớp', status=status.HTTP_400_BAD_REQUEST)
        
        user.set_password(new_password)
        user.save()
        return Response('Mật khẩu đã được thay đổi', status=status.HTTP_200_OK)
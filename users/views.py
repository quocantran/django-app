from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.shortcuts import get_object_or_404
from .serializers import UserCreateSerializer, UserUpdateSerializer
from .models import User
from test1.pagination import CustomPagination
from otps.views import verify_otp

class UserView(APIView):
    def get_permissions(self):
        if self.request.method in ['POST', 'PUT', 'PATCH', 'DELETE']:
            return [IsAuthenticated()]
        return [AllowAny()]

    def get(self, request, *args, **kwargs):
        queryset = User.objects.all()
        paginator = CustomPagination()
        page = paginator.paginate_queryset(queryset, request)
        if page is not None:
            serializer = UserCreateSerializer(page, many=True)
            return paginator.get_paginated_response(serializer.data)
        serializer = UserCreateSerializer(queryset, many=True)
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
        return Response(status=status.HTTP_204_NO_CONTENT)

class ForgotPasswordView(APIView):
    def get(self, request, *args, **kwargs):
        token = request.query_params.get('token')
        isValid = verify_otp(token)

        if not isValid:
            return Response('Invalid OTP', status=status.HTTP_400_BAD_REQUEST)
        return Response('Mật khẩu mới đã được gửi về email của bạn!', status=status.HTTP_200_OK)
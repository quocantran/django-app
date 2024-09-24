# views.py

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated, AllowAny
from .models import Chat
from .serializers import ChatSerializer
from test1.pagination import CustomPagination
from chats.models import Chat
from chats.serializers import ChatSerializer, GetChatSerializer
from django_filters.rest_framework import DjangoFilterBackend
from django.shortcuts import get_object_or_404


class CreateChatView(APIView):
    def get_permissions(self):
        if self.request.method in ['POST', 'PUT', 'PATCH', 'DELETE']:
            return [IsAuthenticated()]
        return [AllowAny()]

    def get(self, request, *args, **kwargs):
        queryset = Chat.objects.all()
        filter_backend = DjangoFilterBackend()
        queryset = filter_backend.filter_queryset(request, queryset, self)
        paginator = CustomPagination()
        page = paginator.paginate_queryset(queryset, request)
        if page is not None:
            serializer = GetChatSerializer(page, many=True)
            return paginator.get_paginated_response(serializer.data)
        serializer = GetChatSerializer(queryset, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request, *args, **kwargs):
        user = request.user
        data = request.data.copy()
        data['user'] = user.id  # Thêm thông tin người dùng vào dữ liệu

        serializer = ChatSerializer(data=data)
        if serializer.is_valid():
            serializer.save(user=user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    def delete(self, request, *args, **kwargs):
        user = request.user
        
        chat = get_object_or_404(Chat, pk=kwargs.get('pk'))
        if(chat.user.id != user.id):
            return Response(status=status.HTTP_403_FORBIDDEN)
        chat.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
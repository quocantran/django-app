from django.db import models, transaction
from django.shortcuts import get_object_or_404
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import Comment, Company
from .serializers import CommentCreateSerializer
from rest_framework.permissions import IsAuthenticated, AllowAny

class CommentCreateView(APIView):
    def get_permissions(self):
        if self.request.method in ['POST']:
            return [IsAuthenticated()]
        return [AllowAny()]

    def post(self, request, *args, **kwargs):
        serializer = CommentCreateSerializer(data=request.data)
        if serializer.is_valid():
            company_id = serializer.validated_data['company_id']
            content = serializer.validated_data['content']
            parent_id = serializer.validated_data.get('parent_id')
            user = request.user

            company = get_object_or_404(Company, id=company_id)

            with transaction.atomic():
                if parent_id:
                    parent_comment = get_object_or_404(Comment, id=parent_id)
                    right_value = parent_comment.right

                    Comment.objects.filter(
                        company=company,
                        right__gte=right_value
                    ).update(right=models.F('right') + 2)

                    Comment.objects.filter(
                        company=company,
                        left__gt=right_value
                    ).update(left=models.F('left') + 2)
                else:
                    max_right_value = Comment.objects.filter(
                        company=company
                    ).aggregate(max_right=models.Max('right'))['max_right']
                    right_value = max_right_value + 1 if max_right_value else 1

                comment = Comment.objects.create(
                    company=company,
                    content=content,
                    user=user,
                    parent=parent_comment if parent_id else None,
                    left=right_value,
                    right=right_value + 1
                )
                print(comment)
            return Response({"success"}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
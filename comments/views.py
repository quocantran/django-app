from django.db import models, transaction
from django.shortcuts import get_object_or_404
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import Comment, Company
from .serializers import CommentCreateSerializer, GetCommentByCompanySerializer
from rest_framework.permissions import IsAuthenticated, AllowAny
from test1.pagination import CustomPagination
from rest_framework.exceptions import ValidationError, PermissionDenied

class CommentCreateView(APIView):
    def get_permissions(self):
        return [IsAuthenticated()]

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
                    if(parent_comment.company != company):
                        return Response("Parent comment is not belong to this company", status=status.HTTP_400_BAD_REQUEST)
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
                response_serializer = CommentCreateSerializer(comment)
            return Response(response_serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    def delete(self, request, *args, **kwargs):
        comment_id = kwargs.get('id')
        
        # Kiểm tra xem id có hợp lệ hay không
        if not comment_id:
            raise ValidationError('Comment id is required')

        # Lấy comment từ cơ sở dữ liệu
        comment = get_object_or_404(Comment, id=comment_id)

        # Kiểm tra quyền sở hữu comment
        if comment.user != request.user:
            raise PermissionDenied('You are not allowed to delete this comment')

        left_value = comment.left
        right_value = comment.right
        width = right_value - left_value + 1

        with transaction.atomic():
            # Xóa các comment trong khoảng left và right
            Comment.objects.filter(
                company=comment.company,
                left__gte=left_value,
                right__lte=right_value
            ).delete()

            # Cập nhật các giá trị left và right của các comment khác
            Comment.objects.filter(
                company=comment.company,
                left__gt=right_value
            ).update(left=models.F('left') - width)

            Comment.objects.filter(
                company=comment.company,
                right__gt=right_value
            ).update(right=models.F('right') - width)

            response_serializer = CommentCreateSerializer(comment)

        return Response(response_serializer.data,status=status.HTTP_200_OK)

class GetCommentByCompany(APIView):
    def get(self, request, *args, **kwargs):
        company_id = kwargs.get('company_id')
        comments = Comment.objects.filter(company_id=company_id, parent_id=None)
        
        # Kiểm tra query parameter để sắp xếp
        sort = request.query_params.get('sort', '-created_at')
        comments = comments.order_by(sort)
        
        paginator = CustomPagination()
        page = paginator.paginate_queryset(comments, request)
        
        if page is not None:
            serializer = GetCommentByCompanySerializer(page, many=True)
            return paginator.get_paginated_response(serializer.data)
        
        serializer = GetCommentByCompanySerializer(comments, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    

class GetCommentByParent(APIView):
    def get(self, request, *args, **kwargs):
        parent_id = kwargs.get('parent_id')
        comments = Comment.objects.filter(parent_id=parent_id)
        
        # Kiểm tra query parameter để sắp xếp
        sort = request.query_params.get('sort', '-created_at')
        comments = comments.order_by(sort)
        
        paginator = CustomPagination()
        page = paginator.paginate_queryset(comments, request)
        
        if page is not None:
            serializer = GetCommentByCompanySerializer(page, many=True)
            return paginator.get_paginated_response(serializer.data)
        
        serializer = GetCommentByCompanySerializer(comments, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

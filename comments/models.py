from django.db import models
from users.models import User
from companies.models import Company

class Comment(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='comments')
    content = models.TextField()
    company = models.ForeignKey(Company, on_delete=models.CASCADE, related_name='comments')
    left = models.IntegerField(default=0)
    right = models.IntegerField(default=0)
    parent = models.ForeignKey('self', null=True, blank=True, on_delete=models.CASCADE, related_name='replies')
    updated_at = models.DateTimeField(auto_now=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'comments'


    def __str__(self):
        return self.content[:20]  # Trả về 20 ký tự đầu tiên của nội dung bình luận
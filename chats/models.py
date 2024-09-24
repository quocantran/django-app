from django.db import models
from users.models import User  # Giả sử bạn đang sử dụng model User mặc định của Django

class Chat(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='chats')
    content = models.TextField()
    file_url = models.CharField(max_length=200, blank=True, null=True)
    updated_at = models.DateTimeField(auto_now=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'chats'

    def __str__(self):
        return self.content
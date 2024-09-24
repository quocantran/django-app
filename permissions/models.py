# models.py

from django.db import models
from django.utils import timezone

class Permission(models.Model):
    name = models.CharField(max_length=255)
    api_path = models.CharField(max_length=255)
    method = models.CharField(max_length=10)
    module = models.CharField(max_length=255)
    updated_at = models.DateTimeField(auto_now=True)
    created_at = models.DateTimeField(default=timezone.now)

    class Meta:
        db_table = 'permissions'

    def __str__(self):
        return self.name
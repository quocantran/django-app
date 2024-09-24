# models.py

from django.db import models
from django.utils import timezone
from permissions.models import Permission  # Import model Permission

class Role(models.Model):
    name = models.CharField(max_length=255)
    description = models.TextField()
    is_active = models.BooleanField(default=True)
    permissions = models.ManyToManyField(Permission, related_name='roles')
    updated_at = models.DateTimeField(auto_now=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'roles'

    def __str__(self):
        return self.name
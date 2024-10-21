from django.db import models
from django.utils import timezone

class Resume(models.Model):
    email = models.EmailField(max_length=255)
    user = models.ForeignKey('users.User', on_delete=models.CASCADE)
    url = models.TextField()
    status = models.CharField(max_length=50)
    company = models.ForeignKey('companies.Company', on_delete=models.CASCADE, default=None)
    job = models.ForeignKey('jobs.Job', on_delete=models.CASCADE, default=None)
    updated_at = models.DateTimeField(auto_now=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'resumes'

    def __str__(self):
        return self.email
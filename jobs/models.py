from django.db import models
from companies.models import Company

class Job(models.Model):
    name = models.CharField(max_length=255)
    description = models.TextField()
    skills = models.JSONField()
    company = models.ForeignKey(Company, on_delete=models.CASCADE, related_name='jobs')
    salary = models.DecimalField(max_digits=20, decimal_places=0)
    level = models.CharField(max_length=50)
    start_date = models.DateTimeField()
    quantity = models.IntegerField()
    location = models.CharField(max_length=255)
    end_date = models.DateTimeField()
    is_active = models.BooleanField(default=True)
    updated_at = models.DateTimeField(auto_now=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'jobs'
        unique_together = ('name', 'company')

    def __str__(self):
        return self.name
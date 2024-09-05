from django.db import models

class Company(models.Model):
    name = models.CharField(max_length=255, unique=True)
    description = models.TextField()
    address = models.TextField()
    updated_at = models.DateTimeField(auto_now=True)
    users_followed = models.ManyToManyField('users.User', related_name='companies_followed')
    created_at = models.DateTimeField(auto_now_add=True)
    logo = models.TextField(max_length=255, blank=True, null=True)

    class Meta:
        db_table = 'companies'

    def __str__(self):
        return self.name
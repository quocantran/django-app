# Generated by Django 5.1 on 2024-10-19 19:21

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('jobs', '0003_alter_job_salary'),
    ]

    operations = [
        migrations.AlterField(
            model_name='job',
            name='salary',
            field=models.DecimalField(decimal_places=0, max_digits=20),
        ),
    ]

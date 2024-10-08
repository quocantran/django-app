# Generated by Django 5.1 on 2024-10-05 06:48

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('companies', '0001_initial'),
        ('roles', '0001_initial'),
        ('users', '0003_user_address_user_age_user_company_user_gender_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='user',
            name='company',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, to='companies.company'),
        ),
        migrations.AlterField(
            model_name='user',
            name='role',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, to='roles.role'),
        ),
    ]

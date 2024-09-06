# serializers.py
from rest_framework import serializers
from .models import Resume
from users.models import User
from companies.models import Company
from jobs.models import Job

class ResumeSerializer(serializers.ModelSerializer):

    class Meta:
        model = Resume
        fields = '__all__'

class CreateResumeSerializer(serializers.ModelSerializer):
    companyId = serializers.IntegerField(write_only=True)
    jobId = serializers.IntegerField(write_only=True)

    class Meta:
        model = Resume
        fields = ['url', 'companyId', 'jobId']

    def validate_companyId(self, value):
        if not Company.objects.filter(id=value).exists():
            raise serializers.ValidationError("Company does not exist.")
        return value

    def validate_jobId(self, value):
        if not Job.objects.filter(id=value).exists():
            raise serializers.ValidationError("Job does not exist.")
        return value

    def create(self, validated_data):
        user = self.context['request'].user
        current_user = User.objects.get(id=user.id)
        email = current_user.email
        company = Company.objects.get(id=validated_data['companyId'])
        job = Job.objects.get(id=validated_data['jobId'])
        resume = Resume.objects.create(
            email=email,
            user=user,
            url=validated_data['url'],
            company=company,
            job=job,
            status='PENDING'
        )
        return resume

class UpdateResumeStatusSerializer(serializers.ModelSerializer):
    class Meta:
        model = Resume
        fields = ['status']
    
    def update(self, instance, validated_data):
        instance.status = validated_data['status']
        instance.save()
        return instance
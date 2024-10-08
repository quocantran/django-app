from rest_framework import serializers
from .models import Job
from companies.serializers import CompanyJobsSerializer

class JobResumeSerializer(serializers.ModelSerializer):
    
        class Meta:
            model = Job
            fields = ['id', 'name']
            

class JobCreateSerializer(serializers.ModelSerializer):

    class Meta:
        model = Job
        fields = '__all__'
        read_only_fields = ['id', 'created_at', 'updated_at']

    def create(self, validated_data):
        job = Job.objects.create(
            name=validated_data['name'],
            description=validated_data['description'],
            skills=validated_data['skills'],
            company=validated_data['company'],
            salary=validated_data['salary'],
            level=validated_data['level'],
            start_date=validated_data['start_date'],
            quantity=validated_data['quantity'],
            location=validated_data['location'],
            end_date=validated_data['end_date']
        )
        return job

class JobListSerializer(serializers.ModelSerializer):

    company = CompanyJobsSerializer()

    class Meta:
        model = Job
        fields = '__all__'
        read_only_fields = ['id', 'created_at', 'updated_at']


class JobUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Job
        fields = '__all__'
        read_only_fields = ['id', 'created_at', 'updated_at']

    def update(self, instance, validated_data):
        instance.name = validated_data.get('name', instance.name)
        instance.description = validated_data.get('description', instance.description)
        instance.skills = validated_data.get('skills', instance.skills)
        instance.company = validated_data.get('company', instance.company)
        instance.salary = validated_data.get('salary', instance.salary)
        instance.level = validated_data.get('level', instance.level)
        instance.start_date = validated_data.get('start_date', instance.start_date)
        instance.quantity = validated_data.get('quantity', instance.quantity)
        instance.location = validated_data.get('location', instance.location)
        instance.end_date = validated_data.get('end_date', instance.end_date)
        instance.is_active = validated_data.get('is_active', instance.is_active)
        instance.save()
        return instance
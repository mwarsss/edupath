from rest_framework import serializers
from .models import Student, Staff, Application, Notification


class StudentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Student
        fields = '__all__'


class StaffSerializer(serializers.ModelSerializer):
    class Meta:
        model = Staff  # Corrected typo from 'models' to 'model'
        fields = '__all__'


class ApplicationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Application  # Corrected typo from 'Staff' to 'Application'
        fields = ['id', 'student', 'status',
                  'document']  # Add 'document' field


class NotificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notification
        fields = ['id', 'title', 'message', 'created_at']


class OnboardingSerializer(serializers.ModelSerializer):
    document = serializers.FileField(write_only=True)

    class Meta:
        model = Student
        fields = ['name', 'email', 'phone', 'date_of_birth',
                  'address', 'course_applied', 'document']

    def create(self, validated_data):
        document = validated_data.pop('document', None)
        student = Student.objects.create(**validated_data)
        Application.objects.create(student=student, document=document)
        return student

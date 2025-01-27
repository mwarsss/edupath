from rest_framework import serializers
from .models import Student, Application, Notification


class StudentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Student
        fields = '__all__'


class ApplicationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Application
        fields = '__all__'


class NotificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notification
        fields = '__all__'


class OnboardingSerializer(serializers.ModelSerializer):
    class Meta:
        model = Student  # Assuming onboarding is related to the Student model
        fields = '__all__'

from django.shortcuts import render
from rest_framework import viewsets
from .models import Student, Staff, Application, Notification
from .serializers import StudentSerializer, StaffSerializer, ApplicationSerializer, NotificationSerializer
from rest_framework_simplejwt.authentication import TokenObtainPairView


class StudentViewSet(viewsets.ModelViewSet):
    queryset = Student.objects.all()
    serializer_class = StudentSerializer


class StaffViewSet(viewsets.ModelViewSet):
    queryset = Staff.objects.all()
    serializer_class = StaffSerializer


class ApplicationViewSet(viewsets.ModelViewSet):
    queryset = Application.objects.all()
    serializer_class = ApplicationSerializer


class NotificationViewSet(viewsets.ModelViewSet):
    queryset = Notification.objects.all()
    serializer_class = NotificationSerializer


class LoginView(TokenObtainPairView):
    pass

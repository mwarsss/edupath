from rest_framework.views import APIView
from django.shortcuts import render
from rest_framework import viewsets
from .models import Student, Staff, Application, Notification
from .serializers import StudentSerializer, StaffSerializer, ApplicationSerializer, NotificationSerializer
from rest_framework_simplejwt.authentication import TokenObtainPairView
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated


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


class ApplicationListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        # Fetch applications based on user role
        if request.user.is_staff:
            applications = Application.objects.all()  # Staff sees all applications
        else:
            applications = Application.objects.filter(
                student=request.user)  # Customers see their own
        data = [{"id": app.id, "student": {"name": app.student.name},
                 "status": app.status} for app in applications]
        return Response(data)

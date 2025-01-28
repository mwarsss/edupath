from .models import Student
from rest_framework import viewsets, filters
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.status import HTTP_200_OK, HTTP_400_BAD_REQUEST, HTTP_201_CREATED, HTTP_403_FORBIDDEN, HTTP_404_NOT_FOUND
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenObtainPairView
from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from django_filters.rest_framework import DjangoFilterBackend
from .models import Student, Application, Notification
from .serializers import StudentSerializer, ApplicationSerializer, NotificationSerializer, OnboardingSerializer
from django.db.models import Count
from django.utils.dateparse import parse_date
from django.contrib.auth.hashers import make_password


class StudentViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    queryset = Student.objects.all()
    serializer_class = StudentSerializer


class ApplicationViewSet(viewsets.ModelViewSet):
    queryset = Application.objects.all()
    serializer_class = ApplicationSerializer


class NotificationViewSet(viewsets.ModelViewSet):
    queryset = Notification.objects.all()
    serializer_class = NotificationSerializer


class LoginView(TokenObtainPairView):
    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')

        user = authenticate(username=username, password=password)

        if user:
            # Generate JWT
            refresh = RefreshToken.for_user(user)
            return Response({
                'refresh': str(refresh),
                'access': str(refresh.access_token),
                'username': user.username,
            }, status=HTTP_200_OK)

        return Response({'error': 'Invalid credentials'}, status=HTTP_400_BAD_REQUEST)


class ApplicationListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        applications = Application.objects.all()
        serializer = ApplicationSerializer(applications, many=True)
        return Response(serializer.data)


class UpdateApplicationStatusView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, pk):
        application = Application.objects.get(pk=pk)
        status = request.data.get('status')
        application.status = status
        application.save()
        return Response({'status': 'status updated'}, status=HTTP_200_OK)


class RegisterView(APIView):
    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')
        email = request.data.get('email')

        if User.objects.filter(username=username).exists():
            return Response({'error': 'Username already exists'}, status=HTTP_400_BAD_REQUEST)

        if User.objects.filter(email=email).exists():
            return Response({'error': 'Email already exists'}, status=HTTP_400_BAD_REQUEST)

        user = User.objects.create(
            username=username,
            password=make_password(password),
            email=email
        )
        return Response({'status': 'user created'}, status=HTTP_201_CREATED)


class StudentListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        students = Student.objects.all()
        serializer = StudentSerializer(students, many=True)
        return Response(serializer.data)


class UpdateStudentView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, pk):
        student = Student.objects.get(pk=pk)
        student.name = request.data.get('name')
        student.save()
        return Response({'status': 'student updated'}, status=HTTP_200_OK)


class AnalyticsOverviewView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        # Get filter parameters
        start_date = request.query_params.get("start_date")
        end_date = request.query_params.get("end_date")
        course = request.query_params.get("course")
        status = request.query_params.get("status")

        # Filter students based on parameters
        students = Student.objects.all()
        if start_date:
            students = students.filter(
                created_at__date__gte=parse_date(start_date))
        if end_date:
            students = students.filter(
                created_at__date__lte=parse_date(end_date))
        if course:
            students = students.filter(course_applied=course)
        if status:
            students = students.filter(application_status=status)

        # Analytics calculations
        total_students = students.count()
        applications_by_status = students.values(
            "application_status").annotate(count=Count("application_status"))
        applications_by_course = students.values(
            "course_applied").annotate(count=Count("course_applied"))

        return Response({
            "total_students": total_students,
            "applications_by_status": applications_by_status,
            "applications_by_course": applications_by_course,
        })


class ApplicationsOverTimeView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        start_date = request.query_params.get("start_date")
        end_date = request.query_params.get("end_date")

        # Filter by date range
        applications_over_time = Student.objects.extra(
            {"day": "date(created_at)"})
        if start_date:
            applications_over_time = applications_over_time.filter(
                created_at__date__gte=parse_date(start_date))
        if end_date:
            applications_over_time = applications_over_time.filter(
                created_at__date__lte=parse_date(end_date))

        applications_over_time = applications_over_time.values(
            "day").annotate(count=Count("id")).order_by("day")

        return Response({"applications_over_time": applications_over_time})


class BaseCreateView(APIView):
    serializer_class = None
    success_message = "Operation successful!"

    def post(self, request):
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({"message": self.success_message, "data": serializer.data}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class OnboardingView(BaseCreateView):
    serializer_class = OnboardingSerializer
    success_message = "Application submitted successfully!"


class AddApplicantView(BaseCreateView):
    permission_classes = [IsAuthenticated]
    serializer_class = StudentSerializer
    success_message = "Applicant added successfully!"

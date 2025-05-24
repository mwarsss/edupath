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
from django.db.models.functions import TruncDay # Import TruncDay
from django.utils.dateparse import parse_date
from django.contrib.auth.hashers import make_password
from django.shortcuts import render


class StudentViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    queryset = Student.objects.all()
    serializer_class = StudentSerializer


class ApplicationViewSet(viewsets.ModelViewSet):
    queryset = Application.objects.all()
    serializer_class = ApplicationSerializer
    permission_classes = [IsAuthenticated]


class NotificationViewSet(viewsets.ModelViewSet):
    queryset = Notification.objects.all()
    serializer_class = NotificationSerializer


class LoginView(TokenObtainPairView):
    """
    Handles user authentication using username and password,
    and provides JWT tokens (access and refresh) upon successful login.
    Extends TokenObtainPairView from rest_framework_simplejwt.
    """
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
    """
    Provides a list of all applications.
    Requires authentication.
    """
    permission_classes = [IsAuthenticated]

    def get(self, request):
        applications = Application.objects.all()
        serializer = ApplicationSerializer(applications, many=True)
        return Response(serializer.data)


class UpdateApplicationStatusView(APIView):
    """
    Updates the status of a specific application, identified by its primary key (pk).
    Requires authentication.
    Expects 'status' in the request data.
    """
    permission_classes = [IsAuthenticated]

    def post(self, request, pk):
        try:
            application = Application.objects.get(pk=pk)
        except Application.DoesNotExist:
            return Response({'error': 'Application not found'}, status=HTTP_404_NOT_FOUND)
        
        status_param = request.data.get('status') # Renamed to avoid conflict with 'status' module
        if status_param is not None: # Check if status is provided
            application.status = status_param
            application.save()
            return Response({'status': 'status updated'}, status=HTTP_200_OK)
        else:
            return Response({'error': 'Status not provided'}, status=HTTP_400_BAD_REQUEST)


class RegisterView(APIView):
    """
    Handles new user registration.
    Expects 'username', 'password', and 'email' in the request data.
    Checks for existing username or email before creating a new user.
    """
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
    """
    Provides a list of all students.
    Requires authentication.
    """
    permission_classes = [IsAuthenticated]

    def get(self, request):
        students = Student.objects.all()
        serializer = StudentSerializer(students, many=True)
        return Response(serializer.data)


class UpdateStudentView(APIView):
    """
    Updates the details (specifically the name) of a student, identified by their primary key (pk).
    Requires authentication.
    Expects 'name' in the request data.
    """
    permission_classes = [IsAuthenticated]

    def post(self, request, pk):
        try:
            student = Student.objects.get(pk=pk)
        except Student.DoesNotExist:
            return Response({'error': 'Student not found'}, status=HTTP_404_NOT_FOUND)
        
        name_param = request.data.get('name') # Renamed to avoid conflict
        if name_param is not None: # Check if name is provided
            student.name = name_param
            student.save()
            return Response({'status': 'student updated'}, status=HTTP_200_OK)
        else:
            return Response({'error': 'Name not provided'}, status=HTTP_400_BAD_REQUEST)


class AnalyticsOverviewView(APIView):
    """
    Provides an overview of application analytics.
    Supports filtering by start_date, end_date, course, and status.
    Returns total student count, and counts of applications grouped by status and course.
    Requires authentication.
    """
    permission_classes = [IsAuthenticated]

    def get(self, request):
        # Get filter parameters from query
        start_date_str = request.query_params.get("start_date")
        end_date_str = request.query_params.get("end_date")
        course = request.query_params.get("course")
        status_param = request.query_params.get("status")

        # Dynamically build filter conditions
        filters = {}
        if start_date_str:
            parsed_start_date = parse_date(start_date_str)
            if parsed_start_date:
                filters['created_at__date__gte'] = parsed_start_date
        if end_date_str:
            parsed_end_date = parse_date(end_date_str)
            if parsed_end_date:
                filters['created_at__date__lte'] = parsed_end_date
        if course:
            filters['course_applied'] = course
        if status_param: # Renamed to avoid conflict with 'status' module
            filters['application_status'] = status_param

        # Filter students based on dynamically built conditions
        # The **filters syntax unpacks the dictionary into keyword arguments
        students = Student.objects.filter(**filters)

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
    """
    Provides data on the number of student applications received over time.
    Supports filtering by start_date and end_date.
    Groups application counts by day.
    Requires authentication.
    """
    permission_classes = [IsAuthenticated]

    def get(self, request):
        start_date_str = request.query_params.get("start_date")
        end_date_str = request.query_params.get("end_date")

        # Start with the base queryset
        queryset = Student.objects.all()

        # Apply date filters if provided
        if start_date_str:
            parsed_start_date = parse_date(start_date_str)
            if parsed_start_date:
                queryset = queryset.filter(created_at__date__gte=parsed_start_date)
        if end_date_str:
            parsed_end_date = parse_date(end_date_str)
            if parsed_end_date:
                queryset = queryset.filter(created_at__date__lte=parsed_end_date)

        # Annotate with 'day' by truncating 'created_at', then group and count
        # This approach is database-agnostic for date truncation.
        applications_over_time = queryset.annotate(
            day=TruncDay('created_at')  # Truncate the datetime to a date (day)
        ).values(
            'day'  # Group by the truncated day
        ).annotate(
            count=Count('id')  # Count applications per day
        ).order_by(
            'day'  # Order results by day
        )

        return Response({"applications_over_time": applications_over_time})


class BaseCreateView(APIView):
    """
    A base class for API views that handle creation of new model instances.
    Subclasses should specify `serializer_class` and `success_message`.
    """
    serializer_class = None
    success_message = "Operation successful!"

    def post(self, request):
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({"message": self.success_message, "data": serializer.data}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class OnboardingView(BaseCreateView):
    """
    Handles the submission of new applications (onboarding).
    Uses OnboardingSerializer to validate and save application data.
    Inherits from BaseCreateView.
    """
    serializer_class = OnboardingSerializer
    success_message = "Application submitted successfully!"


class AddApplicantView(BaseCreateView):
    """
    Handles the addition of new student applicants.
    Requires authentication.
    Uses StudentSerializer to validate and save student data.
    Inherits from BaseCreateView.
    """
    permission_classes = [IsAuthenticated]
    serializer_class = StudentSerializer
    success_message = "Applicant added successfully!"


def analytics_view(request):
    return render(request, 'analytics.html')

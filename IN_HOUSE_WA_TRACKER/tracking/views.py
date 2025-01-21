from rest_framework import viewsets
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.status import HTTP_200_OK, HTTP_400_BAD_REQUEST, HTTP_201_CREATED
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenObtainPairView
from .models import Student, Staff, Application, Notification
from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from .serializers import StudentSerializer, StaffSerializer, ApplicationSerializer, NotificationSerializer


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
        # Fetch applications based on user role
        if request.user.is_staff:
            applications = Application.objects.all()  # Staff sees all applications
        else:
            applications = Application.objects.filter(
                student=request.user)  # Customers see their own
        data = [{"id": app.id, "student": {"name": app.student.name},
                 "status": app.status} for app in applications]
        return Response(serializer.data)


class RegisterView(APIView):
    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')
        email = request.data.get('email')

       # Validate input
        if not username or not password or not email:
            return Response({"error": "All fields are required."}, status=HTTP_400_BAD_REQUEST)
        if User.objects.filter(username=username).exists():
            return Response({"error": "Username already exists."}, status=HTTP_400_BAD_REQUEST)

        # Create new user
        try:
            user = User.objects.create_user(
                username=username, password=password, email=email)
            return Response({"message": "User registered successfully."}, status=HTTP_201_CREATED)
        except Exception as e:
            return Response({"error": str(e)}, status=HTTP_400_BAD_REQUEST)

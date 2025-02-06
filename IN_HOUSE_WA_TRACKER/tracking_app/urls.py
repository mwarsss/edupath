"""
URL configuration for tracking_app project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from tracking.views import StudentViewSet, ApplicationViewSet, NotificationViewSet, LoginView, ApplicationListView, UpdateApplicationStatusView, RegisterView, StudentListView, UpdateStudentView, AnalyticsOverviewView, ApplicationsOverTimeView, OnboardingView, AddApplicantView, analytics_view, AddStaffView, UpdateStaffView, DeleteStaffView
from django.conf import settings
from django.conf.urls.static import static


router = DefaultRouter()

# Register the endpoints with their respective viewsets
# Correct plural for endpoints
router.register('students', StudentViewSet)
router.register('applications', ApplicationViewSet)
router.register('notifications', NotificationViewSet)

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include(router.urls)),
    path('api/applications/list/',
         ApplicationListView.as_view(), name='application-list'),
    path('api/applications/update-status/',
         UpdateApplicationStatusView.as_view(), name='update-application-status'),
    path('api/login/', LoginView.as_view(), name='login'),
    path('api/register/', RegisterView.as_view(), name='register'),
    path('api/students/list/', StudentListView.as_view(), name='student-list'),
    path('api/students/update/', UpdateStudentView.as_view(), name='update-student'),
    path('api/analytics/overview/', AnalyticsOverviewView.as_view(),
         name='analytics-overview'),
    path('api/analytics/applications-over-time/',
         ApplicationsOverTimeView.as_view(), name='applications-over-time'),
    path('api/onboarding/', OnboardingView.as_view(), name='onboarding'),
    path('api/applicants/add/', AddApplicantView.as_view(), name='add-applicant'),
    path('analytics/', analytics_view, name='analytics'),
    path('api/staff/add/', AddStaffView.as_view(), name='add-staff'),
    path('api/staff/update/<int:pk>/',
         UpdateStaffView.as_view(), name='update-staff'),
    path('api/staff/delete/<int:pk>/',
         DeleteStaffView.as_view(), name='delete-staff'),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

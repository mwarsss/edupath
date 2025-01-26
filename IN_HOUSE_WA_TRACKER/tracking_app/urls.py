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
from tracking.views import StudentViewSet, StaffViewSet, ApplicationViewSet, NotificationViewSet, LoginView, ApplicationListView, UpdateApplicationStatusView, RegisterView, StudentListView, UpdateStudentView, AnalyticsOverviewView, ApplicationsOverTimeView


router = DefaultRouter()

# Register the endpoints with their respective viewsets
# Correct plural for endpoints
router.register('students', StudentViewSet)
router.register('staff', StaffViewSet)
router.register('applications', ApplicationViewSet)
router.register('notifications', NotificationViewSet)

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include(router.urls)),
    path('api/applications/', ApplicationListView.as_view(), name='applications'),
    path('api/applications/<int:pk>/update-status/',
         UpdateApplicationStatusView.as_view(), name='update-application-status'),
    path('api/login/', LoginView.as_view(), name='login'),
    path('api/register/', RegisterView.as_view(), name='register'),
    path('api/students/', StudentListView.as_view(), name='students'),
    path('api/students/<int:pk>/update/',
         UpdateStudentView.as_view(), name='update-student'),
    path('api/analytics/overview/', AnalyticsOverviewView.as_view(),
         name='analytics-overview'),
    path('api/analytics/applications-over-time/',
         ApplicationsOverTimeView.as_view(), name='applications-over-time'),

]

from django.db import models
from django.utils import timezone


class Student(models.Model):
    name = models.CharField(max_length=100)
    email = models.EmailField(unique=True)
    phone = models.CharField(max_length=15)
    date_of_birth = models.DateField(null=True, blank=True)
    address = models.TextField(null=True, blank=True)
    course_applied = models.CharField(max_length=100)
    program = models.CharField(max_length=100, null=True, blank=True)
    application_status = models.CharField(max_length=50, default="Pending")
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name


class Staff(models.Model):
    name = models.CharField(max_length=100)
    role = models.CharField(max_length=100)
    email = models.EmailField(unique=True)
    contact = models.CharField(max_length=15)

    def __str__(self):
        return self.name


class Application(models.Model):
    student = models.ForeignKey(Student, on_delete=models.CASCADE)
    status = models.CharField(max_length=20, default="Pending")
    document = models.FileField(upload_to='documents/', null=True, blank=True)
    submission_data = models.JSONField(null=True, blank=True)
    created_at = models.DateTimeField(default=timezone.now)
    staff = models.ForeignKey(
        Staff, on_delete=models.CASCADE, null=True, blank=True)

    def __str__(self):
        return f"Application {self.id} for {self.student.name}"


class Notification(models.Model):
    title = models.CharField(max_length=100, default="Untitled Notification")
    message = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    application = models.ForeignKey(
        Application, on_delete=models.CASCADE, null=True, blank=True)

    def __str__(self):
        return self.title

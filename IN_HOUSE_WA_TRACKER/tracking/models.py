from django.db import models
from .utils import send_whatsapp_message


class Student(models.Model):
    name = models.CharField(max_length=100)
    email = models.EmailField(unique=True)
    phone = models.CharField(max_length=15)
    date_of_birth = models.DateField(null=True, blank=True)
    address = models.TextField(null=True, blank=True)
    course_applied = models.CharField(max_length=100)
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
    STATUS_CHOICES = [
        ('Pending', 'Pending'),
        ('In progress', 'In Progress'),
        ('Complete', 'Approved'),

    ]

    student = models.ForeignKey(Student, on_delete=models.CASCADE)
    status = models.CharField(
        max_length=20, choices=STATUS_CHOICES, default='Pending')
    submission_data = models.DateTimeField(auto_now_add=True)
    notes = models.TextField(blank=True, null=True)
    assigned_staff = models.ForeignKey(
        Staff, on_delete=models.SET_NULL, null=True, blank=True)
    document = models.FileField(
        upload_to='documents/', null=True, blank=True)  # Add this line

    def __str__(self):
        return f"Application {self.id} for {self.student.name}"


class Notification(models.Model):
    NOTIFICATION_TYPES = [
        ('email', 'Email'),
        ('whatsapp', 'WhatsApp'),
    ]

    notification_type = models.CharField(
        max_length=20, choices=NOTIFICATION_TYPES, default='email')
    message = models.TextField()
    application = models.ForeignKey(Application, on_delete=models.CASCADE)
    timestamp = models.DateTimeField(auto_now_add=True)

    def save(self, *args, **kwargs):
        if self.notification_type.lower() == "whatsapp":
            # Add your logic here
            pass
        super().save(*args, **kwargs)

    def __str__(self):
        return f"Notification for {self.application.id}"

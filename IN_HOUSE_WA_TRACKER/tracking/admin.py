from django.contrib import admin
from .models import Student, Application, Notification

# Register your models here.
admin.site.register(Student)
admin.site.register(Application)
admin.site.register(Notification)

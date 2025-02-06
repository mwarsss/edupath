from django.contrib import admin
from .models import Staff, Student, Application, Notification

# Register your models here.
admin.site.register(Student)
admin.site.register(Application)
admin.site.register(Notification)
admin.site.register(Staff)

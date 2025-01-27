from django.contrib import admin
from .models import Student, Application, Notification  # Removed Staff

# Register your models here.
admin.site.register(Student)
admin.site.register(Application)
admin.site.register(Notification)

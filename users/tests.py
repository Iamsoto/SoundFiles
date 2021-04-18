from django.test import TestCase

# Create your tests here.
from django.contrib import admin
from django.urls import path

urlpatterns = [
    path('admin/', admin.site.urls),
    path('user/',users.site.urls)
]
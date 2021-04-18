from django.urls import path
from . import views

urlpatterns = [
	path('flag', views.SubmitFlag.as_view(), name='submit_flag'),	
	
]
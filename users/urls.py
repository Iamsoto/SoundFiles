from django.contrib import admin
from django.urls import path
from . import views

app_name = 'users'
urlpatterns = [
   path('', views.ListUsers.as_view(), name="list-users"),
   path('username', views.Username.as_view(), name="username"),
   path('create', views.CreateNewUser.as_view(), name="create-user"),
   path('<int:pk>', views.DetailUser.as_view(), name="detail-users"),
   path('activate/<code>',views.Activate.as_view(), name="activate"),
   path('resend', views.ReSend.as_view(), name="re-send"),
   path('change_password', views.ChangePassword.as_view(), name="change-password")
   
]
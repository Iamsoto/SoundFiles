from django.contrib import admin
from django.conf import settings
from django.urls import path, include, re_path
from django.views.generic import TemplateView

from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

context = {'APIROOT_URL':settings.__APIROOT_URL__} # Pass these variables to React

urlpatterns = [
    path('users/', include('users.urls')),
    path('userfeatures/',include('userfeatures.urls')),
    path('system/', include('system.urls')),
    path('podcasts/', include('podcasts.urls')),
    path('api/token', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh', TokenRefreshView.as_view(), name='token_refresh'),
    path('admin/', admin.site.urls),
    re_path('.*', TemplateView.as_view(template_name='index.html', extra_context=context))

]

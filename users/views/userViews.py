from django import forms
from django.conf import settings
from django.http import Http404
from django.core.exceptions import ValidationError, ObjectDoesNotExist
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import permissions, status

from CustomPermissions import ValidEmail
from users.models import SoundFileUser
from podcasts.models import Episode

from users.serializers import (
    CreateUserSerializer,
    ListUsersSerializer
)


class Username(APIView):
    """
        A simple test to see if we're still logged in
    """
    permission_classes = [permissions.IsAuthenticated]
    
    def get(self, request, format=None):
        response_data={}
        response_data["username"] = request.user.username
        return Response(response_data, status=status.HTTP_200_OK)


class CreateNewUser(APIView):
    
    def post(self, request, format=None):
        """
            Create - public
        """
        serializer = CreateUserSerializer(data=request.data)
        if serializer.is_valid():

            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        #print(serializer.errors)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ListUsers(APIView):
    """
    List of users, also the admin endpoint to create user
    """
    permission_classes = [permissions.IsAuthenticated, 
    permissions.IsAdminUser]
    def get(self, request, format=None):
        users = SoundFileUser.objects.all()
        serializer = ListUsersSerializer(users, many=True)
        #
        return Response(serializer.data)

    def post(self, request, format=None):
        """
            Create - Admin
        """
        serializer = CreateUserSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class DetailUser(APIView):
    """
    Detail a specific user/update user
    """
    permission_classes = [permissions.IsAuthenticated, 
    permissions.IsAdminUser]
    def get_object(self, pk):
        try:
            return SoundFileUser.objects.get(pk=pk)
        except SoundFileUser.DoesNotExist:
            raise Http404

    def get(self, request, pk, format=None):
        user = self.get_object(pk)
        serializer = DetailUserSerializer(user)
        #permission_classes = [permissions.IsAuthenticated]
        return Response(serializer.data)
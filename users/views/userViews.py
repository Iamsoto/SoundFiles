from django import forms
from django.conf import settings
from django.http import Http404
from django.core.exceptions import ValidationError, ObjectDoesNotExist
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import permissions, status, throttling
from django.template.loader import render_to_string
from django.core.mail import send_mail
from CustomPermissions import ValidEmail
from users.models import SoundFileUser
from podcasts.models import Episode
import random
import string

from users.serializers import (
    CreateUserSerializer,
    ListUsersSerializer
)

class ActivateThrottle(throttling.UserRateThrottle):
    rate ='2/minute'

class Username(APIView):
    """
        A simple test to see if we're still logged in
    """
    permission_classes = [permissions.IsAuthenticated]
    
    def get(self, request, format=None):
        response_data={}
        response_data["username"] = request.user.username
        return Response(response_data, status=status.HTTP_200_OK)


class ReSend(APIView):
    permission_classes = [permissions.IsAuthenticated]
    def post(self, request, format=None):
        response_data = {}
        user = request.user
        letters = string.ascii_lowercase
        code =  ''.join(random.choice(letters) for i in range(28))
        user.activation_code = code
        try:
            host = settings.__APIROOT_URL__
            url = f"{host}activate/{code}"
            html_message = render_to_string('validate_email.html', {'url': url})
            t = send_mail("Verify your email for SoundFiles.fm",
                f"Please follow the link to verify your email for SoundFiles.fm: {url}",
                "donotreply@soundfiles.fm", [user.email], html_message=html_message, fail_silently=False)       
        except Exception as e:
            print(f"Error sending email: {e}")
            response_data["detail"] = "Please try again later"
            return Response(response_data, status=status.HTTP_400_BAD_REQUEST)

        response_data["success"] = "Another email sent"
        return Response(response_data, status=status.HTTP_200_OK)


class ChangePassword(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self,request, format=None):
        """
            Hopefully self explanitory
        """
        response_data = {}
        if ("current_pass" not in request.data) or ("new_pass_1" not in request.data) or ("new_pass_2" not in request.data):
            response_data["detail"] = "Malformed payload"
            return Response(response_data, status=status.HTTP_400_BAD_REQUEST)
        else:
            user =request.user
            if not user.check_password(request.data["current_pass"]):
                response_data["detail"] = "Incorrect current password" 
                return Response(response_data, status=status.HTTP_405_METHOD_NOT_ALLOWED)
            if request.data["new_pass_1"] != request.data["new_pass_2"]:
                response_data["detail"] = "New Passwords don't match"
                return Response(response_data,status=status.HTTP_405_METHOD_NOT_ALLOWED)

            user.set_password(request.data["new_pass_1"])
            try:
                user.save()
            except Exception as e:
                response_data["detail"] = "Something happened"
                return Response(response_data,status=status.HTTP_405_METHOD_NOT_ALLOWED)

            response_data["success"] = True
            return Response(response_data, status=status.HTTP_200_OK)

class Activate(APIView):
    permission_classes = [permissions.IsAuthenticated]
    throttle_classes = [ActivateThrottle]
    def get(self, request, code=-1, format=None):
        response_data = {}
    
        if code == -1:
            response_data["detail"] = "not found"
            return Response(response_data, status=status.HTTP_400_BAD_REQUEST)
        else:
            user = request.user
            if user.valid_email == True:
                response_data["detail"] = "user already verified"
                return Response(response_data, status=status.HTTP_400_BAD_REQUEST)

            if user.activation_code == code:
                user.valid_email = True
                
                try:
                    user.save()
                except Exception as e:
                    print(f"Problem verifying user {e}")
                    response_data["detail"] = "Something happened"
                    return Response(response_data, status=status.HTTP_400_BAD_REQUEST)

                response_data["success"] = "Email Verified!! Enjoy the site!!!"
                return Response(response_data, status=status.HTTP_200_OK)
            else:
                response_data["detail"] = "Please try again or request another verification email"
                return Response(response_data, status=status.HTTP_400_BAD_REQUEST)


class CreateNewUser(APIView):
    
    def post(self, request, format=None):
        """
            Create - public
        """
        serializer = CreateUserSerializer(data=request.data)
        if serializer.is_valid():
            # send deh email          
            serializer.save()
            try:
                host = settings.__APIROOT_URL__
                
                user = SoundFileUser.objects.filter(email=serializer.data["email"]).first()
                if user is None:
                    raise Exception

                code = user.activation_code
                url = f"{host}activate/{code}"
                html_message = render_to_string('validate_email.html', {'url': url})
                send_mail("Verify your email for SoundFiles.fm", 
                    f"Please follow the link to verify your email for SoundFiles.fm: {url}",
                    "donotreply@soundfiles.fm", [user.email], html_message=html_message)
            except Exception as e:
                print(f"Error sending email! {e}")

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
from django.http import Http404
from CustomPermissions import ValidEmail
from userfeatures.models import Playlist
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import permissions, status
from userfeatures.serializers import PlaylistSerializerSmall
from django.core.exceptions import ValidationError, ObjectDoesNotExist
from users.models import SoundFileUser
from django.utils import timezone

class NewsLetter(APIView):
    permission_classes = [permissions.IsAuthenticated]
    
    def post(self,request,format=None):
        response_data={}
        user = request.user
        user.news_letter = not (user.news_letter)
        try:
            user.save()
        except Exception as e:
            response_data["detail"] = "something happened"
            Response(response_data,status=status.HTTP_400_BAD_REQUEST)

        response_data["success"] = True
        return Response(response_data, status=status.HTTP_200_OK)


class UserAccountView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, format=None):
        user = request.user

        response_data= {}
        response_data["valid_email"] = user.valid_email
        response_data["username"] = user.username
        response_data["email"] = user.email
        response_data["news_letter"] = user.news_letter
        response_data["membership"] = user.membership
        return Response(response_data,status=status.HTTP_200_OK)


class UserProfileView(APIView):
    """
        
    """

    def get(self, request, format=None):
        """
            Get profile information of a user
        """
        response_data = {}
        user_pk = request.query_params.get('user_pk', None)
        #print(f"The user pk: {user_pk}")
        if user_pk is not None:
            try:
                user = SoundFileUser.objects.get(pk=user_pk)
            except SoundFileUser.DoesNotExist as e:
                raise Http404
        else:
            if request.user.is_anonymous:
                response_data["detail"] = "Something went wrong"
                return Response(response_data, status=status.HTTP_400_BAD_REQUEST)
            else:
                user = request.user

        response_data["score"] = user.score
        response_data["username"] = user.username
        response_data["email"] = user.email
        playlist_objects = Playlist.objects.filter(user=user, public=True)
        playlists_serial = PlaylistSerializerSmall(playlist_objects, many=True)
        response_data["playlists"] = playlists_serial.data
        return Response(response_data, status=status.HTTP_200_OK)






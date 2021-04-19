from CustomPermissions import ValidEmail
from userfeatures.models import Playlist
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import permissions, status
from userfeatures.serializers import PlaylistSerializerSmall
from django.core.exceptions import ValidationError, ObjectDoesNotExist
from django.utils import timezone


class UserProfileView(APIView):
    """
        
    """
    permission_classes = [permissions.IsAuthenticated, ValidEmail]


    def get(self, request, format=None):
        """
            Get individual episode timestamp. Or all timestamps for user
        """
        response_data = {}
        user = request.user
        response_data["score"] = user.score
        response_data["username"] = user.username
        playlist_objects = Playlist.objects.filter(user=user, public=True)
        playlists_serial = PlaylistSerializerSmall(playlist_objects, many=True)
        response_data["playlists"] = playlists_serial.data
        return Response(response_data, status=status.HTTP_200_OK)






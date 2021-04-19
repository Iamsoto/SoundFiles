from django import forms
from django.conf import settings
from django.http import Http404
from django.core.exceptions import ValidationError, ObjectDoesNotExist
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import permissions, status

from CustomPermissions import ValidEmail
from users.models import SoundFileUser
from userfeatures.models import Playlist, EpisodePlaylist as EPL
from podcasts.models import Episode

from userfeatures.serializers import (
    PlaylistSerializer,
    EpisodePlaylistSerializer
)

class PlaylistDetail(APIView):
    """
        Requires no permissions, except that object must be public
    """
    def get(self, request, pk=-1, format=None):
        response_data = {}
        pl = None
        if pk == -1:
            response_data["detail"] = "Need a PK"
            return Response(response_data, status=status.HTTP_400_BAD_REQUEST)

        try:
            pl = Playlist.objects.get(pk=pk)
        except Playlist.DoesNotExist as e:
            response_data["detail"] = "Does not exist"
            return Response(response_data, status=status.HTTP_400_BAD_REQUEST)

        if not pl.public:
            response_data["detail"] = "Not allowed"
            return Response(response_data, status=status.HTTP_400_BAD_REQUEST)

        pl_serializer = PlaylistSerializer(pl, context={'request':request})
        return Response(pl_serializer.data, status=status.HTTP_200_OK)


class EpisodePlaylist(APIView):
    """
        playlist-episodes
            Add an episode to a playlist given the playlist pk
            and episode pk

            Or remove it using the same payload and 'delete' request

    """
    permission_classes = [permissions.IsAuthenticated, ValidEmail]


    def post(self, request, format=None):
        """
            required: episode_pk and playlist_pk
        """
        # Need user, playlst
        response_data = {}
        sponge = forms.CharField()
        data = request.data
        epl = None
        episode = None
        playlist = None

        if "episode_pk" not in data or "playlist_pk" not in data:
            """
                Make sure currect data in payload
            """
            response_data["detail"] = "malformed payload"
            return Response(response_data, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            """
                Make sure no validation error
            """
            episode_pk = sponge.clean(data["episode_pk"])
            playlist_pk = sponge.clean(data["playlist_pk"])
        except ValidationError as e: 
            response_data["detail"] = "Did you try to do something funky?"
            return Response(response_data, status=status.HTTP_400_BAD_REQUEST)

        try:
            """
                Make sure valid database objects
            """
            episode = Episode.objects.get(pk = episode_pk)
            playlist = Playlist.objects.get(pk = playlist_pk)
        except ObjectDoesNotExist as e:
            response_data["detail"] = "Could not find one or more items"
            return Response(response_data, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            #print(e)
            response_data["detail"] = "Something bad happened here"
            return Response(response_data, status=status.HTTP_400_BAD_REQUEST)

        if playlist.user != request.user:
            """
                XSS attack
            """
            response_data["detail"] = "Hacker..."
            return Response(response_data, status=status.HTTP_401_UNAUTHORIZED)
            
        try:
            epl = EPL(playlist=playlist, episode=episode)
            epl.save()
            playlist.episodes.add(epl)
            playlist.save()
        except Exception as e:
            #print(e)
            response_data["detail"] = "Something bad happened please try again later"
            return Response(response_data, status=status.HTTP_400_BAD_REQUEST)

        response_data["success"] = "success"
        return Response(response_data, status=status.HTTP_201_CREATED)

    
    def delete(self, request, format=None):
        """
            required: episode_pk and playlist_pk
        """
        # Need user, playlst
        response_data = {}
        sponge = forms.CharField()
        data = request.data
        epl = None
        episode = None
        playlist = None

        if "episode_pk" not in data or "playlist_pk" not in data:
            """
                Make sure currect data in payload
            """
            #print(data)
            response_data["detail"] = "malformed payload"
            return Response(response_data, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            """
                Make sure no validation error
            """
            episode_pk = sponge.clean(data["episode_pk"])
            playlist_pk = sponge.clean(data["playlist_pk"])
        except ValidationError as e: 
            response_data["detail"] = "Did you try to do something funky?"
            return Response(response_data, status=status.HTTP_400_BAD_REQUEST)

        try:
            """
                Make sure valid database objects
            """
            episode = Episode.objects.get(pk = episode_pk)
            playlist = Playlist.objects.get(pk = playlist_pk)
        except ObjectDoesNotExist as e:
            response_data["detail"] = "Could not find one or more items"
            return Response(response_data, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            #print(e)
            response_data["detail"] = "Something bad happened here"
            return Response(response_data, status=status.HTTP_400_BAD_REQUEST)

        if playlist.user != request.user:
            """
                XSS attack
            """
            response_data["detail"] = "Hacker..."
            return Response(response_data, status=status.HTTP_401_UNAUTHORIZED)

        try:
            epl = EPL.objects.get(playlist=playlist, episode=episode)
            epl.delete()
        except Exception as e:
            print(e)
            response_data["detail"] = "Something bad happened please try again later"
            return Response(response_data, status=status.HTTP_400_BAD_REQUEST)

        response_data["success"] = "success"
        return Response(response_data, status=status.HTTP_202_ACCEPTED)

    
    def get(self, request, format=None):
        # need user, playlist, or user, podcast
        pass


class Playlists(APIView):
    permission_classes = [permissions.IsAuthenticated, ValidEmail]

    def delete(self, request, format=None):
        """
            delete a playlist

            requires: 
                - playlist_pk, 
                - authenticated user with a valid email
                - user must own playlist... I would write a custom
                permissions class for that but too lazy
        """
        response_data = {}
        sponge = forms.CharField()
        cleaned_pk = ""
        data = request.data

        if "playlist_pk" not in data:
            """
                Make sure correct data in payload
            """
            response_data["detail"] = "malformed payload"
            return Response(response_data, status=status.HTTP_400_BAD_REQUEST)
        else:
            try:
                """
                    Make sure valid data in payload
                """
                cleaned_pk = sponge.clean(data["playlist_pk"])
            except ValidationError as e:
                response_data["detail"] = "Did you try to do something funky?"
                return Response(response_data, status=status.HTTP_400_BAD_REQUEST)

        try:
            del_playlist = Playlist.objects.get(pk=cleaned_pk)
        except Playlist.DoesNotExist as e:
            response_data["detail"] = "Could not find that"
            return Response(response_data, status=status.HTTP_400_BAD_REQUEST)

        if del_playlist.user != request.user:
            """
                XSS attack
            """
            response_data["detail"] = "Hacker..."
            return Response(response_data, status=status.HTTP_401_UNAUTHORIZED)

        try:
            del_playlist.delete()
        except Exception as e:
            response_data["detail"] = "Something went wrong :("
            return Response(response_data, status=status.HTTP_400_BAD_REQUEST)

        response_data["success"] = "successfully removed item."
        return Response(response_data, status=status.HTTP_201_CREATED)        


    def post(self, request, format=None):
        """
            Create a new playlist

            requires: name, authenticated user with a valid email
        """
        response_data = {}
        sponge = forms.CharField()
        bool_sponge = forms.BooleanField(required=False)
        cleaned_bool = ""
        cleaned_name = ""
        data = request.data
        """ 

        """
        if "name" not in data:
            """
                Make sure correct data in payload
            """
            response_data["detail"] = "malformed payload"
            return Response(response_data, status=status.HTTP_400_BAD_REQUEST)
        else:
            try:
                """
                    Make sure valid data in payload
                """
                cleaned_name = sponge.clean(data["name"])
            except ValidationError as e:
                response_data["detail"] = "I can't do that"
                return Response(response_data, status=status.HTTP_400_BAD_REQUEST)

            """
                Make sure user doesn't try anything silly
            """
            if len(cleaned_name) > 35:
                response_data["detail"] = "Name is too long (max length is 35 characters)"
                return Response(response_data, status=status.HTTP_400_BAD_REQUEST)

            if Playlist.objects.filter(user=request.user).count() > 15:
                response_data["detail"] = "Too many playlists!"
                return Response(response_data, status=status.HTTP_400_BAD_REQUEST)


            if "make_public" in data:
                try:
                    cleaned_bool = bool_sponge.clean(data["make_public"])
                except ValidationError as e:
                    response_data["detail"] = "Something went wrong"
                    return Response(response_data, status=status.HTTP_400_BAD_REQUEST)
            else:
                cleaned_bool = False
            

            numPlaylists = Playlist.objects.filter(user=request.user)
            if len(numPlaylists) >= 3:
                response_data["detail"] = "Only 3 playlists allowed... for now"
                return Response(response_data, status=status.HTTP_400_BAD_REQUEST)     

            new_playlist = Playlist(user = request.user, name=cleaned_name, public=cleaned_bool)

        try:
            new_playlist.save()
        except Exception as e:
            response_data["detail"] = "Something went wrong :("
            return Response(response_data, status=status.HTTP_400_BAD_REQUEST)

        response_data["pk"] = new_playlist.pk
        response_data["name"] = cleaned_name
        return Response(response_data, status=status.HTTP_201_CREATED)

    def get(self, request, format=None):

        # Check if we have a specific episode..
        response_data = {}

        try:
            playlists = Playlist.objects.filter(user=request.user)
        except Exception as e:
            print(e)
            response_data["detail"] = "Something went wrong. Please try again later"
            return Response(response_data, status=status.HTTP_400_BAD_REQUEST)

        playlists = PlaylistSerializer(playlists, context={'request':request}, many=True)
        return Response(playlists.data, status=status.HTTP_200_OK)
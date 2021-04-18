from django import forms
from django.http import Http404
from CustomPermissions import ValidEmail
from users.models import SoundFileUser
from podcasts.models import Episode
from userfeatures.models import EpisodeSavePoint
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import permissions, status
from userfeatures.serializers import EpisodeSavePointList, EpisodeSavePointDetail
from django.core.exceptions import ValidationError, ObjectDoesNotExist
from django.utils import timezone


class EpisodeSavePointView(APIView):
    """
        
    """
    permission_classes = [permissions.IsAuthenticated, ValidEmail]

    def post(self, request, format=None):
        """
            Payload: 
                {episode_pk: <int>,
                timestamp: <int>,
                }
        """
        response_data = {}
        episode = None
        episodeSavePoint = None
        cleaned_time = None
        int_sponge = forms.IntegerField()
        cleaned_episode_pk = None


        if ("episode_pk" not in request.data) or ("timestamp" not in request.data):
            response_data["detail"] = "Bad request"
            return Response(response_data, status=status.HTTP_400_BAD_REQUEST)

        try:
            cleaned_episode_pk = int(int_sponge.clean(request.data.get("episode_pk")))
        except ValidationError as e:
            response_data["detail"] ="Validation Error on episode_pk"
            return Response(response_data, status=status.HTTP_400_BAD_REQUEST)

        try:
            cleaned_time = int(int_sponge.clean(request.data.get("timestamp")))
        except ValidationError as e:
            response_data["detail"] = "Validation Error on time"
            return Response(response_data, status=status.HTTP_400_BAD_REQUEST)

        try:
            episode = Episode.objects.get(pk=cleaned_episode_pk)
        except Episode.DoesNotExist as e:
            raise Http404

        # For now, only allow for 6 episode save points per user
        
        episodeSavePoints = EpisodeSavePoint.objects.filter(user=request.user)
        if len(episodeSavePoints) > 60:
            try:
                episodeSavePoints.first().delete()
            except Exception as e:
                response_data["detail"] = "Something bad happened here"
                return Response(response_data, status=status.HTTP_400_BAD_REQUEST)
        

        # Does a save point for this episode already exist? 
        try:
            episodeSavePoint = EpisodeSavePoint.objects.get(episode=episode, user=request.user)
        except EpisodeSavePoint.DoesNotExist as e:
            # Does not exist
            episodeSavePoint = EpisodeSavePoint(episode=episode, user=request.user)
        else:
            pass


        episodeSavePoint.time = cleaned_time
        episodeSavePoint.created_at = timezone.now()
        try:
            episodeSavePoint.save()
        except Exception as e:
            response_data["detail"] = "Something went wrong"
            return Response(response_data, status=status.HTTP_400_BAD_REQUEST)
        else:
            response_data["success"]=True
            return Response(response_data, status=status.HTTP_200_OK)


    def get(self, request, format=None):
        """
            Get individual episode timestamp. Or all timestamps for user
        """
        episode_pk = request.query_params.get("episode_pk", None)
        cleaned_episode_pk = None
        episodeSavePoint = None
        episodeSavePointObj = None
        episode = None
        int_sponge = forms.IntegerField()
        response_data = {}

        if episode_pk is None:
            # Return all 

            save_points_query = EpisodeSavePoint.objects.filter(user=request.user).order_by('-created_at')[:6] # For now just take 6
            save_points = EpisodeSavePointList(save_points_query, many=True)

            return Response(save_points.data, status=status.HTTP_200_OK)
        else:

            try:
                # Validate query param
                cleaned_episode_pk = int(int_sponge.clean(request.query_params.get("episode_pk")))
            except ValidationError as e:
                #print(e)
                response_data["detail"] ="Validation Error on episode_pk"
                return Response(response_data, status=status.HTTP_400_BAD_REQUEST)
            
            try:
                # Get the episode
                episode = Episode.objects.get(pk=cleaned_episode_pk)
            except Episode.DoesNotExist as e:
                raise Http404

            try:
                episodeSavePointObj = EpisodeSavePoint.objects.get(episode=episode, user=request.user)
            except EpisodeSavePoint.DoesNotExist as e:
                # This 404 isn't necessarily a bad thing
                raise Http404

            episodeSavePoint = EpisodeSavePointDetail(episodeSavePointObj)
            return Response(episodeSavePoint.data, status=status.HTTP_200_OK)   




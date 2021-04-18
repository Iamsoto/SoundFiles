from django.shortcuts import render
from django import forms
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import permissions, status
from CustomPermissions import ValidEmail
from system.models import Flag
from userfeatures.models import EpisodeComment
from podcasts.models import Podcast
from django.core.exceptions import ValidationError
from django.utils import timezone
from datetime import datetime   


# Create your views here.
class SubmitFlag(APIView):
    permission_classes = [permissions.IsAuthenticated, ValidEmail]
    
    def post(self, request, format=None):
        """
                Payload in the form: 
                    {podcast_pk : pk <or> episode_comment_p: pk, reason: "blah blah"}
        """
        response_data = {}
        sponge = forms.CharField()
        reason = None
        flag = None

        # Get last submission time from user
        last_flag = Flag.objects.filter(user=request.user).order_by("-time").first()
        
        if last_flag is not None:
            if (datetime.now(timezone.utc) - last_flag.time).total_seconds() < 300:
                response_data["detail"] = "Flagging too much! Try again later please"
                return Response(response_data, status=status.HTTP_400_BAD_REQUEST)

        # Make sure the required information is here
        if ("episode_comment_pk" not in request.data ) and ("podcast_pk" not in request.data):
            response_data["detail"] = "Malformed data"
            return Response(response_data, status=status.HTTP_400_BAD_REQUEST)

        if "reason" not in request.data:
            response_data["detail"] ="Reason must be provided"
            return Response(response_data, status=status.HTTP_400_BAD_REQUEST)

        try:
            # extract the reason
            reason = sponge.clean(request.data.get("reason"))
        except ValidationError as e:
            response_data["detail"] ="Cannot validate the reason"
            return Response(response_data, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            reponse_data["detail"] ="Something weird happened. Please try again later"
            return Response(response_data, status=status.HTTP_400_BAD_REQUEST)


        if "episode_comment_pk" in request.data:
            # Try to get the associated comment
            comment = None
            try:
                comment = EpisodeComment.objects.get(pk=sponge.clean(request.data.get("episode_comment_pk")))
            except EpisodeComment.DoesNotExist as e:
                response_data["detail"] = "Could not find that comment"
                return Response(response_data, status=status.HTTP_400_BAD_REQUEST)
            except Exception as e:
                response_data["detail"] = "Something went wrong"
                return Response(response_data, status=status.HTTP_400_BAD_REQUEST)

            # At this point we should have the comment, and the reason. So save this!
            try:
                flag = Flag(episode_comment=comment, reason=reason, user=request.user)
                flag.save()
                response_data["success"] = "Your input has been submitted!"
                return Response(response_data, status=status.HTTP_201_CREATED)
            except Exception as e:
                response_data["detail"] = "Something went wrong. Please try again later"
                return Response(response_data, status=status.HTTP_400_BAD_REQUEST)

        elif "podcast_pk" in request.data:
            # Try to get the associated podcast
            podcast = None
            try:
                podcast = Podcast.objects.get(pk=sponge.clean(request.data.get("podcast_pk")))
            except Podcast.DoesNotExist as e:
                response_data["detail"] = "Could not find that podcast"
                return Response(response_data, status=Status.HTTP_400_BAD_REQUEST)
            except Exception as e:
                response_data["detail"] = "Something funky happened. Please try again later"
                return Response(response_data, status=status.HTTP_400_BAD_REQUEST)

            # at this point we should have the podcast and the reason. So save!
            try:
                flag = Flag(podcast= podcast, reason=reason, user=request.user)
                flag.save()
                response_data["success"] = "Your input has been submitted!"
                return Response(response_data, status=status.HTTP_201_CREATED)
            except Exception as e:
                response_data["detail"] = "Something went bad. Please try again later"
                return Response(response_data, status=status.HTTP_400_BAD_REQUEST)



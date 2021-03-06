from django import forms
from django.http import Http404
from CustomPermissions import ValidEmail
from users.models import SoundFileUser
from podcasts.models import Podcast
from userfeatures.models import Playlist, Subscription, EpisodeCommentNotification
from userfeatures.serializers import SubSerializer

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import permissions, status, throttling
from django.utils import timezone


from django.core.exceptions import ValidationError, ObjectDoesNotExist
from django.utils import timezone


class SubThrottle(throttling.UserRateThrottle):
    rate ='3/minute'


class SubscribeUnseen(APIView):
    """
        View new subscribtions
    """
    permission_classes = [permissions.IsAuthenticated, ValidEmail]
    def get(self, request, format=None):

        response_data = {}
        count = 0
        query = Subscription.objects.filter(user = request.user)
        for sub in query:
            if sub.sub_type == "playlist":
                if sub.playlist.update_time > sub.update_time:
                    count +=1 # User hasn't seen this yet

            elif sub.sub_type == "podcast":
                if sub.podcast.update_time > sub.update_time:
                    count +=1
        
        response_data["count"] = count

        return Response(response_data, status=status.HTTP_200_OK)
    
    def post(self, request, format=None):
        """
            Set a subscription to seen
        """
        response_data = {}
        sponge=forms.CharField(required=False)
        sub = None
        
        if 'sub_pk' not in request.data:
            response_data["detail"] = "malformed payload"
            return Response(response_data, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            # Get Subscription
            sub = Subscription.objects.get(pk=sponge.clean(request.data.get("sub_pk")))
        except Subscription.DoesNotExist as e:
            response_data["detail"] = "Could not find Subscription"
            return Response(response_data, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            #print(e)
            response_data["detail"] = "Something went kinda wrong"
            return Response(response_data, status=status.HTTP_400_BAD_REQUEST)                

        if sub.user != request.user:
            """
                XSS attack
            """
            response_data["detail"] = "No means no!"
            return Response(response_data, status=status.HTTP_400_BAD_REQUEST)             
             
        
        sub.update_time=timezone.now()

        try:
            sub.save()
        except Exception as e:
            response_data["detail"] = "Something went really wrong"
            return Response(response_data, status=status.HTTP_400_BAD_REQUEST)


        response_data["success"] = "true"
        return Response(response_data, status=status.HTTP_200_OK)


class SubscribeView(APIView):
    """
        Return list of podcast user is subscribed to
        Along with a notifier to notify if the podcast has been updated since the user last viewed
    """
    permission_classes = [permissions.IsAuthenticated, ValidEmail]
    def get(self, request, format=None):
        """
            Return the subscriptions for a given user
        """
        num = int(request.query_params.get("num", 6))
        query = Subscription.objects.filter(user = request.user)[:num]
        subs = SubSerializer(query, many=True)
        return Response(subs.data, status=status.HTTP_200_OK)



class SubmitSubscribe(APIView):
    """
        
    """
    permission_classes = [permissions.IsAuthenticated, ValidEmail]
    throttle_classes = [SubThrottle]

    def post(self, request, format=None):
        """
            Add new subscription
            Payload: 
                {pk: <int>
                type: 'playlist' or 'podcast',
                }
        """
        response_data = {}
        db = None
        cleaned_type = None
        int_sponge = forms.IntegerField()
        char_sponge = forms.CharField()
        cleaned_pk = None


        if ("type" not in request.data) or ("pk" not in request.data):
            print(request.data)
            response_data["detail"] = "uh oh..."
            return Response(response_data, status=status.HTTP_400_BAD_REQUEST)

        try:
            cleaned_pk = int(int_sponge.clean(request.data.get("pk")))
        except ValidationError as e:
            response_data["detail"] ="Validation Error on pk"
            return Response(response_data, status=status.HTTP_400_BAD_REQUEST)
        try:
            cleaned_type = char_sponge.clean(request.data.get("type"))
        except ValidationError as e:
            response_data["detail"] ="Validation Error on pk"
            return Response(response_data, status=status.HTTP_400_BAD_REQUEST)

        if cleaned_type == "podcast":
            try:
                obj = Podcast.objects.get(pk=cleaned_pk)
            except Episode.DoesNotExist as e:
                raise Http404
        elif cleaned_type == "playlist":
            try:
                obj = Playlist.objects.get(pk=cleaned_pk)
            except Episode.DoesNotExist as e:
                raise Http404
        else:
            response_data["detail"]="Could not find that object"
            return Response(request_data, status=status.HTTP_400_BAD_REQUEST)     

        
        try:
            if cleaned_type == 'podcast':
                sub = Subscription.objects.get(podcast=obj, user=request.user, sub_type="podcast")
            else:
                sub = Subscription.objects.get(playlist=obj, user=request.user, sub_type="playlist")
        except Subscription.DoesNotExist as e:
            """
               Create New subscription
            """

            # For now, only allow for 5 subscriptions per user
            subscriptions = Subscription.objects.filter(user=request.user)
            if len(subscriptions) >= 6:
                response_data["detail"] = "Only 6 Subscribes allowed... for now"
                return Response(response_data, status=status.HTTP_400_BAD_REQUEST)

            if cleaned_type == 'podcast':
                sub = Subscription(podcast=obj, user=request.user, sub_type="podcast")

            else:
                sub = Subscription(playlist=obj, user=request.user, sub_type="playlist")

                # We have to notify!
                if request.user.pk != obj.user.pk:  
                    
                    ecn = EpisodeCommentNotification.objects.filter(user_notified=obj.user, 
                        playlist= obj, notify_type="playlist-sub").first()

                    if ecn is not None:
                        ecn.seen = False;
                        ecn.update_time = timezone.now();
                        ecn.count += 1
                    else:
                        ecn = EpisodeCommentNotification(
                            user_notified=obj.user, 
                            playlist=obj,
                            notify_type="playlist-sub",
                            count=1)
                    try:
                        ecn.save()
                    except Exception as e:
                        pass # ??

            # Save the newly created sub
            try:
                sub.save()
            except Exception as e:
                response_data["detail"] = "Something went wrong. Please try again later"
                return Response(response_data, status=status.HTTP_400_BAD_REQUEST)
            else:
                response_data["success"] = "Sub created !"
                return Response(response_data, status=status.HTTP_201_CREATED)

        else:
            # Does a save point for this episode already exist? Delete that shit
            sub.delete()
            response_data["success"]="Sub deleted"
            return Response(response_data, status=status.HTTP_200_OK)
        







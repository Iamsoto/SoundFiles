from django import forms
from django.conf import settings
from django.http import Http404
from django.core.exceptions import ValidationError, ObjectDoesNotExist
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import permissions, status, throttling
from CustomPermissions import ValidEmail
from datetime import datetime
from podcasts.models import Episode, Podcast
from userfeatures.models import (EpisodeCommentLike, EpisodeComment, EpisodeLike, 
    Playlist, PlaylistLike, PodcastLike, EpisodeCommentNotification)
from django.utils import timezone



class LikeThrottle(throttling.UserRateThrottle):
    rate ='2/minute'


class PodcastLikeSubmit(APIView):

    permmission_classes = [permissions.IsAuthenticated, ValidEmail]

    def post(self, request, format=None):
        """
            Like a podcast...
        """        
        response_data={}
        sponge= forms.IntegerField(required = False)
        playlist = None

        if "podcast_pk" not in request.data:
            response_data["detail"] = "Bad Request"
            return Response(response_data, status=status.HTTP_400_BAD_REQUEST)
        try:
            podcast = Podcast.objects.get(pk = int(sponge.clean(request.data.get("podcast_pk"))))
        except ValidationError as e:
            response_data["detail"] ="Validation error"
            return Response(response_data, status=status.HTTP_400_BAD_REQUEST)
        except Podcast.DoesNotExist as e:
            response_data["detail"] = "podcast does not exist"
            return Response(response_data, status=status.HTTP_400_BAD_REQUEST)

        like = PodcastLike.objects.filter(podcast = podcast, user=request.user).first()

        if like is None:
            try:
                like = PodcastLike(podcast=podcast, user=request.user).save()
            except Exception as e:
                response_data["detail"] = "Something happened"
                return Response(response_data, status=status.HTTP_400_BAD_REQUEST)
            else:

                response_data["success"] = "liked"
                return Response(response_data, status=status.HTTP_201_CREATED)
        else:
            try:
                like.delete()
            except Exception as e:
                response_data["detail"]="Something bad happened"
                return Response(response_data,status=status.HTTP_400_BAD_REQUEST)
            else:
                response_data["success"]="Removed like"
                return Response(response_data,status=status.HTTP_200_OK)


class PlaylistLikeSubmit(APIView):
    permission_classes = [permissions.IsAuthenticated, ValidEmail]

    def post(self, request, format=None):
        response_data={}
        sponge= forms.IntegerField(required = False)
        playlist = None
        ecn = None

        if "playlist_pk" not in request.data:
            response_data["detail"] = "Bad Request"
            return Response(response_data, status=status.HTTP_400_BAD_REQUEST)
        try:
            playlist = Playlist.objects.get(pk = int(sponge.clean(request.data.get("playlist_pk"))))
        except ValidationError as e:
            response_data["detail"] ="Validation error"
            return Response(response_data, status=status.HTTP_400_BAD_REQUEST)
        except Playlist.DoesNotExist as e:
            response_data["detail"] = "Playlist does not exist"
            return Response(response_data, status=status.HTTP_400_BAD_REQUEST)

        if not playlist.public:
            response_data["detail"] = "Not a public playlist"
            return Response(response_data, status=status.HTTP_400_BAD_REQUEST)

        like = PlaylistLike.objects.filter(playlist = playlist, user=request.user).first()

        if like is None:
            try:
                like = PlaylistLike(playlist=playlist, user=request.user).save()
            except Exception as e:
                response_data["detail"] = "Something happened"
                return Response(response_data, status=status.HTTP_400_BAD_REQUEST)
            else:

                if request.user.pk != playlist.user.pk:  
                    # User didn't like this themselves
                    
                    ecn = EpisodeCommentNotification.objects.filter(user_notified=playlist.user, playlist= playlist, notify_type="playlist-like").first()

                    if ecn is not None:
                        ecn.seen = False;
                        ecn.update_time = timezone.now();
                        ecn.count += 1

                    else:

                        ecn = EpisodeCommentNotification(user_notified=playlist.user, 
                            playlist=playlist,
                            notify_type="playlist-like",
                            count=1)

                    try:
                        ecn.save()
                    except Exception as e:
                        pass # ??

                response_data["success"] = "liked"
                return Response(response_data, status=status.HTTP_201_CREATED)
        else:
            try:
                like.delete()
            except Exception as e:
                response_data["detail"]="Something bad happened"
                return Response(response_data,status=status.HTTP_400_BAD_REQUEST)
            else:
                response_data["success"]="Removed like"
                return Response(response_data,status=status.HTTP_200_OK)


class EpisodeLikeSubmit(APIView):
    """
        Post a like to a comment
    """
    permission_classes = [permissions.IsAuthenticated, ValidEmail]

    def post(self, request, format=None):
        response_data={}
        sponge = forms.IntegerField(required=False)
        episode = None

        if "episode_pk" not in request.data:
            response_data["detail"] = "Bad request"
            return Response(response_data, status=status.HTTP_400_BAD_REQUEST)

        try:
            episode = Episode.objects.get(pk = int(sponge.clean(request.data.get("episode_pk"))))
        except ValidationError as e:
            response_data["detail"] = "Validation error"
            return Response(response_data, status=status.HTTP_400_BAD_REQUEST)
        except Episode.DoesNotExist as e:
            response_data["detail"] = "episode does not exist"
            return Response(response_data, status=status.HTTP_400_BAD_REQUEST)

        like = EpisodeLike.objects.filter(episode = episode, user = request.user).first()
        
        if like is None:
            # Create a new like with this user
            try:
                like = EpisodeLike(episode=episode, user=request.user).save()
            except Exception as e:
                response_data["detail"]="something happened"
                return Response(response_data,status=status.HTTP_400_BAD_REQUEST)

            else:
                response_data["success"]="Liked!"

                return Response(response_data, status=status.HTTP_201_CREATED)
        else: 
            # Comment already exists, remove it
            try:
                like.delete()
            except Exception as e:
                response_data["detail"]="Something bad happened"
                return Response(response_data,status=status.HTTP_400_BAD_REQUEST)
            else:
                response_data["success"]="Removed like"
                return Response(response_data,status=status.HTTP_200_OK)


class EpisodeCommentLikeSubmit(APIView):
    """
        Post a like to a comment
    """
    permission_classes = [permissions.IsAuthenticated, ValidEmail]
    throttle_classes = [LikeThrottle]
    def post(self, request, format=None):
        response_data={}
        sponge = forms.IntegerField(required=False)
        comment = None

        if "comment_pk" not in request.data:
            response_data["detail"] = "Bad request"
            return Response(response_data, status=status.HTTP_400_BAD_REQUEST)

        try:
            comment = EpisodeComment.objects.get(pk = int(sponge.clean(request.data.get("comment_pk"))))
        except ValidationError as e:
            response_data["detail"] = "Validation error"
            return Response(response_data, status=status.HTTP_400_BAD_REQUEST)
        except EpisodeComment.DoesNotExist as e:
            response_data["detail"] = "comment does not exist"
            return Response(response_data, status=status.HTTP_400_BAD_REQUEST)

        like = EpisodeCommentLike.objects.filter(episode_comment = comment, user = request.user).first()
        
        if like is None:
            # Create a new like with this user
            try:
                like = EpisodeCommentLike(episode_comment=comment, user=request.user).save()
            except Exception as e:
                response_data["detail"]="something happened"
                return Response(response_data,status=status.HTTP_400_BAD_REQUEST)

            else:
                response_data["success"]="Liked!"
                
                # Update comment's update time !
                try:
                    comment.update_time = timezone.now()
                    comment.save()
                except Exception as e:
                    pass
                if comment.parent is not None:
                    try:
                        comment.parent.update_time = timezone.now()
                    except Exception as e:
                        print(e)
                        pass

                # Update appropriate notification
                poster = comment.user
                if poster.pk != request.user.pk:
                    # Person didn't just reply to him/herself
                    notification = EpisodeCommentNotification.objects.filter(episodeComment=comment, 
                        user_notified=poster, notify_type="like").first()
                    if notification is not None:
                        notification.seen = False
                        notification.count += 1
                        notification.update_time = timezone.now()
                    else:
                        notification = EpisodeCommentNotification(episodeComment=comment, 
                            user_notified=poster, notify_type="like", seen=False, count=1)
                
                # check for spamming
                #notifications.objects.filter(episodeComment=comment, user_notified=poster)
                try:
                    notification.save()
                except Exception as e:
                    print(e) # ??
                    pass

                return Response(response_data, status=status.HTTP_201_CREATED)
        else: 
            # Comment already exists, remove it
            try:
                like.delete()
            except Exception as e:
                response_data["detail"]="Something bad happened"
                return Response(response_data,status=status.HTTP_400_BAD_REQUEST)
            else:
                response_data["success"]="Removed like"
                return Response(response_data,status=status.HTTP_200_OK)


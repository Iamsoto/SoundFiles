from django import forms
from django.conf import settings
from django.http import Http404
from django.core.exceptions import ValidationError
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import permissions, status, pagination, generics


from userfeatures.models import EpisodeComment
from datetime import datetime
from django.utils import timezone

from CustomPermissions import ValidEmail


from podcasts.models import Episode
from users.models import SoundFileUser
from userfeatures.models import Playlist, EpisodeComment, EpisodeCommentNotification
from userfeatures.serializers import (
    EpisodeCommentSerializerRootList,
    EpisodeCommentSerializerRootCreate,
    EpisodeCommentSerializerReplyList,
    EpisodeCommentSerializerReplyCreate,
    EpisodeCommentSerializerRootDetail)


class CommentPagination(pagination.PageNumberPagination):
    page_size = 10
    page_size_query_param = 'page_size'
    page_query_param = 'page'
    

    def get_paginated_response(self, data):
        return Response({
            'links': {
               'next': self.get_next_link(),
               'previous': self.get_previous_link()
            },
            'count': self.page.paginator.count,
            'total_pages': self.page.paginator.num_pages,
            'results': data
        })


class EpisodeCommentReplyCreate(APIView):
    """
        Create Episodecomment-replies
    """
    permission_classes = [permissions.IsAuthenticated, ValidEmail]
    
    def post(self, request, format=None):
        """
            Post Reply Comment
            Payload in the form: 
                {comment_pk : pk, comment_data: {...}}
        """
        response_data = {}
        comment = None
        new_comment = None
        sponge = forms.CharField()
        cleaned_text = ""
        
        
        last_ec = EpisodeComment.objects.filter(user=request.user).order_by("-post_date").first()
        
        if last_ec is not None:
            if (datetime.now(timezone.utc) - last_ec.post_date).total_seconds() / 60 < 3:
                response_data["detail"] = "Too many comments. Cool off and grab a cup of coffee then try again."
                return Response(response_data, status=status.HTTP_400_BAD_REQUEST)            

        if ("comment_pk" not in request.data ) or "comment_data" not in request.data:
            response_data["detail"] = "Malformed data"
            return Response(response_data, status=status.HTTP_400_BAD_REQUEST)                
        
        try:
            comment = EpisodeComment.objects.get(pk=sponge.clean(request.data.get("comment_pk")))
        except EpisodeComment.DoesNotExist as e:
            response_data["detail"] = "Could not find that comment"
            return Response(response_data, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            print(e)
            response_data["detail"] = "Something went wrong"
            return Response(response_data, status=status.HTTP_400_BAD_REQUEST)
            
        try:
            cleaned_text = sponge.clean(request.data.get("comment_data").get("text"))
        except ValidationError as e:
            response_data["detail"] = "Couldn't validate this input"
            return Response(response_data, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            response_data["detail"] = "something bad happened"
            return Response(response_data, status=status.HTTP_400_BAD_REQUEST)

        try:
            new_comment = EpisodeComment(text = cleaned_text, user= request.user, parent=comment)
            new_comment.insert_at(comment, position='first-child', save=True)
            new_comment.save()
        except Exception as e:
            print(e)
            response_data["detail"] = "Something bad happened"
            return Response(response_data, status=status.HTTP_400_BAD_REQUEST)

        try:
            """
                1) Update the comment's update time
                
            """
            comment.update_time = timezone.now()
            comment.save()

        except Exception as e:
            #print(e)
            pass #??

        # 2) Create a notification for the parent comment's user 
        poster = comment.user
        if poster.pk != request.user.pk:
            # Person didn't just reply to him/herself
            notification = EpisodeCommentNotification.objects.filter(episodeComment=comment, 
                user_notified=poster, notify_type="reply").first()
            if notification is not None:
                notification.seen = False;
                notification.count += 1
                notification.update_time = timezone.now()
            else:
                notification = EpisodeCommentNotification(episodeComment=comment, user_notified=poster, 
                    notify_type="reply", seen=False, count=1)

        try:
            notification.save()
        except Exception as e:
            print(e) # ??
            pass

        response_data["success"] = "true"
        return Response(response_data, status=status.HTTP_201_CREATED)    


class EpisodeCommentRootCreate(APIView):
    """
        Create Root Episode comment
    """
    permission_classes = [permissions.IsAuthenticated, ValidEmail]
    
    def post(self, request, format=None):
        """
        Post a Root Episode Comment
            Payload in the form: 
                {episode_pk: pk, comment_data: {...}}
        """
        response_data = {}
        episode = None
        comment = None
        new_comment = None
        sponge = forms.CharField()

        
        last_ec = EpisodeComment.objects.filter(user=request.user).order_by("-post_date").first()
        
        if last_ec is not None:
            if (datetime.now(timezone.utc) - last_ec.post_date).total_seconds() / 60 < 1:
                # prevent user from shit posting
                response_data["detail"] = "Too many comments. Cool off and grab a cup of coffee then try again."
                return Response(response_data, status=status.HTTP_400_BAD_REQUEST)            

        if ("episode_pk" not in request.data ) or "comment_data" not in request.data:
            response_data["detail"] = "Malformed data"
            return Response(response_data, status=status.HTTP_400_BAD_REQUEST)
        

        try:
            # Get episode object
            episode = Episode.objects.get(pk=sponge.clean(request.data.get("episode_pk")))
        except Episode.DoesNotExist as e:
            response_data["detail"] = "Could not find episode"
            return Response(response_data, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            response_data["detail"] = "Something went wrong"
            return Response(response_data, status=status.HTTP_400_BAD_REQUEST)                

        try:
            # Get Episode comment
            new_comment = EpisodeCommentSerializerRootCreate(data=request.data.get("comment_data"))
            if(new_comment.is_valid()):
                new_comment.save(episode=episode, user=request.user)
            else:
                pass
                #print(new_comment.errors)
        except Exception as e:
            response_data["detail"] = "Something bad happened"
            return Response(response_data, status=status.HTTP_400_BAD_REQUEST)


        response_data["success"] = "true"
        return Response(response_data, status=status.HTTP_201_CREATED)


class EpisodeCommentDetail(generics.ListAPIView):
    """
        View a specific comment
        No Permission needed
    """
    serializer_class = EpisodeCommentSerializerRootDetail
    lookup_url_kwarg = 'pk'

    def get_queryset(self):
        sponge = forms.CharField(required = False)
        try: 
            pk = sponge.clean(self.kwargs.get(self.lookup_url_kwarg))
        except ValidationError as e:
            raise Http404

        if int(pk) < 0:
            raise Http404

        return EpisodeComment.objects.filter(pk =pk)


class EpisodeCommentRootList(generics.ListAPIView):
    """
        View comments given an episode_pk
        No permissions needed
    """ 
    serializer_class = EpisodeCommentSerializerRootList
    pagination_class = CommentPagination    
    lookup_url_kwarg = 'pk'

    def get_queryset(self):
        sponge = forms.CharField(required = False)
        try:
            pk = sponge.clean(self.kwargs.get(self.lookup_url_kwarg))
        except ValidationError as e:
            raise Http404

        if int(pk) < 0:
            raise Http404

        return EpisodeComment.objects.filter(episode__pk = pk)


class EpisodeCommentReplyList(APIView):
    """
        View comments
        No permissions needed
    """ 
    def get(self, request, pk=-1, format=None):
        sponge = forms.IntegerField(required = False)
        response_data={}
        if int(pk) < 0:
            raise Http404

        try:
            num_return = int(sponge.clean(request.query_params.get("load_more",3)))
        except Exception as e:
            response_data["detail"] = "Something bad happened"            
            return Response(response_data, status=status.HTTP_400_BAD_REQUEST)

        if num_return > 125 :
            num_return = 125 # Don't worry about giant responses just yet

        replies = EpisodeComment.objects.filter(parent__pk = pk)
        total_count = replies.count()
        replies_serealized = EpisodeCommentSerializerReplyList(replies[:num_return], context={'request': request}, many = True)

        response_data["results"] = replies_serealized.data
        response_data["count"] = total_count

        return Response(response_data, status=status.HTTP_200_OK)


class EpisodeCommentAtTime(APIView):
    """
        View a random comment at a specific time
    """
    def get(self, request, pk, format=None):
        pass


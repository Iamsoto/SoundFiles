from django import forms
from django.http import Http404
from rest_framework.views import APIView
from rest_framework import permissions, status, pagination, generics
from CustomPermissions import ValidEmail
from userfeatures.models import EpisodeCommentNotification
from userfeatures.serializers import EpisodeCommentNotificationList
from rest_framework.response import Response


class EpisodeCommentNotificationPagination(pagination.PageNumberPagination):
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


class UnseenNotifications(APIView):

    permission_classes = [permissions.IsAuthenticated, ValidEmail]
    def get(self, request, format=None):
        response_data = {}
        response_data["count"] =  EpisodeCommentNotification.objects.filter(user_notified=request.user, seen=False).count()
        return Response(response_data, status=status.HTTP_200_OK)

    def post(self, request, format=None):
        """
            Post a specific notification to indicate its been seen
        """
        response_data = {}
        sponge=forms.CharField(required=False)
        if 'ecNotification_pk' not in request.data:
            response_data["detail"] = "malformed payload"
            return Response(response_data, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            # Get notification
            ec_notification = EpisodeCommentNotification.objects.get(pk=sponge.clean(request.data.get("ecNotification_pk")))
        except EpisodeCommentNotification.DoesNotExist as e:
            response_data["detail"] = "Could not find notification"
            return Response(response_data, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            #print(e)
            response_data["detail"] = "Something went kinda wrong"
            return Response(response_data, status=status.HTTP_400_BAD_REQUEST)                


        ec_notification.seen=True

        try:
            ec_notification.save()
        except Exception as e:
            response_data["detail"] = "Something went really wrong"
            return Response(response_data, status=status.HTTP_400_BAD_REQUEST)


        response_data["success"] = "true"
        return Response(response_data, status=status.HTTP_200_OK)




class EpisodeCommentNotifications(generics.ListAPIView):
    """
        Receive the episode comment notifications for a given user
    """
    permission_classes = [permissions.IsAuthenticated, ValidEmail]
    serializer_class = EpisodeCommentNotificationList
    pagination_class = EpisodeCommentNotificationPagination

    def get_queryset(self):
        query =  EpisodeCommentNotification.objects.filter(user_notified = self.request.user)
        return query


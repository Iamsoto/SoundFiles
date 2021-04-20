from django.http import Http404
from podcasts.models import Episode
from rest_framework import generics
from podcasts.serializers import EpisodeSerializerList, EpisodeSerializerDetail
from podcasts.models import Episode
from rest_framework import pagination, status
from rest_framework.response import Response
from rest_framework.views import APIView
from django.db.models import Count


class EpisodeDetailView(APIView):
    def get(self, request, pk, format=None):
        response_data = {}

        try:
            episode = Episode.objects.get(pk = pk)
        except Episode.DoesNotExist as e:
            raise Http404
        
        episode_serializer = EpisodeSerializerDetail(episode, context={"request":request})
        return Response(episode_serializer.data, status = status.HTTP_200_OK) 


class CustomPagination(pagination.PageNumberPagination):
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


class EpisodeList(generics.ListAPIView):

    serializer_class = EpisodeSerializerList
    pagination_class = CustomPagination

    def get_queryset(self):
        """
            TODO: Add search filter, and filter by likes

        """
        podcast_pk = self.request.query_params.get('podcast', None)
        asc = self.request.query_params.get('asc', 'False')
        order_by = self.request.query_params.get('order_by', 'time')
        try:
            queryset = Episode.objects.filter(podcast__pk=podcast_pk)
        except Episode.DoesNotExist as e:
            raise Http404

        if order_by == 'likes':
            queryset = queryset.annotate(num_likes=Count('likes'))
            if asc == 'False' or asc == 'false':
                queryset = queryset.order_by('-num_likes')
            else: # ascending
                queryset = queryset.order_by('num_likes')

        else: # time
            if asc == 'False' or asc =='false':
                # descending
                queryset = queryset.order_by("-pub_date")
            else:
                queryset = queryset.order_by("pub_date")

        return queryset


from django.http import Http404
from rest_framework.views import APIView
from podcasts.models import Category
from podcasts.serializers import PodcastSerializer, PodcastSerializerSmall, CategorySerializer
from rest_framework import permissions, status, generics, pagination
from rest_framework.response import Response
from podcasts.models import Podcast, Episode
from django.db.models import Count
from podcasts.models import PodcastCategory
import json

class GetCategories(APIView):
    """
        No permissions required for this
    """
    def get(self, request, format=None):
        response_data ={}
        try:
            categories = Category.objects.all()
        except Exception as e:
            response_data["detail"] = "Something bad happened here. Please come again later"
            return Response(response_data, status=status.HTTP_400_BAD_REQUEST)

        categorySerializer = CategorySerializer(categories, many=True)
        return Response(categorySerializer.data, status=status.HTTP_200_OK)


class PodcastDetailView(APIView):
    """
        TODO: This should really be called "po view"

    """
    def get(self, request, pk, format=None):
        response_data = {}
        try:
            podcast = Podcast.objects.get(pk = pk)
        except Podcast.DoesNotExist as e:
            raise Http404
        
        podcastSerializer = PodcastSerializer(podcast, context={"request":request})
        return Response(podcastSerializer.data, status = status.HTTP_200_OK)


"""
    Landing page - Search by:
    -   Popularity (weeks, months)
    -   Subscriptions
    -   Playlists
    - Generic Search (name, author, genre)

"""

class SearchPodcasts(generics.ListAPIView):
    serializer_class = PodcastSerializerSmall


    def get_queryset(self):
        """
           TODO: search by 
            Name - Done
            Author
            Genre/Topics

        """
        search_string = self.request.query_params.get('q', None)
        load_amount = int(self.request.query_params.get('num', 6))
        search_by = self.request.query_params.get('search_by','title')
        queryset=[]
        
        if load_amount < 0:
            load_amount = 6

        if load_amount > 50:
            load_amount = 50

        if search_by == "title":
            queryset = Podcast.objects.filter(name__icontains=search_string, inReview=False)\
            .annotate(num_likes=Count('likes'))\
            .order_by('-indexPopularityScore', 'num_likes')[:load_amount]
        elif search_by == "author":
            queryset = Podcast.objects.filter(author__icontains=search_string, inReview=False)\
            .annotate(num_likes=Count('likes'))\
            .order_by('-indexPopularityScore', 'num_likes')[:load_amount]

        return queryset

class PodcastByGenre(generics.ListAPIView):
    """
        No permissions required here
    """
    serializer_class = PodcastSerializerSmall
    def get_queryset(self):
        genre = self.request.query_params.get('category', None)
        load_amount = int(self.request.query_params.get('num', 6))
        if load_amount < 6:
            load_amount = 6
        if load_amount > 50:
            load_amount = 50

        if genre is None:
            return Podcast.objects.filter(inReview=False)[:load_amount]
        else:
            return Podcast.objects.filter(inReview=False, category_links__category__name=genre).annotate(num_likes=Count('likes')).order_by('-num_likes', '-indexPopularityScore')


class PopularPodcasts(generics.ListAPIView):
    
    serializer_class = PodcastSerializerSmall
    
    def get_queryset(self):
        """

        """
        query_string = self.request.query_params.get('q', None)
        load_amount = int(self.request.query_params.get('num', 6))

        if load_amount > 24:
            load_amount = 24
        if load_amount < 6:
            load_amount = 6
        if query_string == 'soundfiles':
            # For now, just return all time popular podcasts...
            return Podcast.objects.filter(inReview=False).annotate(num_likes=Count('likes')).order_by('-num_likes', '-indexPopularityScore')[:load_amount]
        elif query_string == 'global':
           return  Podcast.objects.filter(inReview=False, indexPopularityScore=1)[:load_amount]

        return Podcast.objects.filter(inReview=False)[:load_amount]



class Subscriptions(APIView):
    pass


class Playlists(APIView):
    pass


class GenericSearch(APIView):
    pass


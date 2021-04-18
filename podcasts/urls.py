from django.urls import path
from . import views



urlpatterns = [
    path('<int:pk>', views.PodcastDetailView.as_view(), name="podcast_index"),
    path('inspect_xml', views.InspectXML.as_view(), name='xml_form'),
    path('inspect_url', views.InspectURL.as_view(), name='url_form'),
    path('submit', views.RSSFormSubmit.as_view(), name='submit_form'),
    path('get_episodes', views.EpisodeList.as_view(), name = 'episodeList'),
    path('search', views.SearchPodcasts.as_view(), name='search'),
    path('get_popular', views.PopularPodcasts.as_view(), name='popular'),
    path('get_categories', views.GetCategories.as_view(), name='get_categories'),
    path('podcast_by_genre',views.PodcastByGenre.as_view(), name='podcast_by_genre'),
    path('episode_detail/<int:pk>',views.EpisodeDetailView.as_view(), name='episode_detail' )
]
from django.contrib import admin
from django.urls import path
from userfeatures import views

app_name = 'userfeatures'
urlpatterns = [
   path('account', views.Playlists.as_view(), name="account"),
   path('playlists', views.Playlists.as_view(), name="list-playlists"),
   path('playlists_popular', views.PlaylistsPopular.as_view(), name="list-playlists-popular"),
   path('playlist_detail/<int:pk>', views.PlaylistDetail.as_view(), name="detail-playlist"),
   path('episode_playlists', views.EpisodePlaylist.as_view(), name="create-episode-playlist"),
   path('episode_comments_root_list/<int:pk>', views.EpisodeCommentRootList.as_view(), name="episode-comments-root-list"),
   path('episode_comment_detail/<int:pk>', views.EpisodeCommentDetail.as_view(), name="episode-comment-detail"),
   path('episode_comment_root_create', views.EpisodeCommentRootCreate.as_view(), name="create-episode-comment"),
   path('episode_comment_reply_list/<int:pk>', views.EpisodeCommentReplyList.as_view(), name="episode-comment-reply-create"),
   path('episode_comment_reply_create', views.EpisodeCommentReplyCreate.as_view(), name="episode-comment-reply-list"),
   path('episode_comment_like', views.EpisodeCommentLikeSubmit.as_view(), name="episode-comment-like"),
   path('playlist_like', views.PlaylistLikeSubmit.as_view(), name="Playlist-like"),
   path('episode_like', views.EpisodeLikeSubmit.as_view(), name="episode-like"),
   path('podcast_like', views.PodcastLikeSubmit.as_view(), name="podcast-like"),
   path('episode_save_point', views.EpisodeSavePointView.as_view(), name="episode-save-point"),
   path('episode_comment_notifications', views.EpisodeCommentNotifications.as_view(), name="episode-comment-notifications"),
   path('episode_comment_notifications_unseen', views.UnseenNotifications.as_view(), name="episode-comment-notifications-unseen"),
   path('user_profile', views.UserProfileView.as_view(), name="user-profile"),
   path('subscribe', views.SubmitSubscribe.as_view(), name="subscribe"),
   path('subscription', views.SubscribeView.as_view(), name="subscription"),
   path('subscribe_unseen', views.SubscribeUnseen.as_view(), name="subscription-unseen"),

]   

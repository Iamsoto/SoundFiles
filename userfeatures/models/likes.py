from django.db import models
from django.conf import settings
from users.models import SoundFileUser
from podcasts.models import Podcast, Episode
from . import EpisodeComment, Playlist


class EpisodeCommentLike(models.Model):
    user = models.ForeignKey(SoundFileUser, 
        on_delete=models.SET_NULL, 
        related_name="comment_likes",
        blank=True, null=True)

    episode_comment = models.ForeignKey(EpisodeComment, 
        on_delete=models.CASCADE,
        related_name="likes",
        blank=False, null=False)

    date = models.DateTimeField(auto_now_add=True, blank=True, null=True)


class PlaylistLike(models.Model):
    user = models.ForeignKey(SoundFileUser, 
        on_delete=models.SET_NULL,
        related_name="playlist_likes",
        blank=True, null=True)

    playlist = models.ForeignKey(Playlist,
        on_delete=models.CASCADE,
        related_name="likes",
        blank=False, null=False)

    date = models.DateTimeField(auto_now_add=True, blank=True, null=True)


class PodcastLike(models.Model):
    user = models.ForeignKey(SoundFileUser,
        on_delete=models.SET_NULL,
        related_name="podcast_likes",
        blank=True, null=True)

    podcast = models.ForeignKey(Podcast, 
        on_delete=models.CASCADE,
        related_name="likes",
        blank=False, null=False)

    date = models.DateTimeField(auto_now_add=True, blank=True, null=True)


class EpisodeLike(models.Model):
    user = models.ForeignKey(SoundFileUser,
        on_delete=models.SET_NULL,
        related_name="episode_likes",
        blank=True, null=True)

    episode = models.ForeignKey(Episode,
        on_delete=models.CASCADE,
        related_name="likes",
        blank=False, null=False)

    date = models.DateTimeField(auto_now_add=True, blank=True, null=True)

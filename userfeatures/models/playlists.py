from django.db import models
from django.conf import settings
from podcasts.models import Episode
from users.models import SoundFileUser


class Playlist(models.Model):
    user = models.ForeignKey(SoundFileUser, 
        on_delete=models.CASCADE,
        blank=False, null=False)
    name = models.CharField(max_length=125)
    public = models.BooleanField(default=False)
    update_time = models.DateTimeField(auto_now_add=True)

    class Meta:
        constraints =[
            models.UniqueConstraint(fields=['user', 'name'], name='playlist_user')
        ]


class EpisodePlaylist(models.Model):
    playlist = models.ForeignKey(Playlist, on_delete=models.CASCADE, related_name="episodes",  blank=False, null=False)
    episode = models.ForeignKey(Episode, on_delete=models.CASCADE, blank=False, null=False)
    time = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)

    class Meta:
        """
            Cannot have the same episode more than once in the 
            same playlist

            Think: How does the
        """
        constraints = [
            models.UniqueConstraint(fields = ['playlist', 'episode'], 
                name = 'playlist_episode')      
        ]
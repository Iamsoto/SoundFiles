from django.db import models
from users.models import SoundFileUser
from userfeatures.models import Playlist
from podcasts.models import Podcast


class Subscription(models.Model):
    sub_type = models.CharField(max_length=25)
    podcast = models.ForeignKey(Podcast, on_delete=models.CASCADE, blank=True, null=True)
    playlist = models.ForeignKey(Playlist, on_delete=models.CASCADE, blank=True, null=True)
    user = models.ForeignKey(SoundFileUser, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    count = models.IntegerField(default=0)
    update_time = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-update_time']
    
    def __str__(self):
        return f"{self.sub_type}-{self.user}"
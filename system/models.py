from django.db import models
from podcasts.models import Podcast
from userfeatures.models import EpisodeComment
from users.models import SoundFileUser
from datetime import datetime

class Flag(models.Model):
    podcast = models.ForeignKey(Podcast, on_delete=models.CASCADE, blank = True, null = True)
    episode_comment = models.ForeignKey(EpisodeComment, on_delete= models.CASCADE, blank=True, null=True)
    user = models.ForeignKey(SoundFileUser, on_delete=models.CASCADE)
    reason = models.CharField(max_length=100, null = False, blank=False)
    time = models.DateTimeField(auto_now_add=True, blank=True, null=True)

class PodcastIndex(models.Model):
    indexFile = models.FileField(upload_to='temp')


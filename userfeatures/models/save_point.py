from django.db import models
from users.models import SoundFileUser
from podcasts.models import Episode


class EpisodeSavePoint(models.Model):
    time = models.IntegerField(default=0)
    episode = models.ForeignKey(Episode, on_delete=models.CASCADE)
    user = models.ForeignKey(SoundFileUser, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        """
            each user only gets one episode save point per episode

        """
        constraints = [
            models.UniqueConstraint(fields = ['episode', 'user'], 
                name = 'save_point_episode')      
        ]
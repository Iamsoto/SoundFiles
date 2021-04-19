from django.db import models 
from userfeatures.models import EpisodeComment, Playlist
from users.models import SoundFileUser
import random

"""
class Mention(models.Model):
    pass
"""

class EpisodeCommentNotification(models.Model):
    episodeComment = models.ForeignKey(EpisodeComment, 
        on_delete=models.CASCADE, blank =True, null=True) # Parent episode comment

    playlist = models.ForeignKey(Playlist, on_delete=models.CASCADE, blank=True, null=True) # TODO... this should really be in its own models
    
    seen = models.BooleanField(default=False)
    
    update_time = models.DateTimeField(auto_now_add=True, blank=True, null=True)
    notify_type= models.CharField(max_length =40) # One of 'reply' or 'like'
    
    user_notified = models.ForeignKey(SoundFileUser, 
        on_delete=models.CASCADE,
        related_name="episode_comment_reply_notifications")

    count = models.IntegerField(default=0)
    
    def __str__(self):
        return f"{self.user_notified.email}-{self.notify_type}-{self.update_time}"


    def save(self, *args, **kwargs):
        """
            Naieve way of doing this
        """
        self.user_notified.score += random.randint(1, 4)

        try:
            self.user_notified.save()
        except Exception as e:
            pass
        
        super(EpisodeCommentNotification, self).save(*args, **kwargs)

    class Meta:
        ordering = ['-update_time']
    

    





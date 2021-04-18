from django.db import models 
from userfeatures.models import EpisodeComment
from users.models import SoundFileUser

"""
class Mention(models.Model):
    pass
"""

class EpisodeCommentNotification(models.Model):
    episodeComment = models.ForeignKey(EpisodeComment, 
        on_delete=models.CASCADE) # Parent episode comment
    
    seen = models.BooleanField(default=False)
    
    update_time = models.DateTimeField(auto_now_add=True, blank=True, null=True)
    notify_type= models.CharField(max_length =40) # One of 'reply' or 'like'
    
    user_notified = models.ForeignKey(SoundFileUser, 
        on_delete=models.CASCADE,
        related_name="episode_comment_reply_notifications")

    count = models.IntegerField(default=0)
    
    def __str__(self):
        return f"{self.user_notified.email}-{self.notify_type}-{self.update_time}"

    class Meta:
        ordering = ['-update_time']





from django.db import models
from django.conf import settings
from podcasts.models import Episode
from users.models import SoundFileUser
from mptt.models import MPTTModel, TreeForeignKey


class EpisodeComment(MPTTModel):
    """
        Episode comments!
    """
    post_date = models.DateTimeField(auto_now_add=True, blank=True, null=True)
    text = models.TextField(max_length=254)
    episode = models.ForeignKey(Episode, related_name = 'comments', 
        on_delete=models.CASCADE, blank=True, null=True)
    user = models.ForeignKey(SoundFileUser, 
        on_delete=models.CASCADE, blank=False, null=False)
    parent = TreeForeignKey('self', on_delete=models.CASCADE, null=True, blank=True, related_name='comments')
    time_stamp = models.DecimalField(decimal_places=1, max_digits=7, blank = True, null=True) # time in seconds
    update_time = models.DateTimeField(auto_now_add=True, blank=True, null=True)

    class MPTTMeta:
        order_insertion_by=['-update_time']

    def __str__(self):
        return self.text
from django.conf import settings
from django.db import models

from datetime import datetime


class Category(models.Model):
    """
        Bi-directional with podcasts
    """

    name=models.CharField(max_length=50, unique = True, blank=False, null=False)
    

    def __str__(self):
        return self.name

    class Meta:
        ordering = ['name']



class Podcast(models.Model):
    """
        Le pod-cast
    """
    name = models.CharField(max_length=50, blank = True, null=True)
    author = models.CharField(max_length=50, blank=True, null=True)
    sfPopularityScore = models.IntegerField(default=0)
    indexPopularityScore = models.IntegerField(blank=True, null=True)
    image_url = models.URLField(max_length=200, null=True, blank =True)
    description = models.TextField(null=True, blank=True)
    rss_feed=models.TextField(blank=False, null=False, unique = True)
    
    etag=models.CharField(max_length=254, default="N/A")
    last_modified=models.CharField(max_length=254, default="N/A")
    update_time = models.DateTimeField(auto_now_add=True, blank=True, null=True)

    inReview=models.BooleanField(default=False)

    def __str__(self):
        return self.name


class PodcastCategory(models.Model):
    category = models.ForeignKey(Category, on_delete=models.CASCADE, related_name="podcast_links")
    podcast = models.ForeignKey(Podcast, on_delete=models.CASCADE, related_name="category_links")
    
    def __str__(self):
        return f"{self.category.name}-{self.podcast.name}"


class Episode(models.Model):
    """
        La Episode
    """
    name = models.CharField(max_length=50, blank=True, null=True)
    podcast = models.ForeignKey(Podcast, 
        on_delete=models.CASCADE, blank=False, null=False)
    media_url = models.URLField()
    # Can the Guid ever be null? 
    guid = models.CharField(unique=True, max_length=254)

    description = models.TextField(null=True, blank=True)
    pub_date = models.DateField(blank=True, null=True)
    last_updated = models.DateTimeField(auto_now_add=True, blank=True, null=True)
    duration = models.IntegerField(default=0)
    
    class Meta:
        constraints = [
            models.UniqueConstraint(fields = ['podcast', 'guid'], 
                name = 'podcast_guid')      
        ]


    def __str__(self):
        return self.name

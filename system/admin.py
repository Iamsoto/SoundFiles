from django.contrib import admin
from system.models import Flag, PodcastIndex
from podcasts.models import Podcast
from userfeatures.models import EpisodeComment 

class podcastInline(admin.StackedInline):
    model = Podcast

class episodeCommentInline(admin.StackedInline):
    model = EpisodeComment


class FlagAdmin(admin.ModelAdmin):
    list_display= ['pk','user','time', 'podcast','episode_comment']
    search_fields = ['user', 'podcast', 'episode_comment']
    #fields=('user','time','episode_comment__text', 'podcast__name')
    ordering = ['-time']

    readonly_fields = [ "user", "time", "podcast", "episode_comment"]


admin.site.register(Flag, FlagAdmin)
admin.site.register(PodcastIndex)
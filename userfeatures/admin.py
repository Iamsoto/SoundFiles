from django.contrib import admin
from mptt.admin import MPTTModelAdmin
from userfeatures.models import (EpisodeComment, Playlist)

class CustomMPTTModelAdmin(MPTTModelAdmin):
    # specify pixel amount for this ModelAdmin only:
    list_display=['pk', 'text']
    search_fields = ['pk','text']
    mptt_level_indent = 25
    list_per_page = 25

admin.site.register(EpisodeComment, CustomMPTTModelAdmin)

# Register your models here.

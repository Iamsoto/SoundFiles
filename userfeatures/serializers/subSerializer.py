from rest_framework import serializers
from django.conf import settings
from users.serializers import UserSerializerTokenized
from userfeatures.models import Subscription
from podcasts.serializers import PodcastSerializerTiny
from userfeatures.serializers import PlaylistSerializerSmall

class SubSerializer(serializers.ModelSerializer):
    podcast = PodcastSerializerTiny()
    playlist = PlaylistSerializerSmall()
    user = UserSerializerTokenized()
    no_see = serializers.SerializerMethodField(method_name='calculate_no_see')
    
    class Meta:
        model = Subscription
        fields=['podcast','playlist','user','sub_type','update_time', 'no_see', 'pk']

    def calculate_no_see(self, instance):
        if instance.sub_type == "playlist":
            if instance.playlist.update_time > instance.update_time:
                return True # User hasn't seen this yet

        elif instance.sub_type == "podcast":
            if instance.podcast.update_time > instance.update_time:
                return True
        
        return False
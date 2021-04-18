from rest_framework import serializers
from django.conf import settings
from users.models import SoundFileUser
from podcasts.models import Episode
from users.serializers import UserSerializerTokenized
from userfeatures.models import Playlist, EpisodePlaylist, PlaylistLike
from podcasts.serializers import EpisodeSerializerSmall, PodcastSerializerTiny

from django.contrib.auth.models import AnonymousUser

class EpisodePlaylistSerializer(serializers.ModelSerializer):
    episode = EpisodeSerializerSmall()
    class Meta:
        model = EpisodePlaylist
        fields = ['episode','time']


class PlaylistSerializerSmall(serializers.ModelSerializer):
    class Meta:
        model = Playlist
        fields= ['name', 'pk', 'user']


class PlaylistSerializer(serializers.ModelSerializer):
    episodes = EpisodePlaylistSerializer(many=True)
    user = UserSerializerTokenized()
    num_likes = serializers.SerializerMethodField(method_name='calculate_num_likes')
    cur_user_liked = serializers.SerializerMethodField(method_name='calculate_cur_user_liked')    
    
    class Meta:
        model = Playlist
        fields = ['name', 'user', 'pk', 'episodes', 'public', 'num_likes', 'cur_user_liked']
    
    def calculate_num_likes(self, instance):
        """
            Calculate the number of likes for this given comment
        """
        if not instance.public:
            return 0
        return PlaylistLike.objects.filter(playlist__pk = instance.pk).count()

    def calculate_cur_user_liked(self, instance):
        """
            Return true or false based on if current user liked given comment
        """
        request = self.context.get('request')
        user = request.user

        if not instance.public:
            return False 

        if isinstance(user, AnonymousUser):
            return False; # No more work to do here. 

        like = PlaylistLike.objects.filter(user=user, playlist__pk=instance.pk).first()

        if like is not None:
            return True
        else:
            return False
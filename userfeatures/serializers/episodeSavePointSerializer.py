from rest_framework import serializers
from users.models import SoundFileUser
from userfeatures.models import EpisodeSavePoint
from podcasts.serializers import EpisodeSerializerSmall

class EpisodeSavePointList(serializers.ModelSerializer):
    episode = EpisodeSerializerSmall()
    class Meta:
        model = EpisodeSavePoint
        fields= ['time','episode']

class EpisodeSavePointDetail(serializers.ModelSerializer):
    #episode = EpisodeSerializerSmall()
    class Meta:
        model = EpisodeSavePoint
        fields = ['time']

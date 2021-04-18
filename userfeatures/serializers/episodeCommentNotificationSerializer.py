from rest_framework import serializers
from userfeatures.serializers import EpisodeCommentSocial, PlaylistSerializerSmall
from users.serializers import UserSerializerTokenized
from userfeatures.models import EpisodeCommentNotification

class EpisodeCommentNotificationList(serializers.ModelSerializer):
    episodeComment = EpisodeCommentSocial()
    user_notified = UserSerializerTokenized()
    playlist = PlaylistSerializerSmall()
    class Meta:
        model = EpisodeCommentNotification
        fields = ['episodeComment', 'user_notified', 'playlist', 'count', 'seen','update_time', 'pk', 'notify_type']
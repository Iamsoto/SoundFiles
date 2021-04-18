from rest_framework import serializers
from userfeatures.serializers import EpisodeCommentSocial
from users.serializers import UserSerializerTokenized
from userfeatures.models import EpisodeCommentNotification

class EpisodeCommentNotificationList(serializers.ModelSerializer):
    episodeComment = EpisodeCommentSocial()
    user_notified = UserSerializerTokenized()
    class Meta:
        model = EpisodeCommentNotification
        fields = ['episodeComment', 'user_notified', 'count', 'seen','update_time', 'pk', 'notify_type']
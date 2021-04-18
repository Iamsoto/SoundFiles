from rest_framework import serializers
from django.conf import settings
from userfeatures.models import EpisodeComment, EpisodeCommentLike
from system.models import Flag
from podcasts.serializers import EpisodeSerializerTiny, EpisodeSerializerSmall
from users.serializers import UserSerializerTokenized
from django.contrib.auth.models import AnonymousUser


class EpisodeCommentSerializerRootCreate(serializers.ModelSerializer):
    """
        Root comment
    """
    episode = EpisodeSerializerTiny(required=False)
    user = UserSerializerTokenized(required=False)

    class Meta:
        model = EpisodeComment
        fields = ['episode', 'user', 'text', 'time_stamp']



class EpisodeCommentSerializerRootDetail(serializers.ModelSerializer):
    """
        Root comment
    """
    user = UserSerializerTokenized()
    episode = EpisodeSerializerTiny()
    num_likes = serializers.SerializerMethodField(method_name='calculate_num_likes')
    cur_user_liked = serializers.SerializerMethodField(method_name='calculate_cur_user_liked')
    cur_user_flagged = serializers.SerializerMethodField(method_name='calculate_cur_user_flagged')

    class Meta:
        model = EpisodeComment
        fields = ['user', 'text', 'time_stamp','post_date', 'pk', 'num_likes', 'cur_user_liked', 'cur_user_flagged', 'episode']

    def calculate_cur_user_flagged(self, instance):
        request = self.context.get('request')
        user = request.user

        if isinstance(user, AnonymousUser):
            return False

        flag = Flag.objects.filter(user=user, episode_comment__pk=instance.pk).first()

        if flag is not None:
            return True
        else:
            return False

    def calculate_num_likes(self, instance):
        """
            Calculate the number of likes for this given comment
        """
        return EpisodeCommentLike.objects.filter(episode_comment__pk = instance.pk).count()

    def calculate_cur_user_liked(self, instance):
        """
            Return true or false based on if current user liked given comment
        """
        request = self.context.get('request')
        user = request.user

        if isinstance(user, AnonymousUser):
            return False # No more work to do here. 

        like = EpisodeCommentLike.objects.filter(user=user, episode_comment__pk=instance.pk).first()

        if like is not None:
            return True
        else:
            return False

class EpisodeCommentSocialParent(serializers.ModelSerializer):
    user = UserSerializerTokenized()
    episode = EpisodeSerializerTiny()

    class Meta:
        model = EpisodeComment
        fields = ['user', 'text','pk', 'episode']


class EpisodeCommentSocial(serializers.ModelSerializer):
    """
        Serializer used for socials page
    """
    user = UserSerializerTokenized()
    episode = EpisodeSerializerTiny()
    parent = EpisodeCommentSocialParent()

    class Meta:
        model = EpisodeComment
        fields = ['user', 'text','pk', 'episode', 'parent']


class EpisodeCommentSerializerRootList(serializers.ModelSerializer):
    """
        Root comment
    """
    user = UserSerializerTokenized()
    num_likes = serializers.SerializerMethodField(method_name='calculate_num_likes')
    cur_user_liked = serializers.SerializerMethodField(method_name='calculate_cur_user_liked')
    cur_user_flagged = serializers.SerializerMethodField(method_name='calculate_cur_user_flagged')

    class Meta:
        model = EpisodeComment
        fields = ['user', 'text', 'time_stamp','post_date', 'pk', 'num_likes', 'cur_user_liked', 'cur_user_flagged']

    def calculate_cur_user_flagged(self, instance):
        request = self.context.get('request')
        user = request.user

        if isinstance(user, AnonymousUser):
            return False

        flag = Flag.objects.filter(user=user, episode_comment__pk=instance.pk).first()

        if flag is not None:
            return True
        else:
            return False

    def calculate_num_likes(self, instance):
        """
            Calculate the number of likes for this given comment
        """
        return EpisodeCommentLike.objects.filter(episode_comment__pk = instance.pk).count()

    def calculate_cur_user_liked(self, instance):
        """
            Return true or false based on if current user liked given comment
        """
        request = self.context.get('request')
        user = request.user

        if isinstance(user, AnonymousUser):
            return False # No more work to do here. 

        like = EpisodeCommentLike.objects.filter(user=user, episode_comment__pk=instance.pk).first()

        if like is not None:
            return True
        else:
            return False



class EpisodeCommentSerializerReplyList(serializers.ModelSerializer):
    user = UserSerializerTokenized(required = False)
    
    num_likes = serializers.SerializerMethodField(method_name='calculate_num_likes')
    cur_user_liked = serializers.SerializerMethodField(method_name='calculate_cur_user_liked')
    cur_user_flagged = serializers.SerializerMethodField(method_name='calculate_cur_user_flagged')

    class Meta:
        model = EpisodeComment
        fields = ['text','post_date', 'user', 'pk', 'num_likes', 'cur_user_liked', 'cur_user_flagged']

    
    def calculate_cur_user_flagged(self, instance):
        request = self.context.get('request')
        user = request.user

        if isinstance(user, AnonymousUser):
            return False

        flag = Flag.objects.filter(user=user, episode_comment__pk=instance.pk).first()

        if flag is not None:
            return True
        else:
            return False

    
    def calculate_num_likes(self, instance):
        """
            Calculate the number of likes for this given comment
        """
        return EpisodeCommentLike.objects.filter(episode_comment__pk = instance.pk).count()

    
    def calculate_cur_user_liked(self, instance):
        """
            Return true or false based on if current user liked given comment
        """
        request = self.context.get('request')
        user = request.user

        if isinstance(user, AnonymousUser) :
            return False; # No more work to do here. 

        like = EpisodeCommentLike.objects.filter(user=user, episode_comment__pk=instance.pk).first()

        if like is not None:
            return True
        else:
            return False


class EpisodeCommentSerializerReplyCreate(serializers.ModelSerializer):
    """
        comment 'Replies'
    """
    
    user = serializers.SerializerMethodField('user_field')
    parent_obj = serializers.SerializerMethodField('parent_field')
    class Meta:
        model = EpisodeComment
        fields = ['text', 'user', 'parent']
    
    def parent_field(self, obj):
        parent = self.context.get("parent")
        if parent:
            return parent
        return False

    def user_field(self, obj):
        user= self.context.get("user")
        if user:
            return user
        return False
    """
    def get_fields(self):
            For infinite nested-comments:
            Solution pasta'd from: 
                https://stackoverflow.com/questions/13376894/django-rest-framework-nested-self-referential-objects
        
        fields = super(CategorySerializer, self).get_fields()
        fields['comments'] = EpisodeCommentSerializer(many=True)
        return fields
    
    """
    
    def create(self, validated_data):
        # by default don't save on create
        comment = EpisodeComment(
            text=validated_data['text'],
            time_stamp=validated_data['time_stamp'],
            user=validated_data['user'],
        )
        return comment





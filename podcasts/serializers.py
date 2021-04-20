from rest_framework import serializers
from podcasts.models import Podcast, Episode, Category
from userfeatures.models import EpisodeLike, PodcastLike, EpisodeSavePoint, Subscription
from system.models import Flag

from django.contrib.auth.models import AnonymousUser


class CategorySerializer(serializers.ModelSerializer):
    """

    """
    class Meta:
        model = Category
        fields=['name']


class PodcastSerializer(serializers.ModelSerializer):
    """

    """
    num_likes = serializers.SerializerMethodField(method_name='calculate_num_likes')
    cur_user_liked = serializers.SerializerMethodField(method_name='calculate_cur_user_liked')
    cur_user_flagged = serializers.SerializerMethodField(method_name='calculate_cur_user_flagged')
    cur_user_sub = serializers.SerializerMethodField(method_name='calculate_cur_user_sub')
    num_subs = serializers.SerializerMethodField(method_name='calculate_num_subs')
    
    class Meta:
        model = Podcast
        fields = ['name', 'rss_feed', 'image_url', 'description', 
        'author', 'num_likes', 
        'cur_user_liked', 'cur_user_flagged', 'pk', 'cur_user_sub', 'num_subs']

    def calculate_num_subs(self, instance):
        return Subscription.objects.filter(podcast__pk = instance.pk).count()


    def calculate_cur_user_sub(self, instance):
        request = self.context.get('request')
        user = request.user
        if isinstance(user, AnonymousUser):
            return False

        sub = Subscription.objects.filter(user=user, podcast__pk=instance.pk).first()
        
        if sub is not None:
            return True
        else:
            return False



    def calculate_num_likes(self, instance):
        """
            Calculate the number of likes for this given comment
        """
        
        return PodcastLike.objects.filter(podcast__pk = instance.pk).count()

    
    def calculate_cur_user_flagged(self, instance):
        request = self.context.get('request')
        user = request.user

        if isinstance(user, AnonymousUser):
            return False;

        flag = Flag.objects.filter(user=user, podcast__pk=instance.pk).first()

        if flag is None:
            return False
        else:
            return True

    
    def calculate_cur_user_liked(self, instance):
        """
            Return true or false based on if current user liked given comment
        """
        
        request = self.context.get('request')
        user = request.user

        if isinstance(user, AnonymousUser):
            return False; # No more work to do here. 

        like = PodcastLike.objects.filter(user=user, podcast__pk=instance.pk).first()

        if like is not None:
            return True
        else:
            return False


class PodcastSerializerSmall(serializers.ModelSerializer):
    """

    """
    description = serializers.SerializerMethodField()
    num_likes = serializers.SerializerMethodField(method_name='calculate_num_likes')
    num_subs = serializers.SerializerMethodField(method_name='calculate_num_subs')

    class Meta:
        model = Podcast

        fields = ['name', 'image_url', 'rss_feed', 'pk', 'description', 
        'author', 'num_likes', 'num_subs']
    
    
    def calculate_num_subs(self, instance):
        return Subscription.objects.filter(podcast__pk = instance.pk).count()

    
    def get_description(self, obj):
        # Return first 150 characters
        if (obj is not None) and (obj.description is not None):
            return obj.description[:150]
        else:
            return None

    def calculate_num_likes(self, instance):
        """
            Calculate the number of likes for this given comment
        """
        
        return PodcastLike.objects.filter(podcast__pk = instance.pk).count()


class PodcastSerializerTiny(serializers.ModelSerializer):
    """
        Used for playlists
    """
    class Meta:
        model = Podcast
        fields = ['name', 'image_url', 'pk']


class EpisodeSerializerList(serializers.ModelSerializer):
    num_likes = serializers.SerializerMethodField(method_name='calculate_num_likes')
    cur_user_liked = serializers.SerializerMethodField(method_name='calculate_cur_user_liked')
    cur_time = serializers.SerializerMethodField(method_name='calculate_cur_time')

    class Meta:
        """ 
		
        """
        model = Episode
        fields = ['name', 'media_url','guid', 'description', 'pub_date', 'pk', 'num_likes', 'cur_user_liked', 'duration', 'cur_time']

    def calculate_cur_time(self, instance):
        request = self.context.get('request')
        user = request.user
        
        if isinstance(user, AnonymousUser):
            return 0

        esp = EpisodeSavePoint.objects.filter(user=user, episode__pk=instance.pk).first()
        if esp is not None:
            return esp.time 
        else:
            return 0

    def calculate_num_likes(self, instance):
        """
            Calculate the number of likes for this given comment
        """
        
        return EpisodeLike.objects.filter(episode__pk = instance.pk).count()

    def calculate_cur_user_liked(self, instance):
        """
            Return true or false based on if current user liked given comment
        """
        
        request = self.context.get('request')
        user = request.user

        if isinstance(user, AnonymousUser):
            return False; # No more work to do here. 

        like = EpisodeLike.objects.filter(user=user, episode__pk=instance.pk).first()

        if like is not None:
            return True
        else:
            return False    
    

class EpisodeSerializerDetail(serializers.ModelSerializer):
    podcast = PodcastSerializerSmall()
    num_likes = serializers.SerializerMethodField(method_name='calculate_num_likes')
    cur_user_liked = serializers.SerializerMethodField(method_name='calculate_cur_user_liked')
    cur_time = serializers.SerializerMethodField(method_name='calculate_cur_time')

    class Meta:
        model=Episode
        fields = ['name', 'pk', 'media_url', 'description', 'podcast', 'num_likes', 'cur_user_liked', 'duration', 'cur_time']

    def calculate_cur_time(self, instance):
        request = self.context.get('request')
        user = request.user
        
        if isinstance(user, AnonymousUser):
            return 0

        esp = EpisodeSavePoint.objects.filter(user=user, episode__pk=instance.pk).first()
        if esp is not None:
            return esp.time 
        else:
            return 0

    def calculate_num_likes(self, instance):
        """
            Calculate the number of likes for this given comment
        """
        
        return EpisodeLike.objects.filter(episode__pk = instance.pk).count()

    def calculate_cur_user_liked(self, instance):
        """
            Return true or false based on if current user liked given comment
        """
        
        request = self.context.get('request')
        user = request.user

        if isinstance(user, AnonymousUser):
            return False; # No more work to do here. 

        like = EpisodeLike.objects.filter(user=user, episode__pk=instance.pk).first()

        if like is not None:
            return True
        else:
            return False 


class EpisodeSerializerSmall(serializers.ModelSerializer):
    podcast = PodcastSerializerTiny()
    class Meta:
        """
            Smaller version of List EpisodeSerializer
        """
        model=Episode
        fields = ['name', 'pk', 'media_url', 'podcast']



class EpisodeSerializerTiny(serializers.ModelSerializer):
    podcast = PodcastSerializerTiny()
    class Meta:
        """
            Smaller version of List EpisodeSerializer
        """
        model=Episode
        fields = ['name', 'podcast', 'pk']
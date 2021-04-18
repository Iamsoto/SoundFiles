from rest_framework import serializers
from django.conf import settings
from users.models import SoundFileUser


class UserSerializerTokenized(serializers.HyperlinkedModelSerializer):
    """
    
    """
    class Meta:
        model = SoundFileUser
        fields = ['username']


class ListUsersSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        """ 

        """
        model = SoundFileUser
        fields = ['username', 'email','join_date']


class DetailUserSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        """ 

        """
        model = SoundFileUser
        fields = ['username', 'email','password', 'first_name',
        'last_name','join_date']


class CreateUserSerializer(serializers.HyperlinkedModelSerializer):
    """
    Relavent SO:
        https://stackoverflow.com/questions/36482794/django-rest-framework-serializer-is-valid-always-false
    """
    password1 = serializers.CharField(max_length=254, write_only=True)
    password2 = serializers.CharField(max_length=254, write_only=True)
    class Meta:
        """ 

        """
        model = SoundFileUser
        fields = ['username', 'email','password1', 'password2', 'news_letter']


    def validate(self, data):
        """
        
        """
        if data['password1'] != data['password2']:
            raise serializers.ValidationError("Passwords must match")
        return data


    def create(self, validated_data):
        user = SoundFileUser(
            email=validated_data['email'],
            username=validated_data['username'],
        )
        user.set_password(validated_data['password1'])
        user.save()
        return user        
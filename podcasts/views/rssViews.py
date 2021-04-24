from django import forms
from django.conf import settings
from django.http import Http404
from django.core.exceptions import ValidationError
from rest_framework import permissions, status, throttling
from rest_framework.views import APIView
from CustomPermissions import ValidEmail
from rest_framework.response import Response
from rest_framework.parsers import JSONParser
from rest_framework.permissions import IsAuthenticated
#from .serializers import 
from podcasts.models import Podcast, Episode

from podcasts.XMLParser import XMLParser
from RSSManager import RSSParser

import requests
import json

class RSSThrottle(throttling.UserRateThrottle):
    rate ='2/minute'

class XMLHandler:
    """
        Custom built class to help views 
        1) Retreive data from url 
        2) parse xml data and return the xml, or the appropriate error
    """

    def get_xml_from_url(self, url, response_data):
        """
            retreive the xml from given url

            currently, the request is not validated here, but should be in
            handle_xml()

            # TODO: This should really be abstracted with the manage.py fetch request
        """
        headers={
        'user-agent': 
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88.0.4324.182 Safari/537.36'}
        r = None
        try:
            r = requests.request(method='GET', url=url, timeout=10, headers = headers)
        
        except requests.RequestException as e:
            response_data["detail"] = "I can't fetch that URL right now. Try copy + pasting the RSS text!" 
            return None

        except requests.ConnectionError as e:
            response_data["detail"] = "I can't fetch that URL right now. Try copy + pasting the RSS text!" 
            return None

        except requests.HTTPError as e:
            response_data["detail"] = "I can't fetch that URL right now. Try copy + pasting the RSS text!" 
            return None

        except requests.TooManyRedirects as e:
            response_data["detail"] = "I can't fetch that URL right now. Try copy + pasting the RSS text!" 
            return None

        except requests.ConnectTimeout as e:
            response_data["detail"] = "I can't fetch that URL right now. Try copy + pasting the RSS text!" 
            return None

        except requests.ReadTimeout as e:
            response_data["detail"] = "I can't fetch that URL right now. Try copy + pasting the RSS text!" 
            return None

        except requests.Timeout as e:
            response_data["detail"] = "Couldn't fetch that url: {}".format(e)
            return None

        return r


    def handle_xml(self, xml):
        """
            Use custom RSSPaser to get data from string/xml input. 
            Clean data and submit it back to frontend iff its contents can
            be successfully validated and parsed
        """
        response_data = {}
        parser = RSSParser(xml)
        cleaned_data = []
        charSponge = forms.CharField(required=False)

        try:
            
            title = charSponge.clean(parser.get_channel_title())
            #print("title: {}".format(title))
            url = charSponge.clean(parser.get_channel_url())
            #print("url: {}".format(url))
            image = charSponge.clean(parser.get_channel_image())
            #print("image: {}".format(image))
            descr = charSponge.clean(parser.get_channel_description())
            author = charSponge.clean(parser.get_author())
            #print()

            cleaned_data.append(title)
            cleaned_data.append(url)
            cleaned_data.append(image)
            cleaned_data.append(descr)
            cleaned_data.append(author)
        
        except ValidationError as e:
            response_data["detail"] = "Invalid!"
            return Response(response_data, 
                status=status.HTTP_400_BAD_REQUEST)               

        except Exception as e:
            # Unforseen parsing error
            response_data["detail"] = "I could not parse that rss"
            #print(e)
            return Response(response_data, 
                status=status.HTTP_400_BAD_REQUEST)
        
        try:
            # We already have this object
            existing_podcast = Podcast.objects.get(rss_feed = cleaned_data[1])
        except Podcast.DoesNotExist as e:
            # Good!
            pass
        else:
            # TODO:
            if existing_podcast.inReview:
                response_data["detail"] = "This podcast is currently in review! Come back in a few hours and try again!"
            else:
                response_data["detail"] = "We already have this! Here's the link: /podcast/{}".format(existing_podcast.pk)
            return Response(response_data, 
                status=status.HTTP_405_METHOD_NOT_ALLOWED)

        response_data["title"] = cleaned_data[0]
        response_data["url"] = cleaned_data[1]
        response_data["image"] = cleaned_data[2]
        response_data["descr"] = cleaned_data[3]
        response_data["author"] = cleaned_data[4]

        return Response(response_data, status=status.HTTP_200_OK)


class RSSFormSubmit(APIView, XMLHandler):
    """
        Submit the RSS form and create a new soundhub
    """
    parser_classes = [JSONParser]
    permission_classes = [IsAuthenticated, ValidEmail]
    throttle_classes = [RSSThrottle]

    def add_episodes(self, podcast, url):
        """
        
            Add episodes from url  
        episodes = []
        char_sponge = forms.CharField(required=False)
        response_data = {"detail" : None}
        cleaned_data = []

        # Get the xml from the url
        r = self.get_xml_from_url(url, response_data)
        if r is None:
            #print(str(response_data["errors"]))
            return None

        parser = RSSParser(r.text)
        try:
            # Retreive episodes using custom xml parser
            episodes = parser.get_channel_episodes()
        except Exception as e:
            msg = "Custom parser failed to parse RSS Feed: Details: {}\n".format(str(e))
            print(msg)
            return None
        
        for episode in episodes:
            cleaned_data = []
            # Update or add episode
            try: 
                # Clean the data
                cleaned_data.append(char_sponge.clean(episode.name))
                cleaned_data.append(char_sponge.clean(episode.url))
                cleaned_data.append(char_sponge.clean(episode.guid))
                cleaned_data.append(char_sponge.clean(episode.description))
                cleaned_data.append(episode.pub_date)
            except ValidationError as e:
                print(str(e))
                continue

            # Create the new episode...
            new_ep = Episode(
                podcast = podcast, 
                name = cleaned_data[0], 
                media_url = cleaned_data[1], 
                guid = cleaned_data[2],
                description = cleaned_data[3],
                pub_date=cleaned_data[4]
                )
                
            try:
                new_ep.save()
            except Exception as e:
                print(str(e))
                continue
        """

    
    def post(self, request, format=None):
        """
            Submit the RSS form!
        """
        response_data = {}
        cleaned_data= {}
        data = request.data
        sponge = forms.CharField(required=False)
        if data is None:
            response_data["detail"] = "Can't submit this now. Please try again later"
            return Response(response_data, 
                status=status.HTTP_400_BAD_REQUEST)
        
        if 'rss_feed' not in data:
            reponse_data["detail"] = "Something went wrong..."
            return Response(response_data, 
                status=status.HTTP_400_BAD_REQUEST)
        try:
            # Clean the data
            cleaned_data["rss_feed"] = sponge.clean(data["rss_feed"])
            if 'name' in data:
                cleaned_data["name"] = sponge.clean(data["name"])
            if 'image_url' in data:
                cleaned_data["image_url"] = sponge.clean(data["image_url"])
            if 'description' in data:
                cleaned_data["description"] = sponge.clean(data["description"])
            if 'author' in data:
                cleaned_data["author"] = sponge.clean(data["author"])

        except ValidationError as e:
            response_data["detail"] = "Invalid"
            return Response(response_data, 
                status = status.HTTP_400_BAD_REQUEST)

        try:
            existing_podcast = Podcast.objects.get(rss_feed = cleaned_data["rss_feed"])
        except Podcast.DoesNotExist as e:
            # good! podcast doesn't exist!
            pass
        else:
            # bad!
            response_data["detail"] = "Already have this object! ... hacker"
            return Response(response_data, 
                status = status.HTTP_405_METHOD_NOT_ALLOWED)

        pod = Podcast(
            name = cleaned_data.get("name", "N/A"), 
            rss_feed = cleaned_data.get("rss_feed", "N/A"),
            author=cleaned_data.get("author","N/A"),
            image_url = cleaned_data.get("image_url","N/A"), 
            description = cleaned_data.get("description", "N/A"),
            inReview=True,
            )
        
        try:
            # Save to database
            pod.save()
            #self.add_episodes(pod, pod.rss_feed)

        except Exception as e:
            response_data["detail"] = "Something bad happened"
            return Response(response_data, 
                status = status.HTTP_400_BAD_REQUEST)

        # Respond to sender
        response_data["success"] = "Content created successuflly!"
        response_data["pk"] = pod.pk  
        return Response(response_data, status=status.HTTP_200_OK)        


class InspectURL(APIView, XMLHandler):
    """
        Handle URL input
    """
    parser_classes = [JSONParser]
    permission_classes = [IsAuthenticated, ValidEmail]
    throttle_classes = [RSSThrottle]

    def handle_url(self, url):
        sponge =forms.CharField(required=False)
        url = sponge.clean(url)
        response_data = {}
        
        r = self.get_xml_from_url(url, response_data)

        if r is not None:
            return self.handle_xml(r.text)
        else:
            return Response(response_data, status=status.HTTP_400_BAD_REQUEST)


    def post(self, request, format=None):
        response_data = {}
        data = request.data
        if data is not None and data['url'] is not None:
            return self.handle_url(data['url'])
        else:
            response_data["detail"] = "Sorry, something went wrong"
            return Response(response_data, status=status.HTTP_400_BAD_REQUEST)
        


class InspectXML(APIView, XMLHandler):
    """
        Handle XML input
    """
    parser_classes = [XMLParser]
    permission_classes = [IsAuthenticated, ValidEmail]

    def post(self, request, format=None):
        response_data = {}
        xml = ''
        xml = request.data
        #print(xml)
        if xml is not None:
            return self.handle_xml(xml)
        else:
            response_data["detail"] = "I did not find an rss feed..."
            return Response(response_data, status=status.HTTP_400_BAD_REQUEST)
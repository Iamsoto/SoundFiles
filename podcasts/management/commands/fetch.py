from django.core.management.base import BaseCommand, CommandError
from django.core.exceptions import ValidationError
from django import forms
from podcasts.models import Podcast, Episode, Category, PodcastCategory
from RSSManager import RSSParser
import os, psutil
import gc

import queue
import concurrent
import threading
import time
import requests
from django.utils import timezone

# Number of parallel threads
num_concurrent = 20

DB_BUF_SIZE = 5000
requests_done = False
object_update_create_que = queue.Queue(DB_BUF_SIZE)
episode_delete_queue = queue.Queue(DB_BUF_SIZE)

_count_completed = 0

class EpisodeDeleteThread(threading.Thread):
    """
    
    """
    def __init__(self, group=None, target=None, name=None,
                 args=(), kwargs=None, verbose=None):
        super(EpisodeDeleteThread, self).__init__()
        self.target = target
        self._stopevent = threading.Event()
        self.name = name
        return

    def run(self):
        while (not self._stopevent.isSet()) or (not episode_delete_queue.empty()):
            if not episode_delete_queue.empty():
                episode = episode_delete_queue.get()
                try:
                    episode.delete()
                except Exception as e:
                    pass
                    #self.stdout.write(self.style.ERROR("Could not delete: {}".format(str(e))))
                else:
                    pass
            else:
                time.sleep(4)

    def join(self, timeout=None):
        """ Stop the thread. """
        self._stopevent.set()
        threading.Thread.join(self, timeout)


class ObjectUpdateCreateThread(threading.Thread):
    """
        Handle saving items to the db
    """
    def __init__(self, group=None, target=None, name=None,
                 args=(), kwargs=None, verbose=None):
        super(ObjectUpdateCreateThread, self).__init__()
        self.target = target
        self._stopevent = threading.Event()
        self.name = name
        return

    def run(self):
        while (not self._stopevent.isSet()) or (not object_update_create_que.empty()):
            if not object_update_create_que.empty():
                ob = object_update_create_que.get()
                try:
                    ob.save()
                except Exception as e:
                    pass
                    #self.stdout.write(self.style.ERROR("Could not update db object: {}".format(str(e))))
                else:
                    pass
            else:
                time.sleep(1)

    def join(self, timeout=None):
        """ Stop the thread. """
        self._stopevent.set()
        threading.Thread.join(self, timeout)


class Command(BaseCommand):
    help = 'Fetch New Podcast episodes from RSS feeds currently in DB'
    updated_channels = 0
    updated_episodes = 0
    deleted_episodes = 0
    added_episodes = 0

    
    def update_podcast_channel(self, podcast, parser):
        """
            update podcast channel
        """
        #xml = RSSParser.remove_header_from_string(xml) # remove header form string first...
        char_sponge = forms.CharField(required = False)
        cleaned_data= []

        try:
            cleaned_data.append(char_sponge.clean(parser.get_channel_title()))
            cleaned_data.append(char_sponge.clean(parser.get_channel_image()))
            cleaned_data.append(char_sponge.clean(parser.get_channel_description()))
            cleaned_data.append(char_sponge.clean(parser.get_category()))
        except ValidationError as e:
            self.stdout.write(self.style.ERROR(e))
            return
        except Exception as e:
            self.stdout.write(self.style.ERROR(e))
            return

        changed = False # anaive solution, but a solution
        if podcast.name != cleaned_data[0]:
            changed = True
            podcast.name = cleaned_data[0]
        
        if podcast.image_url != cleaned_data[1]:
            changed = True
            podcast.image_url = cleaned_data[1]
        
        if podcast.description != cleaned_data[2]:
            changed = True
            podcast.description = cleaned_data[2]
            
        categories = podcast.category_links.all()

        if (len(categories) == 0) or (categories[0].category.name != cleaned_data[3]):
            cat = None
            try:
                cat = Category.objects.get(name= cleaned_data[3])
            except Category.DoesNotExist as e:
                cat = Category(name=cleaned_data[3])
                object_update_create_que.put(cat, block=True)
            else:
                pass

            object_update_create_que.put(PodcastCategory(category=cat, podcast=podcast), block=True)
            changed = True
        #self.stdout.write(self.style.SUCCESS(podcast.categories))   
        
        if changed:
            object_update_create_que.put(podcast, block=True)


        return

    def update_episodes(self, podcast, parser):
        """
            Completes 3 functions:
            retreives episodes from rss and:
            
            1) Updates them if they exist on the db
                and differ from records on db
            
            2) Creates an episode if it does not exist on the db
            
            3) If an episode exists on the db that is not in the RSS
                delete the episode in the db
        """
        episodes = []
        char_sponge = forms.CharField(required=False)
        date_sponge = forms.DateField(required=False)
        int_sponge = forms.IntegerField(required=False)
        #xml = RSSParser.remove_header_from_string(xml) # Remove header from string first
        try:
            # Retreive episodes using custom xml parser
            episodes = parser.get_channel_episodes()
        
        except Exception as e:
            msg = "Custom parser failed to parse RSS Feed: Details: {}\nRssFeed:{}\n".format(self.style.ERROR(e), str(xml))
            self.stdout.write(msg)
            return None
        
        for episode in episodes:
            # Update or add episode
            try: 
                # Clean the data
                cleaned_name = char_sponge.clean(episode.name)
                cleaned_url = char_sponge.clean(episode.url)
                cleaned_guid = char_sponge.clean(episode.guid)
                cleaned_description = char_sponge.clean(episode.description)
                cleaned_pub_date = date_sponge.clean(episode.pub_date)
                cleaned_duration = int_sponge.clean(episode.duration)
            except ValidationError as e:
                self.stdout.write(self.style.ERROR(e))
                continue
            #self.stdout.write(self.style.SUCCESS(cleaned_duration))
            # Is this an update or new episode?
            try:
                # Update the existing episode
                ep = Episode.objects.get(podcast=podcast, guid=cleaned_guid)

            except Episode.DoesNotExist as e:
                # Must be new episode
                new_ep = Episode(
                    podcast = podcast, 
                    name = cleaned_name, 
                    media_url = cleaned_url, 
                    guid = cleaned_guid,
                    pub_date = cleaned_pub_date,
                    duration = cleaned_duration,
                    description = cleaned_description
                    )
                
                object_update_create_que.put(new_ep, block=True)
            
            else: # Episode exists
                changed = False
                if ep.media_url != cleaned_url:
                    changed = True
                    ep.media_url = cleaned_url
                
                if ep.description != cleaned_description:
                    changed = True
                    ep.description = cleaned_description

                if ep.pub_date != cleaned_pub_date:
                    changed = True
                    ep.pub_date = cleaned_pub_date

                if ep.duration != cleaned_duration:
                    changed = True
                    ep.duration = cleaned_duration

                if changed:
                    ep.last_updated = timezone.now()
                    object_update_create_que.put(ep, block=True)


        # Remove an episode if it is no longer on the RSS
        rss_guids = [char_sponge.clean(episode.guid) for episode in episodes]
        db_guids = [episode.guid for episode in Episode.objects.filter(podcast=podcast)]
        intersect = [guid for guid in db_guids if guid not in rss_guids]
        for guid in intersect:
            ep = Episode.objects.get(podcast=podcast, guid = guid)
            episode_delete_queue.put(new_ep, block=True)
            


    def work(self, podcast):
            # Cheap tricks...
            headers={
            'user-agent': 
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88.0.4324.182 Safari/537.36'}
            
            r = None 

            if podcast.etag != 'n/a' and podcast.etag is not None:
                headers['If-None-Match'] = podcast.etag
            
            if podcast.last_modified != 'n/a' and podcast.last_modified is not None:
                headers['If-Modified-Since'] = podcast.last_modified            

            try:
                r = requests.request(method='GET', url=podcast.rss_feed, timeout=10.1, headers=headers)
            except requests.RequestException as e:
                self.stdout.write(self.style.ERROR(e))
                return

            except requests.ConnectionError as e:
                self.stdout.write(self.style.ERROR(e))
                return

            except requests.HTTPError as e:
                self.stdout.write(self.style.ERROR(e))
                return

            except requests.TooManyRedirects as e:
                self.stdout.write(self.style.ERROR(e))
                return

            except requests.ConnectTimeout as e:
                self.stdout.write(self.style.ERROR(e))
                return

            except requests.ReadTimeout as e:
                self.stdout.write(self.style.ERROR(e))
                return

            except requests.Timeout as e:
                self.stdout.write(self.style.ERROR(e))
                return

            except Exception as e:
                self.stdout.write(self.style.ERROR("Unnown error: {}".format(str(e))))
                return

            if r is not None and r.status_code < 400:
                pass
                
            else:
                self.stdout.write(self.style.ERROR('{} Fetching from: {}\n'.format(r.status_code, podcast.rss_feed)))
            
            # Response 304, rss not modified since we last looked at it
            # Read this if confused:
            # https://fishbowl.pastiche.org/2002/10/21/http_conditional_get_for_rss_hackers
            
            #RSSParser.

            if r.status_code != 304 and r.ok:
                

                # Update our stuff
                parser = RSSParser(r.text)
                self.update_podcast_channel(podcast, parser)
                self.update_episodes(podcast, parser)
                

                modified = False
                if 'ETag' in r.headers:
                    if podcast.etag != r.headers['ETag']:

                        podcast.etag = r.headers['ETag']
                        modified = True
                if 'Last-Modified' in r.headers:
                    if podcast.last_modified != r.headers['Last-Modified']:
                        podcast.last_modified = r.headers['last_modified']
                        modified = True

                if modified:
                    podcast.update_time = timezone.now()
                    object_update_create_que.put(podcast, block =True)


    def handle(self, *args, **options):
        """
            Entry point for 'fetch' command
        """
        podcasts = Podcast.objects.all()
        thread_pool = []
        cur_count=0
        cur_index = 0
        chunk_amt = 100
        r = None
        start_time = time.time()

        t2 = EpisodeDeleteThread(name='episode_delete_consumer')
        t2.start()
        t3 = ObjectUpdateCreateThread(name ='object_update_create_consumer')
        t3.start()
        
        while cur_index < len(podcasts):
            cur_list = podcasts[cur_index:cur_index + chunk_amt]
            cur_index = cur_index + chunk_amt
            #gc.set_threshold(500, 5,5 ) #Doesn't seem to have an effect
            with concurrent.futures.ThreadPoolExecutor(max_workers=num_concurrent) as executor:
                res = [executor.submit(self.work, podcast) for podcast in cur_list]
                concurrent.futures.wait(res)
            self.stdout.write(f"{cur_index} requests completed\nin: {time.time() - start_time}s\n{psutil.virtual_memory()[2]}% RAM")
        
        #print("waiting to join")
        t2.join()
        t3.join()
        end_time = time.time()

        msg = '{}s elapsed'.format(str(end_time-start_time))

        self.stdout.write(self.style.SUCCESS(msg))


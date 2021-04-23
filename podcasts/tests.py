from django.test import TestCase
import time
import bs4 as bs
import os
from RSSManager import RSSParser
import re

class RSSParserTestCase(TestCase):

    cleanr = re.compile('<.*?>|&([a-z0-9]+|#[0-9]{1,6}|#x[0-9a-f]{1,6});')

    def convert_string_to_seconds(self, time):
        """
            Given a string in the format xx:xx:xx
                convert to seconds
        """
        parts = time.split(":")
        x = 0
        time = 0
        for i in reversed(range(len(parts))):
            time += int(parts[i]) * (60 ** x) 
            x+=1

        return time

    def dont_test_duration_parse(self):
        dir_path = os.path.dirname(os.path.realpath(__file__))
        for file in os.listdir(os.path.join(dir_path, 'xml_files/')):
            with open(os.path.join(dir_path, 'xml_files/', file), "r" ) as f:
                contents = f.read()
                feed = bs.BeautifulSoup(contents, 'xml')                   
                items = feed.channel.find_all("item")
                for item in items:
                    title = re.sub(self.cleanr, '', item.title.string)
                    
                    duration = item.find_all('duration')
                    if len(duration) > 0:
                        duration = duration[0].string
                    else:
                        duration = 0

                    if ':' in duration:
                        duration = self.convert_string_to_seconds(duration)

                    print(f"{title} - {int(duration)}")

    def dont_test_fake(self):
        dir_path = os.path.dirname(os.path.realpath(__file__))
        for file in os.listdir(os.path.join(dir_path, 'xml_files/')):
            with open(os.path.join(dir_path, 'xml_files/', file), "r" ) as f:
                content = f.read() 
                feed = bs.BeautifulSoup(content, 'xml')
                itunes = feed.channel.find_all('category')
                for itune in itunes:
                    print(itune.attrs["text"])
 

    def test_rss_parser(self):
        dir_path = os.path.dirname(os.path.realpath(__file__))
        start_time = time.time()
        #print("starting")
        for file in os.listdir(os.path.join(dir_path, 'xml_files/')):
            with open(os.path.join(dir_path, 'xml_files/', file), "r" ) as f:
                content = f.read()
                rssParser = RSSParser(content)
                title = rssParser.get_channel_title()
                image = rssParser.get_channel_image()
                descr = rssParser.get_channel_description()
                url = rssParser.get_channel_url()
                print(f"url:{url}")
                episodes = rssParser.get_channel_episodes()
                #if(len(episodes) > 0):
                #    print(episodes[0].duration)
                #for episode in episodes:
                #    print(episode.pub_date)
                #print(f"categories: {episodes.categories}")
        end_time = time.time()
        print(f"{end_time - start_time} seconds to parse 3 files")



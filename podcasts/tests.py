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

        for file in os.listdir(os.path.join(dir_path, 'xml_files/')):
            with open(os.path.join(dir_path, 'xml_files/', file), "r" ) as f:
                content = f.read()
                rssParser = RSSParser(content)
                title = rssParser.get_channel_title()
                image = rssParser.get_channel_image()
                descr = rssParser.get_channel_description()
                url = rssParser.get_channel_url()
                author = rssParser.get_author()
                print(f"title:{title}")
                print(f"author:{author}")
                print(f"description:{descr}")
                print(f"url:{url}")
                print(f"image:{image}")
                episodes = rssParser.get_channel_episodes()
                print(f"episodes:{len(episodes)}")
                print("\n\n")
        end_time = time.time()
        print(f"{end_time - start_time} seconds to parse 3 files")

    def no_test_rss_parser_2(self):
        dir_path = os.path.dirname(os.path.realpath(__file__))
        start_time = time.time()
        #print("starting")

        with open(os.path.join(dir_path, 'xml_files/spanish'), "r" ) as f:
            content = f.read()
            rssParser = RSSParser(content)
            title = rssParser.get_channel_title()
            image = rssParser.get_channel_image()
            descr = rssParser.get_channel_description()
            url = rssParser.get_channel_url()
            #print(f"title:{title}")
            #print(f"description:{descr}")
            #print(f"url:{url}")
            #print(f"image:{image}")
            episodes = rssParser.get_channel_episodes()
            #print(f"episodes:{len(episodes)}")

        end_time = time.time()
        print(f"{end_time - start_time} seconds to parse 1 files")



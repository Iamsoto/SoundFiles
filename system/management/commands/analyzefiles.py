from django.core.management.base import BaseCommand, CommandError
import sqlite3
import os
from sqlite3 import Error
from csv import reader

class Command(BaseCommand):
    """
        Analyze podcast files
    """
    help = 'Analyze podcast files. Determine #same, #num missing and #popScoreChange'
    

    def handle(self, *args, **options):
        """
            TODO: This is a dumb O(n^2) operation. Please improve later
        """
        pod_list = []
        no_match = 0
        pop_change = 0
        dir_path = os.path.join(
            os.path.abspath(os.path.dirname('manage.py')), 'system/')


        with open(os.path.join(dir_path, 'archive_podcast_files/first.txt'), "r" ) as f:
            for line in reader(f, delimiter=','):
                #print(line[0])
                rss_feed = line[0]
                pop_score = line[4]
                podcast = {"rss_feed":rss_feed, "pop_score":pop_score}
                pod_list.append(podcast)

        with open(os.path.join(dir_path, 'archive_podcast_files/second.txt'), "r" ) as f:
            for line in reader(f, delimiter=','):
                rss_feed = line[0]
                pop_score = line[4]
                found_pod = [podcast for podcast in pod_list if podcast["rss_feed"] == rss_feed]
                if len(found_pod) ==1:
                    pod = found_pod[0]
                    if pod["pop_score"] != pop_score:
                        pop_change +=1
                else:
                    no_match +=1
                #pass

        self.stdout.write(self.style.ERROR(f"# not matching: {no_match}"))
        self.stdout.write(self.style.ERROR(f"# popularity scores changed: {pop_change}"))



    
from django.core.management.base import BaseCommand, CommandError
from podcasts.models import Podcast
from system.models import PodcastIndex
from csv import reader
from django.core.files.storage import default_storage
import boto3

class CSVLines:
    """
        iterator for boto3 read()
    """
    _csv_lines = None
    _cur_index = 0
    def __init__(self, csv):
        self._csv_lines = csv.split('\n')

    def __iter__(self):
        return self

    def __next__(self):
        if self._cur_index >= len(self._csv_lines):
            raise StopIteration

        answ = self._csv_lines[self._cur_index]

        if answ == '' or answ == ' ':
            raise StopIteration

        self._cur_index += 1
        return answ


class Command(BaseCommand):
    help = 'Read in temp file from S3 temp/temp.txt. Insert or update items into database'
    def popScore(self):
        # Update just the popularity score on existing objects
        updatedObjects = []
        newObjects = []
        p = None
        created = 0
        pi = None
        try:
            pi = PodcastIndex.objects.all()[0]
        except Exception as e:
            self.stdout.write(self.style.ERROR(e))
        else:
            if pi == None:
                self.stdout.write(self.style.ERROR("File not found"))

        # To read files from aws: 
        #    https://www.edureka.co/community/17558/python-aws-boto3-how-do-i-read-files-from-s3-bucket

        with default_storage.open('temp/temp.txt', 'r') as f:
            self.stdout.write(self.style.SUCCESS(f"Opened file"))        
            
            csv_obj = CSVLines(f.read())
            for line in reader(csv_obj):
                modified = False
                try:
                    p = Podcast.objects.get(rss_feed = line[0])
                except Podcast.DoesNotExist as e:
                    pass

                else:

                    if p.indexPopularityScore != int(line[4]):
                        p.indexPopularityScore = int(line[4])
                        updatedObjects.append(p)
            try:
                # Update existing objects
                Podcast.objects.bulk_update(updatedObjects, fields=['indexPopularityScore'], batch_size=100)
            except Exception as e:
                self.stdout.write(self.style.ERROR(e))
            else:
                self.stdout.write(self.style.SUCCESS(f"Updated {len(updatedObjects)} podcasts"))


    def update(self):
        updatedObjects = []
        newObjects = []
        p = None
        created = 0
        with default_storage.open('temp/temp.txt', 'r') as f:
            self.stdout.write(self.style.SUCCESS(f"Opened file"))        
            csv_obj = CSVLines(f.read())
            for line in reader(csv_obj):
                modified = False
                try:
                    p = Podcast.objects.get(rss_feed = line[0])
                except Podcast.DoesNotExist as e:
                    # Let's create a new one
                    p = Podcast(
                        rss_feed = line[0], 
                        image_url=line[1],
                        name=line[2],
                        author=line[3],
                        indexPopularityScore=line[4]
                        )                
                    newObjects.append(p)
                    continue

                if p.image_url != line[1]:
                    p.image_url = line[1]
                    modified = True

                if p.name !=line[2]:
                    p.name = line[2]
                    modified = True

                if p.author != line[3]:
                    p.author = line[3]
                    modified = True

                if p.indexPopularityScore != int(line[4]):
                    p.indexPopularityScore = int(line[4])
                    modified = True

                if modified:
                    updatedObjects.append(p)

            try:
                # Create new ones
                Podcast.objects.bulk_create(newObjects, batch_size=100, ignore_conflicts = True)
            except Exception as e:
                self.stdout.write(self.style.ERROR(e))
            else:
                self.stdout.write(self.style.SUCCESS(f"Inserted {len(newObjects)} podcasts"))

            try:
                # Update existing objects
                Podcast.objects.bulk_update(updatedObjects, fields=['image_url','name','author','indexPopularityScore'], batch_size=100)
            except Exception as e:
                self.stdout.write(self.style.ERROR(e))
            else:
                self.stdout.write(self.style.SUCCESS(f"Updated {len(updatedObjects)} podcasts"))


    def insert_new(self):
        podcastObjects = []
        with default_storage.open('temp/temp.txt', 'r') as f:
            self.stdout.write(self.style.SUCCESS(f"Opened file"))
            csv_obj = CSVLines(f.read())
            for line in reader(csv_obj):
                if len(line) != 6:
                    continue # dud
                p = Podcast(
                    rss_feed = line[0], 
                    image_url=line[1],
                    name=line[2],
                    author=line[3],
                    indexPopularityScore=line[4]
                    )
                podcastObjects.append(p)

        try:
            Podcast.objects.bulk_create(podcastObjects, ignore_conflicts = True)
        except Exception as e:
            self.stdout.write(self.style.ERROR(e))
            return
        self.stdout.write(self.style.SUCCESS(f"Inserted {len(podcastObjects)} podcasts"))


    def add_arguments(self, parser):

        # Named (optional) arguments
        parser.add_argument(
            '--update',
            action='store_true',
            help='Update existing podcasts, add new if not exist',
        )
        parser.add_argument(
            '--popscore',
            action='store_true',
            help='just update pop score of existing podcasts',
        )        

    def handle(self, *args, **options):
        if options['update']:
            self.update()
        elif options['popscore']:
            self.popScore()
        else:
            self.insert_new()

                

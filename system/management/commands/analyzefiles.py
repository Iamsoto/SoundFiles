from django.core.management.base import BaseCommand, CommandError
import sqlite3
import os
from sqlite3 import Error

class Command(BaseCommand):
    """
        Analyze podcast files
    """
    help = 'Analyze podcast files. Determine #same, #num missing and #popScoreChange'
    

    def handle(self, *args, **options):
        db_location = os.path.join(
            os.path.abspath(os.path.dirname('manage.py')), 'system/archive_podcast_files/')
        dir_path = os.path.dirname(os.path.realpath(__file__))
                for file in os.listdir(os.path.join(dir_path, 'xml_files/')):
                    with open(os.path.join(dir_path, 'xml_files/', file), "r" ) as f:
                        


    
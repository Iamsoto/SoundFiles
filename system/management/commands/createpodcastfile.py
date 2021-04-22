from django.core.management.base import BaseCommand, CommandError
import sqlite3
import os
from sqlite3 import Error

class Command(BaseCommand):
    """
        createpodcastfile
    """
    help = 'Please run this on your local machine, with the podcastindex db in the same directory as system\ncreatepodcastfile spits out a file in the main path'

    def create_connection(self, db_file):
        """ create a database connection to the SQLite database
            specified by the db_file
            :param db_file: database file
            :return: Connection object or None
        """
        conn = None
        try:
            conn = sqlite3.connect(db_file)
        except Error as e:
            print(e)

        return conn

    def write_podcasts(self, conn):
        """
            Query all rows in the tasks table
            :param conn: the Connection object
            :return:
        """
        cur = conn.cursor()
        cur.execute("SELECT \
            url,\
            imageUrl,\
            title,\
            itunesAuthor, \
            popularityScore \
            FROM podcasts \
            WHERE (dead == 0) \
            AND (lastHttpStatus < 400) \
            AND (episodeCount) > 0 \
            ORDER BY popularityScore DESC\
            LIMIT(10000)") # Should return 10,000 podcasts

        rows = cur.fetchall()

        with open("temp.txt", 'w+') as f:
                
            for row in rows:
                output = ""

                for item in row:
                    item_string = ""   

                    item_string = str(item)
                    item_string = item_string.replace('"', '')
                    item_string = item_string.replace('\'', '')
                    item_string = item_string.replace(',', '')
                    
                    output= output +  '"' + item_string + '"' +','
                    
                    item_string=""

                f.write(output)
                output = ""
                f.write('\n')
    

    def handle(self, *args, **options):
        db_location = os.path.join(
            os.path.abspath(os.path.dirname('manage.py')),
            'system/podcastindex_feeds.db'
            )
        self.stdout.write(db_location)
        conn = self.create_connection(db_location) # Must be in the same directory...
        self.write_podcasts(conn)



    
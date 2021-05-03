from django.core.management.base import BaseCommand, CommandError
import sqlite3
import os
from datetime import date
from podcasts.models import Podcast
from slugify import slugify
from sqlite3 import Error


class Command(BaseCommand):
    def header(self):
        return '<?xml version="1.0" encoding="UTF-8"?>\n'


    def get_URLs(self):
        """
<url>
        <loc>https://www.yoursite.com/</loc>
        <lastmod>2019-03-29</lastmod>
        <changefreq>weekly</changefreq>
        <priority>1.0</priority>
    </url>
        """
        podcasts = Podcast.objects.all()
        for podcast in podcasts:
            yield f'\n<url>\n\
                <loc>https://soundfiles.fm/podcast/{podcast.pk}/{slugify(podcast.name)}</loc>\n\
                <lastmod>{date.today().strftime("%Y-%m-%d")}</lastmod>\n\
                <changefreq>daily</changefreq>\n\
                <priority>1.0</priority>\n\
            </url>\
            '

    def handle(self, *args, **options):
        with open('sitemap.xml', 'w+') as f:
            f.write(self.header())
            f.write('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"/xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9 http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">')
            for URL in self.get_URLs():
                f.write(URL)
            f.write('</urlset>')




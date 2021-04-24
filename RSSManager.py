import bs4 as bs
from django.utils import timezone
from datetime import datetime
from dateutil import parser, tz


import re

class FakeEpisode:
    name=""
    url=""
    guid=""
    description=""
    pub_date=None
    duration=0
    def __init__(self, 
        name, 
        url, 
        guid,
        description = None,
        pub_date = timezone.now(),
        duration=0

        ):
        self.name = name
        self.url = url
        self.guid = guid
        self.description = description
        self.pub_date = pub_date
        self.duration = duration


class GetRequestXML:

    @classmethod
    def make_get_request(cls, url, extra_headers= {}):
        """
            TODO: This should act as a singular method for
                both the fetch command and podcast.views
        """
        pass


class RSSParser:
    
    # these should all be the same size
    accepted_start_tags_byte = [b'<rss', b'<?xm']
    accepted_start_tags_str = ['<rss', '<?xm']
    _title = ""
    _image = ""
    _description = ""
    _url=""
    _episodes=[]
    _category=""
    _author=""

    # Referenced from here: 
    # #https://stackoverflow.com/questions/9662346/python-code-to-remove-html-tags-from-a-string
    cleanr = re.compile('<.*?>|&([a-z0-9]+|#[0-9]{1,6}|#x[0-9a-f]{1,6});')
    
    def __init__(self, xml):
        """
            XML should really be a string
        """
        self.xml = xml
        self._parse()

    def _convert_string_to_seconds(self, time):
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

    def _parse(self):
        """
            Universal parse function, obtain all attributes... 

        """
        # Note: please don't use lxml
        # see: https://groups.google.com/g/beautifulsoup/c/2yMjUYTIaiQ
        feed = bs.BeautifulSoup(self.xml, 'xml')
        channel = feed.channel
        episodes = []
        guid = None
        if channel is not None:

            # Title
            if channel.title is not None:
                if channel.title.string is not None:
                    # Clean any HTML tags
                    self._title = re.sub(self.cleanr, '', channel.title.string)
                else:
                    self._title = re.sub(self.cleanr, '',channel.title.getText())

            # Description
            if channel.description is not None:
                if channel.description.string is not None:
                    self._description = re.sub(self.cleanr, '', channel.description.string)
                else:
                    self._description = re.sub(self.cleanr, '', channel.description.getText())

            # Image...
            for image in channel.find_all(re.compile("image")):
                if image.url is not None:
                    self._image=channel.image.url.string
                    break
                else:
                    if "href" in image.attrs:
                        self._image= image["href"]
                        break

            # Get Channel URL
            atom_links = channel.find_all(re.compile("link"))
            for link in atom_links:
                if 'rel' in link.attrs:
                    if link['rel'] == "self":
                        self._url= link['href']
                        break

            author = channel.find_all(re.compile("author"))
            if len(author) > 0:
                self._author = author[0].getText()

            # Get category
            categories = channel.find_all("category")
            if (len(categories) > 0) and ("text" in categories[0].attrs):
                self._category = categories[0].attrs["text"]


            # Find all episodes
            items = channel.find_all("item")
            for item in items:
                if item.title:
                    if item.title.string:
                        title = re.sub(self.cleanr, '', item.title.string)
                    else:
                        title= re.sub(self.cleanr, '', item.title.getText())

                enclosure = item.enclosure
                url = ''
                description = ""
                pub_date = datetime.now(timezone.utc)

                if enclosure is not None:
                    url = enclosure.get('url')
                else:
                    # TODO: get the "link"
                    pass
                
                if item.guid is not None:
                    guid = str(item.guid.string)
                else:
                    guid = url

                if item.description is not None:
                    if item.description.string:
                        description = re.sub(self.cleanr, '', item.description.string)
                    else:
                        description = re.sub(self.cleanr, '', item.description.getText())
                else:
                    # Does it have a summary attribute instead?
                    description = re.sub(self.cleanr, '', item.summary.getText())

                if item.pubDate is not None:
                    pub_date = parser.parse(item.pubDate.string,  ignoretz=True)

                duration = item.find_all('duration')
                if len(duration) > 0:
                    duration = duration[0].string
                else:
                    duration = "0"

                if ':' in duration:
                    duration = self._convert_string_to_seconds(duration)

                try:
                    duration = int(duration)            
                except Exception as e:
                    #print(e)
                    duration = 0

                episodes.append(FakeEpisode(title, url, guid, description, pub_date, duration))

            self._episodes=episodes

        else:
            return;

    
    def get_category(self):
        """
        
        """
        return self._category

    
    def get_author(self):
        return self._author

    
    def get_channel_episodes(self):
        """
        TODO: Check
            1 link 
                (some RSS feeds don't have a link for items)
                then enclosure url if link not available

        """
        return self._episodes

    def get_channel_description(self):
        """
        Get description of the channel
        """

        return self._description


    def get_channel_title(self):
        """
        Get title of Channel
        """         
        return self._title


    def get_channel_image(self):
        """
        Get URL of channel
        """
        return self._image


    def get_channel_url(self):
        """
        Get URL of Channel
        """

        return self._url
    
    @classmethod
    def remove_header_from_string(cls, str_input):
        """
            Deemed not important
        """
        pass
    

    @classmethod
    def remove_header_from_stream(cls, stream):
        """
            Take in xml byte-stream as input, 
            return xml byte-stream with a removed header.

            will return None if xml header cannot be found
            Or if exceeds > 1000 iterations
        """
        xml = b''
        snip = b''
        iter_num = 0
        while True:
            if iter_num > 1000:
                break
            # read one snip at a time
            snip = stream.read(len(cls.accepted_start_tags_byte[0]))
            if len(snip) == 0:
                # Reached the end of the xml. Exit
                break
            else:
                xml = xml + snip
            for tag in cls.accepted_start_tags_byte:
                start = xml.find(tag)
                if  start != -1:
                    # We found where to snip the string...
                    xml = xml[start:]

                    # Okay, now read rest...
                    xml = xml + stream.read()
                    return xml

            iter_num = iter_num + 1
            # reset snip
            snip = b''

        return None 



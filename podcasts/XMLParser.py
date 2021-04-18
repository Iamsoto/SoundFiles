from rest_framework.parsers import BaseParser
from RSSManager import RSSParser

class XMLParser(BaseParser):
    """
        Custom XML Parser. Needed for DRF to accept application/xml content
        for mroe info, please see: 
        https://www.django-rest-framework.org/api-guide/parsers/
    """
    media_type = 'application/xml'



    def parse(self, stream, media_type='', parser_context=None ):
        """
            
        """
        return RSSParser.remove_header_from_stream(stream)

        # Couldn't find a proper xml
        return None


        
            


def makerequest(podcast):
    # Cheap tricks...
    headers={
    'user-agent': 
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88.0.4324.182 Safari/537.36'}
    
    if podcast.etag != 'n/a' and podcast.etag is not None:
        headers['If-None-Match'] = podcast.etag
    
    if podcast.last_modified != 'n/a' and podcast.last_modified is not None:
        headers['If-Modified-Since'] = podcast.last_modified            

    try:

        r = requests.request(method='GET', url=podcast.rss_feed, timeout=3.1, headers=headers)

    except requests.RequestException as e:
        self.stdout.write(self.style.ERROR(e))
        continue

    except requests.ConnectionError as e:
        self.stdout.write(self.style.ERROR(e))
        continue

    except requests.HTTPError as e:
        self.stdout.write(self.style.ERROR(e))
        continue

    except requests.TooManyRedirects as e:
        self.stdout.write(self.style.ERROR(e))
        continue

    except requests.ConnectTimeout as e:
        self.stdout.write(self.style.ERROR(e))
        continue

    except requests.ReadTimeout as e:
        self.stdout.write(self.style.ERROR(e))
        continue

    except requests.Timeout as e:
        self.stdout.write(self.style.ERROR(e))
        continue

    except Exception as e:
        self.stdout.write(self.style.ERROR("Unnown error: {}".format(str(e))))
        continue

    if r.status_code < 400:
        #self.stdout.write(self.style.SUCCESS('{} on: {}\n'.format(r.status_code, podcast.rss_feed)))
        pass
        
    else:
        self.stdout.write(self.style.ERROR('{} Fetching from: {}\n'.format(r.status_code, podcast.rss_feed)))	
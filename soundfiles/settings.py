from pathlib import Path
import os
import dj_database_url

############################################
# deployment sensetive material 
#############################################
# un-comment this if serving on a local box

if 'heroku' not in os.environ: 

    from set_environ import set_environ 
    set_environ()

############################################
# Debug
#############################################
DEBUG = True


############################################
# Allowed Host
#############################################
ALLOWED_HOSTS = [os.environ.get('allowed_host')]


############################################
# Base URL
#############################################
__APIROOT_URL__ = os.environ.get('__APIROOT_URL__')


############################################
# Base Directory
#############################################
BASE_DIR = Path(__file__).resolve().parent.parent


############################################
# Functions to set platform-dependant 
# variables
#############################################


##################
# Database
##################
def set_default_db(DATABASES):
    if 'heroku' in os.environ:
        prod_db  =  dj_database_url.config()
        DATABASES['default'].update(prod_db)
    else:
        tiny_db = {'ENGINE': 'django.db.backends.sqlite3',
            'NAME': os.path.join(BASE_DIR, 'db.sqlite3')}
        DATABASES['default'].update(tiny_db)


##################
# React
##################
# Templates
def set_template_dirs(TEMPLATE_DIRS):
    TEMPLATE_DIRS.append(os.path.join(BASE_DIR, 'build/'))
        

# Static files
def set_staticfiles_dirs(STATICFILES_DIRS):
    STATICFILES_DIRS.append(os.path.join(BASE_DIR, 'build/static/'))


##################
# CORS
##################
def set_cors(CORS):
    if 'heroku' in os.environ:
        # If on heroku, do nothing
        return
    else:
        CORS.append('http://127.0.0.1:8000')
        CORS.append('http://127.0.0.1:3000')
        CORS.append('http://localhost:3000')
        CORS.append('http://localhost:8000')


############################################
# Accepted file types
#############################################
ACCEPTED_AUDIO_FILES = ['.mp3', '.mp4', '.m4a', '.mp4']
ACCEPTED_IMAGE_FILES = ['.png', '.jpg', '.jpeg']


############################################
# Django Secret Key
#############################################
SECRET_KEY = os.environ.get('Django_App_Key', None)


############################################
# AWS Config
#############################################
AWS_STORAGE_BUCKET_NAME = os.environ.get('S3_BUCKET_NAME')
AWS_S3_REGION_NAME = os.environ.get('S3_REGION_NAME') # e.g. us-east-2
AWS_ACCESS_KEY_ID = os.environ.get('AMAZON_ACCESS_KEY')
AWS_SECRET_ACCESS_KEY = os.environ.get('AMAZON_ACCESS_SECRET')
AWS_S3_CUSTOM_DOMAIN = '%s.s3.amazonaws.com' % AWS_STORAGE_BUCKET_NAME
AWS_LOCATION = os.environ.get('AWS_LOCATION')


############################################
# Cors
#############################################
http = ["http://{}".format(item) for item in ALLOWED_HOSTS]
https = ["https://{}".format(item) for item in ALLOWED_HOSTS]

_cors_list =  http + https # By default, the host url MUST be on the whitelist
_cors_list.append('https://{}.{}.amazonaws.com'.format(AWS_STORAGE_BUCKET_NAME, AWS_LOCATION)) # AWS 
#TODO: must add cdn when that becomes available

set_cors(_cors_list)

CORS_ORIGIN_WHITELIST = _cors_list


############################################
# login/logout values
#############################################
#LOGOUT_URL = '/'
#LOGIN_URL = '/users/login/'
#LOGIN_REDIRECT_URL = '/users/'
#LOGOUT_REDIRECT_URL = '/'


############################################
# Custom Users
#############################################
AUTH_USER_MODEL = 'users.SoundFileUser'


############################################
# Database
#############################################
# https://docs.djangoproject.com/en/3.0/ref/settings/#databases

DATABASES = {
    'default': {

    }
}
set_default_db(DATABASES)


############################################
# CSRF cookie secure - I forget why this is here honestly
# But some Ajax requests need it to be true
#############################################
CSRF_COOKIE_SECURE = False

# Application definition


#############################################
# Django Rest Framework stuff
#############################################

REST_FRAMEWORK = {
    'DEFAULT_PAGINATION_CLASS': 'rest_framework.pagination.LimitOffsetPagination',
    'PAGE_SIZE': 20,

    'DEFAULT_AUTHENTICATION_CLASSES': [
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    ],
    'DEFAULT_THROTTLE_CLASSES': [
        'throttles.UserBurstRateThrottle',
        'throttles.UserSustainedRateThrottle',
        'throttles.AnonBurstRateThrottle',
        'throttles.AnonSustainedRateThrottle'
    ],
    'DEFAULT_THROTTLE_RATES': {
        'burst': '120/min',
        'sustained': '10000/day'
    }
}

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'users',
    'podcasts',
    'system',
    'mptt',
    'userfeatures',
    'rest_framework',
    'rest_framework_simplejwt',   
    'corsheaders',
    'storages',
]

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',

]

ROOT_URLCONF = 'soundfiles.urls'

_template_dirs = [os.path.join(BASE_DIR, 'templates')]
set_template_dirs(_template_dirs)
TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': _template_dirs,
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'soundfiles.wsgi.application'


############################################
# Authentication 
#############################################
# Password validation
# https://docs.djangoproject.com/en/3.1/ref/settings/#auth-password-validators

AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]


############################################
# Authentication 
#############################################
AUTHENTICATION_BACKENDS = (
    'django.contrib.auth.backends.ModelBackend', # <-- Default user authentication
)


############################################
# 
#############################################

LANGUAGE_CODE = 'en-us'

TIME_ZONE = 'UTC'

USE_I18N = True

USE_L10N = True

USE_TZ = True


############################################
# Media and static file configuration. Be extremely careful here
#############################################

STATIC_ROOT = os.path.join(BASE_DIR, 'staticfiles/') # Where static files will be collected

_staticfiles_dirs = []
set_template_dirs(_staticfiles_dirs)
STATICFILES_DIRS = _staticfiles_dirs

# url should look like: https://soundfilesdev.s3-us-west-2.amazonaws.com/*
STATIC_URL = 'https://{}.{}.amazonaws.com/'.format(AWS_STORAGE_BUCKET_NAME, AWS_LOCATION) # Where the static files will be served
STATICFILES_STORAGE = 'storage_backends.StaticStorage'
DEFAULT_FILE_STORAGE = 'storage_backends.MediaStorage'
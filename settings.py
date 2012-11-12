#coding=utf8
# Initialize App Engine and import the default settings (DB backend, etc.).
# If you want to use a different backend you have to remove all occurences
# of "djangoappengine" from this file.
from djangoappengine.settings_base import *

import os

# Activate django-dbindexer for the default database
DATABASES['native'] = DATABASES['default']
DATABASES['default'] = {'ENGINE': 'dbindexer', 'TARGET': 'native'}
AUTOLOAD_SITECONF = 'indexes'

SECRET_KEY = '=r-$b*8hglm+858&9t043hlm6-&6-3d3vfc4((7yd0dbrakhvi'

ACCOUNT_ACTIVATION_DAYS = 3

EMAIL_USE_TLS = True
EMAIL_HOST = 'smtp.gmail.com'
EMAIL_HOST_USER = 'register@6cans.com'
EMAIL_HOST_PASSWORD = '@)!@wearepopcans'
EMAIL_PORT = 587
LOGIN_REDIRECT_URL = '/'

INSTALLED_APPS = (
#    'django.contrib.admin',
    'django.contrib.contenttypes',
    'django.contrib.auth',
    'django.contrib.sessions',
    'djangotoolbox',
    'autoload',
    'dbindexer',

    # djangoappengine should come last, so it can override a few manage.py commands
    'djangoappengine',
    'registration',
    
    'audit',
    'authorize',
    'base',
    'content',
    'account_settings',

    'brand',
    'friendships',
    'identity',
    'payment',
    'shopping',
)

MIDDLEWARE_CLASSES = (
    # This loads the index definitions, so it has to come first
    'autoload.middleware.AutoloadMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
)

TEMPLATE_CONTEXT_PROCESSORS = (
    'django.contrib.auth.context_processors.auth',
    'django.core.context_processors.request',
    'django.core.context_processors.media',
)

TEMPLATE_LOADERS = (
    ('pyjade.ext.django.Loader',(
        'django.template.loaders.filesystem.Loader',
        'django.template.loaders.app_directories.Loader',
    )),
)

# This test runner captures stdout and associates tracebacks with their
# corresponding output. Helps a lot with print-debugging.
TEST_RUNNER = 'djangotoolbox.test.CapturingTestSuiteRunner'

ADMIN_MEDIA_PREFIX = '/media/admin/'
TEMPLATE_DIRS = (os.path.join(os.path.dirname(__file__), 'templates'),)

ROOT_URLCONF = 'urls'

AUTH_PROFILE_MODULE = 'authorize.UserProfile'

EMAIL_BACKEND = 'appengine_emailbackend'

# 阿里云授权
ALI_HOST="storage.aliyun.com"
ALI_ACCESS_ID = 'ACS6QPMSRSoP3UAt'
ALI_SECRET_KEY = 'RAzV4IsUIJ'
# 新浪微博授权
SINA_APP_KEY = '2155360547'
SINA_APP_SECRET = '404ec7e7aed27bcff7b5fa1c46754ead'
SINA_CALLBACK = 'http://www.6cans.com/authorize/sinacallback'
# 腾讯微博授权
QQ_APP_KEY = '801215297'
QQ_APP_SECRET = '46798ff45e976e5d5719693033f2a88e'
QQ_CALLBACK = 'http://www.6cans.com/authorize/qqcallback/'
# 人人微博授权
RENREN_APP_ID = '211852'
RENREN_APP_KEY ='f8cd13bc2bdf40dbaf18396e50988858'
RENREN_APP_SECRET ='fd12bfff22b84549800b1edf01ec7d90'
RENREN_CALLBACK ='http://www.6cans.com/authorize/renrencallback/'
#豆瓣授权
DOUBAN_APP_KEY =  '033607c1e495783309a21745adc06899'
DOUBAN_APP_SECRET = 'eae1057d89c1f1a7'
DOUBAN_CALLBACK = 'http://www.6cans.com/authorize/doubancallback/'
#Twitter授权
TWEET_CONSUMER_KEY = 'L0quzuxgHomQQsksnbJg'
TWEET_CONSUMER_SECRET = 'sbwVNmoBSJFaWmWo1TKQRL57fccrIjV2y3CZ71ddY'
TWEET_CALLBACK = 'http://www.6cans.com/authorize/tweet_callback/'
#coding=utf8
'''
Created on 2012-9-19

@author: senon
'''
from django.conf.urls.defaults import patterns, url

urlpatterns = patterns('friendships.views',
                       
   url(r'^concerned_about_friends/', 'concerned_about_friends')
    
)
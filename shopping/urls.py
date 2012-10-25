#coding=utf8

from django.conf.urls.defaults import patterns, url

urlpatterns = patterns('shopping.views',
                       
    url(r'choose_identity/', 'choose_identity'),
    
)
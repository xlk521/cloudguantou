#coding=utf8

from django.conf.urls.defaults import patterns, url

urlpatterns = patterns('identity.views',
                       
    url(r'choose_identity/', 'choose_identity'),
    url(r'identity/', 'identity'),
    url(r'personal_details/', 'personal_details'),
    url(r'works_details/', 'works_details'),
)
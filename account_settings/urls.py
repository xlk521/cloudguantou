#coding=utf8

from django.conf.urls.defaults import patterns, url

urlpatterns = patterns('account_settings.views',
                       
    url(r'base_info_set/', 'base_info_set'),
    url(r'deliver_address/', 'deliver_address'),
    url(r'invite_friends/', 'invite_friends'),
    url(r'my_order/', 'my_order'),
    url(r'related_set/', 'related_set'),
    
    
)
'''
Created on 2012-10-1

'''
from django.conf.urls.defaults import patterns, url


urlpatterns = patterns('utils.views',

    url(r'^initialization/', 'initialization'),
    
    url(r'^cleanupData/', 'cleanupDataBase'),
    
    url(r'^initProvince/', 'WriteLoctionJsonToDatabase'),
    
)

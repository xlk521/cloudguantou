'''
Created on 2012-10-1

@author: damon
'''
from django.conf.urls.defaults import patterns, url


urlpatterns = patterns('base.views',

    url(r'^$', 'index'),
    
    url(r'get_current_albumdata/', 'get_current_albumdata')
    
    #url(r'^getAjaxAlbums$', 'getAjaxAlbums')

)

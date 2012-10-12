#coding=utf8
'''
Created on 2012-9-19

@author: senon
'''
from django.conf.urls.defaults import patterns, url

urlpatterns = patterns('content.views',
                       
    url(r'content_following/', 'getFriendsProfile', {'page':'following'}),
    
    url(r'personal/', 'personal_index'),
<<<<<<< HEAD
    #(P<user_id>)
    url(r'content_indxe/', 'content_index'),
=======
    
    url(r'content_index/', 'content_index'),
>>>>>>> branch 'master' of https://github.com/guiyang/cloudguantou.git
    
    url(r'content_follower/', 'getFriendsProfile', {'page' :'follower'}),
    
    url(r'upload/', 'up_load')
    
)

#coding=utf8
'''
Created on 2012-9-19

@author: senon
'''
from django.conf.urls.defaults import patterns, url

urlpatterns = patterns('content.views',
    
    url(r'^content_following/', 'getFriendsProfile', {'page':'following'}),
    
    url(r'^personal/(?P<id>\S+)/', 'personal_index'),

    #目录页
    url(r'^index/(?P<cans_id>\S+)/', 'content_index', name='content_index'),

    #获取用户头像
    url(r'^work/(?P<photo_key>\S+)', 'serve_work'),
        
    #获取系列作品内容
    url(r'getWorks/', 'get_works'),

    url(r'^content_follower/#', 'getFriendsProfile', {'page' :'follower'}),
    
    url(r'^upload/$', 'up_load'),
    #批量获得上传路径
    url(r'^work_upload/$', 'work_upload'),
)

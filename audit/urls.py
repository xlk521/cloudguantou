#coding=utf8
'''
Created on 2012-10-30

@author: Damon
'''
#coding=utf8
from django.conf.urls.defaults import patterns, url

urlpatterns = patterns('audit.views',

    url(r'^portfolio/waitingaudit/$', 'get_waiting_audit'),

    url(r'^$', 'audit_index'),

)
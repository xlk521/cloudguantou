#coding=utf8
from django.conf.urls.defaults import patterns, url, include

handler500 = 'djangotoolbox.errorviews.server_error'

urlpatterns = patterns('',
    ('^_ah/warmup$', 'djangoappengine.views.warmup'),
    #('^$', 'django.views.generic.simple.direct_to_template',{'template': 'home.html'}),
    
    #用户注册及登陆流程
    url(r'^accounts/', include('registration.backends.default.urls')),

    url(r'^authorize/', include('authorize.urls')),

    url(r'^$', include('base.urls')),
)

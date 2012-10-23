#coding=utf8
from django.conf.urls.defaults import patterns, url, include
from django.http import HttpResponse

handler500 = 'djangotoolbox.errorviews.server_error'

urlpatterns = patterns('',
    ('^_ah/warmup$', 'djangoappengine.views.warmup'),
    #('^$', 'django.views.generic.simple.direct_to_template',{'template': 'home.html'}),
    
    #用户注册及登陆流程
    url(r'^accounts/', include('registration.backends.default.urls')),

    url(r'^authorize/', include('authorize.urls')),

    url(r'^$', include('base.urls')),

    url(r'^status', 'base.views.status'),
    
    url(r'^content/', include('content.urls')),
    
    url(r'^account_settings/', include('account_settings.urls')),
    
    url(r'^identity/', include('identity.urls')),
    
    url(r'^payment/', include('payment.urls')),
    
    url(r'^friendships/', include('friendships.urls')),
    
    url(r'^shopping_cart/', include('shopping_cart.urls')),
    
    url(r'^utils/', include('utils.urls'))
)

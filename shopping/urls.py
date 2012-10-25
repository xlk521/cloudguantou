#coding=utf8

from django.conf.urls.defaults import patterns, url

urlpatterns = patterns('shopping.views',

	url(r'^product/(?P<work_id>\S+)/', 'get_product'),

    url(r'^cart/(?P<work_id>\S+)/', 'get_cart'),
    
)
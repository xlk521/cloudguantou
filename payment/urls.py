#coding=utf8

from django.conf.urls.defaults import patterns, url

urlpatterns = patterns('payment.views',
                       
    url(r'order_check/', 'order_check'),
    url(r'order_ok/', 'order_ok'),
    url(r'order_write/', 'order_write'),
    
    
)
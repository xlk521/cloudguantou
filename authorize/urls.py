#coding=utf8
from django.conf.urls.defaults import patterns, url

urlpatterns = patterns('authorize.views',
    url(r'identity/', 'identity'),
    #用户上传图像
    url(r'head_upload/', 'handle_head_upload'),
    #根据省名称获取对应城市名称
    url(r'get_cities/', 'get_cities'),
)

urlpatterns += patterns('authorize.qq_views',
    # 腾讯账户授权
    url(r'^qqauth/', 'qqauth'),
    # 腾讯授权回调地址
    url(r'^qqcallback', 'qqcallback'),
)

urlpatterns += patterns('authorize.sina_views',
     #新浪账户授权
    url(r'^sinaauth/', 'sinaauth'),
    # 新浪授权回调地址
    url(r'^sinacallback', 'sinacallback'),
)

urlpatterns += patterns('authorize.douban_views',
    # 豆瓣授权
    url(r'doubanauth/', 'doubanauth'),

    url(r'doubancallback', 'doubancallback'),
)

urlpatterns += patterns('authorize.renren_views',
    
    url(r'renrenauth/', 'renrenauth'),
    
    url(r'renrencallback/', 'renrencallback'),
)
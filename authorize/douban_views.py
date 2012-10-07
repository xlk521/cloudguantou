'''
Created on 2012-9-11

@author: damon
'''
import logging

from django.conf import settings
from django.http import HttpResponseRedirect
from django.views.decorators.http import require_http_methods
from .models import DoubanProfileModel, DoubanProfileForm
from .views import __create_new_profile, __authenticate_and_login, __authenticate_failed, __handle_repeat, __handle_newcomer

from douban_client import DoubanClient

key = settings.DOUBAN_APP_KEY
secret = settings.DOUBAN_APP_SECRET
redirect = settings.DOUBAN_CALLBACK
scope = 'shou_basic_r,douban_basic_common'

@require_http_methods(['GET'])
def doubanauth(request):
    client = DoubanClient(key=key, secret=secret, redirect=redirect, scope=scope)
    url = client.authorize_url
    return HttpResponseRedirect(url)

@require_http_methods(['GET'])
def doubancallback(request):
    code = request.GET.get('code', False)
    logging.info(code)
    if code:
        client = DoubanClient(key=key, secret=secret, redirect=redirect, scope=scope)
        client.auth_with_code(code)
        logging.info('True')
        return __saveDoubanUserInfo(request, client)
    else:
        return __authenticate_failed(request)

def __saveDoubanUserInfo(request, client):
    user_info = client.user.me
    user_info['name'] = user_info['uid']
    uid = user_info['uid'] = user_info['id']
    profile = DoubanProfileModel.objects.get_or_none(uid=uid)
    if profile:
        profile.__dict__.update(user_info)
        profile.save()
        __authenticate_and_login(request=request, user=profile.cans_profile.user)
        return __handle_repeat(request)
    else:
        cans_id, password, cans_profile = __create_new_profile()
        douban_profile = DoubanProfileModel(cans_profile=cans_profile)
        f = DoubanProfileForm(user_info, instance=douban_profile)
        if f.is_valid():
            f.save()
            __authenticate_and_login(request=request, username=cans_id, password=password)
        else:
            logging.error(f.errors)
        return __handle_newcomer(request)
# Create your views here.
#coding=utf8
import logging
from datetime import datetime
import time
import email.utils

from django.conf import settings
from django.http import HttpResponseRedirect
from django.views.decorators.http import require_http_methods
from .models import SINAProfileModel, SINAProfileForm
from .views import __create_new_profile, __authenticate_and_login, __authenticate_failed, __handle_repeat, __handle_newcomer
from weibo.weibo import APIClient

APP_KEY = settings.SINA_APP_KEY
APP_SECRET = settings.SINA_APP_SECRET
REDIRECT_URI = settings.SINA_CALLBACK

@require_http_methods(["GET"])
def sinaauth(request):
    #新浪授权
    client = APIClient(app_key=APP_KEY, app_secret=APP_SECRET, redirect_uri=REDIRECT_URI)
    url = client.get_authorize_url()
    return HttpResponseRedirect(url)
    
@require_http_methods(['GET'])
def sinacallback(request):
    #新浪回调函数
    code = request.GET.get('code', False)
    if code:
        client = APIClient(app_key=APP_KEY, app_secret=APP_SECRET, redirect_uri=REDIRECT_URI)
        r = client.request_access_token(code)
        client.set_access_token(r.access_token, r.expires_in)
        return __save_sina_userinfo(request, client, r)
    else:
        return __authenticate_failed(request)
    
def __save_sina_userinfo(request, client, r):
    uid = r.uid
    user_show = client.get.users__show(uid=uid)
    user_show['created_at'] = datetime.fromtimestamp(time.mktime(email.utils.parsedate_tz(user_show['created_at'])[:9]))
    profile = SINAProfileModel.objects.get_or_none(uid=user_show['id'])
    if profile:
        profile.__dict__.update(user_show)
        profile.save()
        __authenticate_and_login(request=request, user=profile.cans_profile.user)
        return __handle_repeat(request)
    else:
        cans_id, password, cans_profile = __create_new_profile()
        sina_profile = SINAProfileModel(cans_profile=cans_profile)
        setattr(user_show, 'access_token', r.access_token)
        setattr(user_show, 'expires_in', r.expires_in)
        setattr(user_show, 'uid', user_show['id'])
        f = SINAProfileForm(user_show, instance=sina_profile)
        if f.is_valid():
            f.save()
            __authenticate_and_login(request=request, username=cans_id, password=password)
        else:
            logging.error(f.errors)
        return __handle_newcomer(request)

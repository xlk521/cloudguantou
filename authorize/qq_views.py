# Create your views here.
#coding=utf8
from .models import QQProfileModel, QQProfileForm
from .views import __create_new_profile, __authenticate_and_login, __authenticate_failed, __handle_repeat, __handle_newcomer
from django.conf import settings
from django.http import HttpResponseRedirect
from django.views.decorators.http import require_http_methods
from qqweibo import OAuthHandler
from qqweibo.auth import API
import logging

@require_http_methods(["GET"])
def qqauth(request):
    try:
        auth = OAuthHandler(settings.QQ_APP_KEY, settings.QQ_APP_SECRET, settings.QQ_CALLBACK)
        url = auth.get_authorization_url()
        request.session['qqauth'] = auth
        return HttpResponseRedirect(url)
    except Exception as e:
        logging.error(e)
        return HttpResponseRedirect('')

@require_http_methods(["GET"])
def qqcallback(request):
    auth = request.session.get('qqauth', False)
    token = request.GET.get('oauth_token', False)
    verifier = request.GET.get('oauth_verifier', False)
    openid = request.GET.get('openid', False)
    if token and verifier and openid:
        access_token = auth.get_access_token(verifier)
        api = API(auth_handler=auth)
        return __save_qq_userinfo(request, access_token, api)
    else:
        return __authenticate_failed(request)

def __save_qq_userinfo(request, access_token, api):
    try:
        user_info = api.user.info()
    except Exception as e:
        logging.error(e)
    profile = QQProfileModel.objects.get_or_none(openid = user_info.openid)
    if profile:
        profile.__dict__.update(user_info.__dict__)
        profile.save()
        __authenticate_and_login(request=request, user=profile.cans_profile.user)
        return __handle_repeat(request)
    else:
        cans_id, password, cans_profile = __create_new_profile()
        qq_profile = QQProfileModel(cans_profile=cans_profile)
        setattr(user_info, 'cans_id', cans_id)
        setattr(user_info, 'access_key', access_token.key )
        setattr(user_info, 'access_secret', access_token.secret)
        f = QQProfileForm(user_info.__dict__, instance=qq_profile)
        if f.is_valid():
            f.save()
            __authenticate_and_login(request=request, username=cans_id, password=password)
        else:
            logging.error(f.errors)
        return __handle_newcomer(request)

from .models import RenRenProfileModel, RenRenProfileForm
from .views import __create_new_profile, __authenticate_and_login, __authenticate_failed, __handle_repeat, __handle_newcomer
from datetime import datetime
from django.conf import settings
from django.http import HttpResponseRedirect
from django.views.decorators.http import require_http_methods
from oauth2 import RRClient
import json
import logging

log = logging.getLogger()

client_id = settings.RENREN_APP_KEY
client_secret = settings.RENREN_APP_SECRET
site = 'https://graph.renren.com'
redirect_uri = settings.RENREN_CALLBACK

@require_http_methods(["GET"])
def renrenauth(request):
    client = RRClient(client_id=client_id, 
                client_secret=client_secret, 
                site=site, 
                authorize_url='/oauth/authorize',
                token_url='/oauth/token')
    authorize_url = client.auth_code.authorize_url(redirect_uri=redirect_uri)
    return HttpResponseRedirect(authorize_url)

@require_http_methods(['GET'])
def renrencallback(request):
    code = request.GET.get('code', False)
    if code:
        client = RRClient(client_id=client_id, 
                    client_secret=client_secret, 
                    site=site, 
                    authorize_url='/oauth/authorize',
                    token_url='/oauth/token')
        access_token = client.auth_code.get_token(code, redirect_uri=redirect_uri)
        client.set_access_token(access_token.token)
        return __save_rr_userinfo(request, client)
    else:
        return __authenticate_failed(request)
    
def __save_rr_userinfo(request, client):
    try:
        user_info = client.user_getInfo()
        user_info = json.loads(user_info)[0]
    except Exception as e:
        log.error(e.message)
    log.debug(user_info)
    if user_info['hometown_location'].has_key('country'):
        user_info['hometown_location_country'] = user_info['hometown_location']['country']
    else:
        user_info['hometown_location_country'] = ''
    user_info['hometown_location_province'] = user_info['hometown_location']['province']
    user_info['homwtown_location_city'] = user_info['hometown_location']['city']
    if user_info['birthday'] == '0000-00-00':
        user_info['birthday'] = '1970-01-01'
    user_info['birthday'] = datetime.strptime(user_info['birthday'], '%Y-%m-%d')
    profile = RenRenProfileModel.objects.get_or_none(uid=user_info['uid'])
    if profile:
        profile.__dict__.update(user_info)
        profile.save()
        __authenticate_and_login(request=request, user=profile.cans_profile.user)
        return __handle_repeat(request)
    else:
        cans_id, password, cans_profile = __create_new_profile()
        qq_profile = RenRenProfileModel(cans_profile=cans_profile)
        f = RenRenProfileForm(user_info, instance=qq_profile)
        if f.is_valid():
            f.save()
            __authenticate_and_login(request=request, username=cans_id, password=password)
        else:
            log.error(f.errors)
        return __handle_newcomer(request)
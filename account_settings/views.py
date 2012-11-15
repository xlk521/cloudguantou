# Create your views here.
from django.shortcuts import render_to_response
from django.contrib.auth.decorators import login_required
from django.template.context import RequestContext
from django.contrib.auth.models import User
from google.appengine.ext import blobstore
from authorize.views import get_cities
@login_required
def base_info_set(request):
    profile = request.user.get_profile()
    user = User.objects.get(id=profile.user_id)
    upload_url = blobstore.create_upload_url('/authorize/head_upload/')
    #province = get_cities(request)
    #import logging
    #logging.error("province")
    #logging.error(request)
    return render_to_response('account_settings/baseInfoSet.html', {'profile':profile, "user":user, 'upload_url':upload_url }, context_instance=RequestContext(request))

@login_required
def deliver_address(request):
    return render_to_response('account_settings/deliver_address.jade', context_instance=RequestContext(request))

@login_required
def invite_friends(request):
    return render_to_response('account_settings/Invite_friends.jade', context_instance=RequestContext(request))

@login_required
def my_order(request):
    return render_to_response('account_settings/my_order.jade', context_instance=RequestContext(request))

@login_required
def related_set(request):
    return render_to_response('account_settings/relatedSet.jade', context_instance=RequestContext(request))
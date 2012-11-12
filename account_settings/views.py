# Create your views here.
from django.shortcuts import render_to_response
from django.contrib.auth.decorators import login_required
from django.template.context import RequestContext
from authorize.models import UserProfile

@login_required
def base_info_set(request):
    profile = request.user.get_profile()
    
    return render_to_response('account_settings/baseInfoSet.html', {'profile':profile},context_instance=RequestContext(request))

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
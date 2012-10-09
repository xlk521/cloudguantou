# Create your views here.
from django.shortcuts import render_to_response
from django.contrib.auth.decorators import login_required

@login_required
def base_info_set(request):
    return render_to_response('account_settings/baseInfoSet.jade')

@login_required
def deliver_address(request):
    return render_to_response('account_settings/deliver_address.jade')

@login_required
def invite_friends(request):
    return render_to_response('account_settings/Invite_friends.jade')

@login_required
def my_order(request):
    return render_to_response('account_settings/my_order.jade')

@login_required
def related_set(request):
    return render_to_response('account_settings/relatedSet.jade')
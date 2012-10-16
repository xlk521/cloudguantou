#coding = utf8
# Create your views here.
from authorize.models import UserProfile
from django.contrib.auth.decorators import login_required
from django.http import HttpResponse, HttpResponseRedirect, Http404
from django.shortcuts import render, render_to_response
from friendships.models import UserFriendshipProfileModel
from google.appengine.ext import blobstore
from utils.views import convertjson
import logging


log = logging.getLogger()
log.setLevel(logging.DEBUG)


@login_required
def personal_index(request):
    return render_to_response('content/personal_homepage.jade')

def content_index(request):
    
    return render(request, 'content/contents_list.jade', {'datetime':'ddd'})

#@login_required
def up_load(request):
    return render_to_response('upload/uploadpage.jade')

@login_required
def batch_upload_urls(request):
    quantity = int(request.GET.get('quantity', False))
    if not quantity:
        raise Http404
    else:
        urls = []
        for i in range(quantity-1):
            url = {}
            url['action'] = blobstore.create_upload_url('/authorize/head_upload/')
            urls.append(url)
        result = {
            'quantity':quantity,
            'urls':urls
        }
        return HttpResponse(convertjson(result))

@login_required
def getFriendsProfile(request, page):
    if request.method == 'GET':
        request.session['cursor'] = 0
        request.session['count'] = 0
        if page=='follower':
            return render(request, 'content/content_following.jade')
        elif page=='following':
            return render(request, 'content/content_follow.jade')

    elif request.method == 'POST':
        result = {}
    
        cursor = int(request.session.get('cursor', 0))
        relation = request.POST.get('relation', False)
        count = int(request.POST.get('count', 20))
        have_next_page = request.POST.get('have_next_page', False)
        profile = request.user.get_profile()
        
        userslist, have_next_page = __send_friend_profiles(relation, profile, cursor, count, result)
        
        result['have_next_page'] = have_next_page    
        request.session['cursor'] = cursor+count
        result['user_friends'] = __handle_friendship(userslist)
        result['cursor'] = cursor+count
        print(convertjson(result))
        return HttpResponse(convertjson(result))
    
def __handle_friendship(userlist):
    result = []
    for u in userlist:
        result.append(u.related_friend.get_profile_detail())
    return result

def __send_friend_profiles(relation, profile, cursor, count, result):
    if relation == 'follower':
        alluser = UserFriendshipProfileModel.objects.filter(related_user=profile, is_follower=True)
    if relation == 'following':
        alluser = UserFriendshipProfileModel.objects.filter(related_user=profile, is_following=True)
    if relation == 'friend':
        alluser = UserFriendshipProfileModel.objects.filter(related_user=profile, is_friends=True)
    length = len(alluser)
    amount = cursor+count
    if length <= amount:
        have_next_page = False
        amount = length
    else:
        have_next_page = True
    return alluser[cursor:amount], have_next_page
'''
def getUserWork(request):
    if request.method == 'POST':
        result={}
        result['work_date'] = __get_useralbum_workdate()
        result['work_num'] = __get_useralbum_num()
        result['img_src'] = photo_src
        result['img_id'] = photo_id
        result['img_title'] = photo_title
        return HttpResponse(convertjson(result))

'''
    
        

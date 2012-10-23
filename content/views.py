#coding = utf8
# Create your views here.
from authorize.models import UserProfile
from content.models import AlbumModel, PhotoModel
from datetime import datetime
from django.contrib.auth.decorators import login_required
from django.core.cache import cache
from django.core.urlresolvers import reverse
from django.http import HttpResponse, HttpResponseRedirect, Http404
from django.views.decorators.http import require_http_methods
from django.shortcuts import render, render_to_response
from django.template.defaultfilters import date as _date
from friendships.models import UserFriendshipProfileModel
from google.appengine.ext import blobstore
from utils.views import convertjson
import logging
import operator

log = logging.getLogger()
log.setLevel(logging.DEBUG)


@login_required
def personal_index(request):
    return render_to_response('content/personal_homepage.jade')

def content_index(request, cans_id):
    if request.method == "GET":
        if cans_id:
            #cans_id = request.POST.get('cans_id', False)
            user = UserProfile.objects.get(cans_id=cans_id)
        else:
            user = request.user.get_profile()
        works = __get_album(user)
    return render(request, 'content/contents_list.jade', {'works':works})

def __get_album(user):
    year=2012
    album_years=True
    albums_years_list=[]
    user_id_year={} 
    while album_years:
        album_years=[]
        album_years = AlbumModel.object.filter(datetime__year=year, profile=user).order_by('-datetime')
        if album_years:
            albums_years_list.append(album_years)
            year = year+1
    for albums in albums_years_list:
        month_album={}
        albumlist=[]
        month=[]
        year = _date(albums[0].datetime, "Y")
        cmp_month = _date(albums[0].datetime, "m")
        for album in albums:
            if _date(album.datetime, "m") ==cmp_month:
                album_details={}
                album_details['title'] = album.title
                album_details['albumid'] =album.albumid
                album_details['frontcover'] = album.frontcover
                albumlist.append(album_details)
            else:
                month_album['%s'%cmp_month] = albumlist
                month.append(month_album)
                month_album={}
                cmp_month = _date(album.datetime, "m")
                album_details={}
                album_details['title'] = album.title
                album_details['albumid'] =album.albumid
                album_details['frontcover'] = album.frontcover
                albumlist=[]
                albumlist.append(album_details)
        month_album['%s'%cmp_month] = albumlist
        month.append(month_album)
        user_id_year['%s'%(year)] = month
        month=[]
    cache.set('works',user_id_year)
    return user_id_year
@login_required
@require_http_methods(["POST", "GET"])
def up_load(request):
    if request.method == "GET":
        upload_url = blobstore.create_upload_url(reverse('content.views.up_load'))
        return render(request, 'upload/uploadpage.jade', {'upload_url':upload_url})
    elif request.method == "POST":
        log.debug(request.POST)
        return render_to_response('content/contents_list.jade')

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
    
        

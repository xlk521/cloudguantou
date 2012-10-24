#coding = utf8
# Create your views here.
from authorize.models import UserProfile
from content.models import AlbumModel, PhotoModel
from datetime import datetime
from django.contrib.auth.decorators import login_required
from django.core.cache import cache
from django.core.urlresolvers import reverse
from django.http import HttpResponse, HttpResponseRedirect, Http404
from django.shortcuts import render, render_to_response
from django.template.defaultfilters import date as _date
from django.views.decorators.http import require_http_methods
from friendships.models import UserFriendshipProfileModel
from google.appengine.api.images import NotImageError
from google.appengine.ext import blobstore
from utils import ImageFactory, convertjson
import json
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
            profile = UserProfile.objects.get(cans_id=cans_id)
        else:
            profile = request.user.get_profile()
        works = __get_album(profile)
    return render(request, 'content/contents_list.jade', {'works':works})


def __get_album(profile):
    works = {}
    albums = AlbumModel.objects.filter(profile=profile).order_by('-datetime')
    for album in albums:
        year = _date(album.datetime, 'Y')
        if not works.has_key(year):
            works[year] = {}
        month = _date(album.datetime, 'm')
        if not works[year].has_key(month):
            works[year][month] = []
        work = {}
        work['title'] = album.title
        work['albumid'] = album.albumid
        work['frontcover'] = album.frontcover
        works[year][month].append(work)
    return works

#@login_required
@require_http_methods(["POST", "GET"])
def up_load(request):
    if request.method == "GET":
        upload_url = blobstore.create_upload_url(reverse('content.views.up_load'))
        return render(request, 'content/uploadpage.jade', {'upload_url':upload_url})
    elif request.method == "POST":
        log.debug(request.POST)
        return render_to_response('content/contents_list.jade')

#@login_required
def work_upload(request):
    if request.method == "GET":
        if not request.GET.get('upload'):
            return render(request, 'content/publish_page.html', {})
        else:
            upload_url = blobstore.create_upload_url(reverse('content.views.work_upload'))
            return HttpResponse(convertjson({'url':upload_url}))
    else:
        blob = request.FILES['works']
        if blob and hasattr(blob, 'blobstore_info'):
            blob_key = str(blob.blobstore_info.key())
            log.debug(blob_key)
            try:
                factory = ImageFactory(blob_key, resize=(230, 170))
                blob_key = factory.get_blobkey()
            except NotImageError:
                return HttpResponse(json.dumps({'success':False}))
            return HttpResponse(json.dumps([{
                'name':blob.blobstore_info.filename,
                'size':blob.blobstore_info.size,
                'url':'http://www.6cans.com/authorize/head/%s'%(blob_key),
                'thumbnail_url':'http://www.6cans.com/authorize/head/%s'%(blob_key),
                'delete_url':'http://www.6cans.com/content/delete/%s'%(blob_key),
                'delete_type':'DELETE'}]))
        raise Http404
        
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
    
        

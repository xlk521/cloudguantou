#coding = utf8
# Create your views here.
from authorize.models import UserProfile
from content.models import Portfolio, Work, PortfolioForm, WorkForm
from django.contrib.auth.decorators import login_required
from django.core.urlresolvers import reverse
from django.http import HttpResponse, Http404, HttpResponseRedirect
from django.shortcuts import render, render_to_response
from django.template.defaultfilters import date as _date
from django.views.decorators.http import require_http_methods
from friendships.models import UserFriendshipProfileModel
from google.appengine.api.images import NotImageError
from google.appengine.ext import blobstore
from utils import ImageFactory, convertjson
import json
import logging
import uuid


log = logging.getLogger()
log.setLevel(logging.DEBUG)


@login_required
def personal_index(request):
    return render_to_response('content/personal_homepage.jade')

@login_required
@require_http_methods(["GET"])
def content_index(request, cans_id):
    if cans_id:
        profile = UserProfile.objects.get(cans_id=cans_id)
    else:
        profile = request.user.get_profile()
    
    works = {}
    portfolios = Portfolio.objects.filter(profile=profile).order_by('-datetime')
    for portfolio in portfolios:
        year = _date(portfolio.datetime, 'Y')
        if not works.has_key(year):
            works[year] = {}
        month = _date(portfolio.datetime, 'm')
        if not works[year].has_key(month):
            works[year][month] = []
        work = {}
        work['title'] = portfolio.title
        work['albumid'] = portfolio.pid
        work['frontcover'] = portfolio.cover_key
        works[year][month].append(work)

    return render(request, 'content/contents_list.jade', {'works':works})

@login_required
@require_http_methods(["POST", "GET"])
def up_load(request):
    if request.method == "GET":
        form = PortfolioForm()
        return render(request, 'content/uploadpage.jade', {'form':form})
    elif request.method == "POST":
        log.debug(request.POST)
        profile = request.user.get_profile()
        portfolio = Portfolio(profile=profile)
        form = PortfolioForm(request.POST, instance=portfolio)
        if form.is_valid():
            form.save()
            works = request.POST.get('works', False)
            if works:
                works = works.strip('|').split('|')
                for work in works:
                    details = work.split('&')
                    try:
                        master = False
                        if len(details)>3:
                            master = True
                            key = details[1]
                            name = details[2]
                            description = details[3]
                            form.instance.cover_key=key
                        else:
                            key = details[0]
                            name = details[1]
                            description = details[2]
                        Work.objects.create(
                            profile=profile, 
                            portfolio=form.instance, 
                            title=name, 
                            description=description, 
                            key=key, 
                            is_cover=master)
                    except Exception as e:
                        log.error(e.message)
        else:
            log.debug(form.errors)
        return HttpResponseRedirect(reverse('content.views.content_index', args=(profile.cans_id,)))
    
@login_required
@require_http_methods(["GET"])
def get_works(request):
    portfolio_id = request.GET.get('imgid', False)
    if portfolio_id:
        portfolio = Portfolio.objects.get_or_none(pid=portfolio_id)
        clickportfolio = dealPortfoliodata(portfolio)
    elif not portfolio_id: 
        profile = request.user.get_profile()
        portfolio = Portfolio.objects.filter(profile=profile).order_by('-datetime')[0]
        clickportfolio = dealPortfoliodata(portfolio)
    #return HttpResponse(profile)
    return HttpResponse(convertjson(clickportfolio))

def dealPortfoliodata(portfolio):
    clickportfolio = {}
    clickportfolio['title'] = portfolio.title
    clickportfolio['createtime'] = portfolio.createtime
    clickportfolio['description'] = portfolio.description
    if portfolio:
        works = Work.objects.filter(portfolio=portfolio)
        getwork = []
        for work in works:
            workdetails={}
            workdetails['url'] = work.url
            workdetails['description'] = work.description
            workdetails['parameter'] = work.parameter
            #work['collections'] = work.collections
            getwork.append(workdetails)
    clickportfolio['works'] = getwork
    return clickportfolio
    
@login_required
@require_http_methods(["POST", "GET"])
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
            try:
                factory = ImageFactory(blob_key, resize=(230, 170), remove=False)
                blob_key = factory.get_blobkey()
            except NotImageError:
                return HttpResponse(json.dumps({'success':False}))
            return HttpResponse(json.dumps([{
                'name':blob.blobstore_info.filename,
                'size':blob.blobstore_info.size,
                'url':'http://www.6cans.com/authorize/head/%s'%(blob_key),
                'thumbnail_url':'http://www.6cans.com/authorize/head/%s'%(blob_key),
                'delete_url':'http://www.6cans.com/content/delete/%s'%(blob_key),
                'delete_type':'GET'}]))
        raise Http404

@require_http_methods(["GET"])
def serve_work(request, photo_key):
    blob = blobstore.get(photo_key)
    if not blob:
        raise Http404
    else:
        return HttpResponse(blobstore.BlobReader(blob.key()).read(), content_type=blob.content_type)

@require_http_methods(["GET"])
def delete_work(request, photo_key):
    try:
        blobstore.delete(photo_key)
    except:
        pass
    return HttpResponse()
        
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
    
        

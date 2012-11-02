#coding=utf8
# Create your views here.
from django.contrib.auth.decorators import login_required
from django.shortcuts import render_to_response
from django.http import HttpResponse
from django.views.decorators.http import require_http_methods
from content.models import Work, Portfolio
from utils.helper import convertjson
from authorize.models import UserProfile


#@login_required
@require_http_methods(["GET", "POST"])
def index(request):
    if request.method != "POST":
        Portfolios = Portfolio.objects.all().order_by('-datetime')[0:20]
        return render_to_response('homepage/index.html',{'Portfolios':Portfolios})
    else :
        getAjaxAlbums(request)

def getAjaxAlbums(request):
    if request.method == "GET":
        album_counts = request.GET.get('album_conut', False)
        album_times = request.GET.get('album_times', False)
        album_begin = album_times*album_counts
        portfolios = Portfolio.objects.all().order_by('-datetime')[album_begin, album_begin+album_counts ]
        album_times=album_times+1
        albums={}
        albumlist=[]
        albums['album_times'] = album_times
        for portfolio in portfolios:
            portfolio_details={}
            portfolio_details['coverkey'] = portfolio.coverkey
            portfolio_details['title'] = portfolio.title
            portfolio_details['pid'] = portfolio.pid
            portfolio_details['profile_id'] = portfolio.profile_id
            profile = UserProfile.objects.get(pk=portfolio.profile_id)
            portfolio_details['nickname'] = profile.nickname
            albumlist.append(portfolio_details)
        albums['album_obj'] = albumlist
        return HttpResponse(convertjson(albums))
        
@require_http_methods(["GET"])
def getworkdata(request):
    works = Work.objects.all().order_by('-datetime')[0:19]
    return HttpResponse(convertjson(works))

def status(request):
    return HttpResponse()
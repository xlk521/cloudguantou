#coding=utf8
# Create your views here.
from django.contrib.auth.decorators import login_required
from django.shortcuts import render_to_response
from django.http import HttpResponse, HttpResponseRedirect
from django.views.decorators.http import require_http_methods
from content.models import Work, Portfolio, CategoryModel
from utils.helper import convertjson
from authorize.models import UserProfile
from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from django.contrib.auth.views import login
from django.contrib.auth.forms import AuthenticationForm
from django.template import RequestContext

#@login_required
@require_http_methods(["GET", "POST"])
def index(request):
    if request.method != "POST":
        portfolios = Portfolio.objects.all().order_by('-datetime')[0:20]
        request.session['album_latesttime'] = portfolios[0].datetime
        return render_to_response('homepage/index.html',{'Portfolios':portfolios},context_instance=RequestContext(request))
    else :
        album_latesttime = request.session.get('album_latesttime', False)
        if album_latesttime and request.POST.get('latest_count', False):
            portfolio_count = Portfolio.objects.exclude(datetime=album_latesttime).filter(datetime__gte=album_latesttime).count()
            return HttpResponse(convertjson({'index_count':portfolio_count}))
                
        elif request.POST.get('redict_personal_index', False):
            persona_id = request.user.get_profile().id
            return HttpResponse(convertjson({'persona_id':persona_id}))
        
        elif request.POST.get('get_current_albumdata', False):
            cur_count = request.POST.get('cur_count', False)
            cur_portfolios = Portfolio.objects.all().order_by('-datetime')[0:cur_count]
            request.session['album_latesttime'] = cur_portfolios[0].datetime
            cur_albums={}
            albumlist=[]
            for portfolio in cur_portfolios:
                portfolio_details={}
                portfolio_details['coverkey'] = portfolio.cover_key
                portfolio_details['title'] = portfolio.title
                portfolio_details['pid'] = portfolio.pid
                portfolio_details['profile_id'] = portfolio.profile_id
                profile = UserProfile.objects.get(pk=portfolio.profile_id)
                portfolio_details['nickname'] = profile.nickname
                albumlist.append(portfolio_details)
            #a_list=['converkey','title','pid','profile_id','nickname']
#            b_list=[portfolio.cover_key, portfolio.title, portfolio.pid, portfolio.profile_id, UserProfile.objects.get(pk=portfolio.profile_id).nickname]
#            albumlist=[dict(zip(a_list, b_list)) for portfolio in cur_portfolios]
            #albumlist=[{i: eval('portfolio.'+i) for i in a_list} for i in cur_portfolios]

            
            cur_albums['album_obj'] = albumlist
            return HttpResponse(convertjson(cur_albums))
        else:
            album_count = int(request.POST.get('album_count', False))
            album_times = int(request.POST.get('album_times', False))
            album_begin = album_times*album_count
            if request.POST.get('getcategory', False):
                getcategory = request.POST.get('getcategory', False)
                category = CategoryModel.objects.get(name=getcategory)
                portfolios = Portfolio.objects.filter(category=category).order_by('-datetime')[album_begin: album_begin+album_count ]
            else:
                portfolios = Portfolio.objects.all().order_by('-datetime')[album_begin: album_begin+album_count ]
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
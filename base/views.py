#coding=utf8
# Create your views here.
from django.contrib.auth.decorators import login_required
from django.shortcuts import render_to_response
from django.http import HttpResponse
from django.views.decorators.http import require_http_methods
from content.models import Work, Portfolio
from utils.helper import convertjson


#@login_required
def index(request):
    Portfolios = Portfolio.objects.all().order_by('-datetime')[0:19]
    return render_to_response('homepage/index.html',{'Portfolios':Portfolios})

@require_http_methods(["GET"])
def getworkdata(request):
    works = Work.objects.all().order_by('-datetime')[0:19]
    return HttpResponse(convertjson(works))

def status(request):
    return HttpResponse()
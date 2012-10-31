# Create your views here.
from authorize.models import UserProfile
from content.models import Portfolio, CategoryModel
from django.contrib.auth.decorators import login_required
from django.contrib.auth.models import User
from django.http import HttpResponse, HttpResponseRedirect, Http404
from django.shortcuts import render_to_response, render
from django.views.decorators.http import require_http_methods
from utils import convertjson
from django.core.serializers.json import DjangoJSONEncoder
import logging
import json


log = logging.getLogger()
log.setLevel(logging.DEBUG)


#@login_required
@require_http_methods(["POST", "GET"])
def audit_index(request):
    return render(request, 'audit/index.html', {})

def get_waiting_audit(request):
    portfolios = Portfolio.objects.filter(audited=False).values('pid', 'title', 'category', 'datetime', 'profile')
    log.debug(portfolios)
    for portfolio in portfolios:
        portfolio['category'] = CategoryModel.objects.get(id=portfolio['category']).name
        portfolio['owner'] = UserProfile.objects.get(id=portfolio['profile']).cans_id
        portfolio['datetime'] = portfolio['datetime'].strftime('%Y-%m-%dT%H:%M:%S')
        del portfolio['profile']
    log.debug(portfolios)
    result = {}
    result['portfolios'] = portfolios
    log.debug(result)
    return HttpResponse(json.dumps(result, cls=DjangoJSONEncoder, ensure_ascii=False))

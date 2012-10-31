# Create your views here.
from django.contrib.auth.decorators import login_required
from django.contrib.auth.models import User
from django.http import HttpResponse, HttpResponseRedirect, Http404
from django.shortcuts import render_to_response, render
import logging
from django.views.decorators.http import require_http_methods

#@login_required
@require_http_methods(["POST", "GET"])
def audit_index(request):
    return render(request, 'audit/index.html', {})

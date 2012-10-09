# Create your views here.
from django.shortcuts import render_to_response

def choose_identity(request):
    return render_to_response('identity/choose_identity.jade')

def identity(request):
    return render_to_response('identity/identity.jade')

def personal_details(request):
    return render_to_response('identity/personal_details.jade')

def works_details(request):
    return render_to_response('identity/works_details.jade')
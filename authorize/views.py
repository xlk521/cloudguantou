#coding=utf8
# Create your views here.
from .forms import PhotoForm
from .models import UserProfile, NormalIdentityForm, DesignerIdentityForm, PhotoItem
from base.models import Province, City
from django.conf import settings
from django.contrib.auth import authenticate, login
from django.contrib.auth.decorators import login_required
from django.contrib.auth.models import User
from django.core.urlresolvers import reverse
from django.http import HttpResponse, HttpResponseRedirect
from django.shortcuts import render
from django.shortcuts import render_to_response
from django.views.decorators.http import require_http_methods
from google.appengine.ext import blobstore
from utils import HeadFileUploader, render_to_json, get_uploads
from uuid import uuid4
import logging
import json

log = logging.getLogger()

@login_required
@require_http_methods(["POST", "GET"])
def identity(request):
    if request.method == 'GET':
        iden = request.GET.get('iden')
        upload_url = blobstore.create_upload_url('/authorize/head_upload/')
        if iden == 'normal':
            page = 'identity/personal_details.html'
            form = NormalIdentityForm()
        elif iden == 'designer':
            page = 'identity/works_details.html'
            form = DesignerIdentityForm()
        else:
            page = 'identity/choose_identity.html'
            form = ""
        return render(request, page, {'form':form,'upload_url':upload_url})
    elif request.method == 'POST':
        profile = request.user.get_profile()
        city_name = request.POST.get('city', False)
        if city_name:
            city = City.objects.get_or_none(name=city_name)
            if city:
                profile.city = city
        form = NormalIdentityForm(request.POST, instance=profile)
        if form.is_valid():
            form.save()
        else:
            print(form.errors)
        return HttpResponseRedirect('/content/personal')


@login_required
@require_http_methods(["POST"])
#@render_to_json
def get_cities(request):
    province = request.POST.get('province', False)
    province = Province.objects.get_or_none(name=province)
    if province:
        cities = City.objects.filter(province=province).values('name')
        result = []
        for city in cities:
            result.extend(city.values())
        return result
    else:
        return {}

@require_http_methods(["POST"])
def handle_head_upload(request):
    log.debug('head_upload')
    log.debug(request)
    results = []
    blob_keys = []
    #for name, fieldStorage in request.POST.get('head_file')

    #photo_blobs = get_uploads(request, field_name="qqfile", populate_post=True)
    #logging.debug(photo_blobs)
    #form = PhotoForm(request.POST)
    #if form.is_valid():
        #logging.debug('form valid')
        #photo_item = PhotoItem(name=form.cleaned_data['name'], photo=photo_blobs[0])
        #photo_item.put()
        #return {'success':True}
    #else:
        #logging.error(form.errors)
        #return {'failed':True}
    return HttpResponse(json.dumps({'success':True}))
    """
    allowedExtension = [".jpg",".png"]
    uploader = HeadFileUploader(allowedExtension)
    result, filename = uploader.handleUpload(request, settings.MEDIA_ROOT + "upload/")
    request.session['upload_head'] = filename
    """
    
def __create_new_profile():
    cans_id = str(uuid4())
    password = User.objects.make_random_password(length=32)
    user = User.objects.create_user(username=cans_id, email="%s@6cans.com"%(cans_id,))
    user.set_password(password)
    user.save()
    cans_profile = UserProfile.objects.get_or_none_by_user(user=user)
    return cans_id, password, cans_profile

def __authenticate_and_login(request, username=None, password=None, user=None):
    if username and password:
        user = authenticate(username=username, password=password)
        login(request, user)
    elif user:
        user.backend = 'django.contrib.auth.backends.ModelBackend'
        login(request, user)

def __authenticate_failed(request):
    return HttpResponseRedirect('/')

def __handle_newcomer(request):
    uri = '/authorize/identity'
    return render_to_response('authorize/callback.html', {'uri':uri})

def __handle_repeat(request):
    uri = '/'
    return render_to_response('authorize/callback.html', {'uri':uri})

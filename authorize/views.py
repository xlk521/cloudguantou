#coding=utf8
# Create your views here.
from forms import PhotoForm
from models import UserProfile, NormalIdentityForm, DesignerIdentityForm
from base.models import Province, City
from django.conf import settings
from django.contrib.auth import authenticate, login
from django.contrib.auth.decorators import login_required
from django.contrib.auth.models import User
from django.core.urlresolvers import reverse
from django.http import HttpResponse, HttpResponseRedirect, Http404
from django.shortcuts import render_to_response, render
from django.views.decorators.http import require_http_methods
from google.appengine.ext import blobstore
from google.appengine.api import images
from google.appengine.api.images import NotImageError
from utils import HeadFileUploader, render_to_json, ImageFactory, convertjson
from uuid import uuid4
import logging
import json
from brand.models import BrandProfile

log = logging.getLogger()
log.setLevel(logging.DEBUG)

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
        iden = request.POST.get('iden', False)
        profile = request.user.get_profile()
        cans_id = profile.cans_id
        if iden == 'designer':
            formdesign = DesignerIdentityForm(request.POST)
        city_name = request.POST.get('city', False)
        head = request.POST.get('img_url', False)
        x1 = request.POST.get('x1', False)
        y1 = request.POST.get('y1', False)
        x2 = request.POST.get('x2', False)
        y2 = request.POST.get('y2', False)
        
        if city_name:
            city = City.objects.get_or_none(name=city_name)
            if city:
                profile.city = city
        form = NormalIdentityForm(request.POST, instance=profile)
        if form.is_valid():
            #form直接可以存....
            form.save()
            profile.head = head
            profile.save()
        else:
            print(form.errors)
        return HttpResponse(profile.city)
        #return HttpResponseRedirect('/content/personal')

@login_required
@require_http_methods(["POST"])
#@render_to_json
def get_cities(request):
    result = []
    province = request.POST.get('province', False)
    province = Province.objects.get_or_none(name=province)
    if province:
        cities = City.objects.filter(province=province.name).values('name')
        for city in cities:
            result.extend(city.values())
    else:
        result = {}
    return HttpResponse(convertjson(result))

@require_http_methods(["POST"])
def handle_head_upload(request):
    blob = request.FILES['head_file']
    if blob and hasattr(blob, 'blobstore_info'):
        blob_key = str(blob.blobstore_info.key())
        try:
            factory = ImageFactory(blob_key)
            profile = request.user.get_profile()
            new_blob_key = str(factory.get_blobkey())
            profile.head = new_blob_key
            profile.save()
        except NotImageError:
            return HttpResponse(json.dumps({'success':False}))
    return HttpResponse(json.dumps({'success':True, 'photo_key':new_blob_key}))

@require_http_methods(["GET"])
def serve_head(request, photo_key):
    blob = blobstore.get(photo_key)
    if not blob:
        raise Http404
    else:
        return HttpResponse(blobstore.BlobReader(blob.key()).read(), content_type=blob.content_type)
    
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

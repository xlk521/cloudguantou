#coding=utf8
# Create your views here.

import sys
import traceback
from uuid import uuid4
import json
from django.conf import settings
from django.core.serializers.json import DjangoJSONEncoder
from django.http import HttpResponse
from django.contrib.auth.models import User
from authorize.models import UserProfile
from friendships.models import UserFriendshipProfileModel
def formatExceptionInfo(maxTBlevel=5):
    cla, exc, trbk = sys.exc_info()
    excName = cla.__name__
    try:
        excArgs = exc.__dict__["args"]
    except KeyError:
        excArgs = "<no args>"
    excTb = traceback.format_tb(trbk, maxTBlevel)
    return (excName, excArgs, excTb)

def convertjson(result):
    try:
        result =  json.dumps(result, ensure_ascii=False, separators=(',',':'), cls=DjangoJSONEncoder)      
    except Exception as e:
        print(e)
    return result

def initialization(request):
    
    for i in range(40):
        User.objects.create_user(username='User%d'%i, email='liangcc611@sina.com')
    for i in range(40):
        user = User.objects.filter(username = 'User%d'%i)[0]
        profile = UserProfile.objects.filter(user = user)[0]
        profile.nickname = 'nick%d'%i
        profile.head = '/statics/img/hand.jpg'
        profile.gender = True
        profile.cans_id = '%d'%i
        profile.followers_count = '%d'%i
        profile.friends_count = '%d'%i
        profile.works_count = '3'
        profile.introduction = 'helloworld'
        profile.save()
    for i in range(20):
        related_user = UserProfile.objects.filter(nickname = 'nick39')[0]
        related_friend = UserProfile.objects.filter(nickname = 'nick%s'%i)[0]
        UserFriendshipProfileModel.objects.create(related_user = related_user,
                                                  related_friend=related_friend, is_follower=True)
        
    for i in range(20,40):
        related_user = UserProfile.objects.filter(nickname = 'nick39')[0]
        related_friend = UserProfile.objects.filter(nickname = 'nick%s'%i)[0]
        UserFriendshipProfileModel.objects.create(related_user = related_user,
                                                  related_friend=related_friend, is_following=True)    
    #===========================================================================
    # for i in range(20):
    #    related_user = UserProfile.objects.filter(nickname = 'nick39')[0]
    #    related_friend = UserProfile.objects.filter(nickname = 'nick%s'%i)[0]
    #    model = UserFriendshipProfileModel.objects.filter(related_user = related_user,
    #                                              related_friend=related_friend)[0]
    #    model.is_friend=True
    #    model.save()
    #===========================================================================
    return HttpResponse('initialization add succeed!')

def cleanupDataBase(request):
    User.objects.all().delete();
    UserProfile.objects.all().delete();
    UserFriendshipProfileModel.objects.all().delete();
    return HttpResponse('DeleteDatabase  succeed!')
    

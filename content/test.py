#coding=utf8
from django.contrib.auth.models import User
from authorize.models import UserProfile
from friendships.models import UserFriendshipProfileModel
from content.models import Portfolio, Work, CategoryModel
def WriteDateToDatabase():
    user = User.objects.get(username='xlk111')
    profile = UserProfile.objects.get(user=user)
    CategoryModel.object.create(name = '摄影')
    CategoryModel.object.create(name = '手工艺')
    CategoryModel.object.create(name = '插画')
    cate1 = CategoryModel.object.get(pk=1)
    cate2 = CategoryModel.object.get(pk=2)
    for i in range(40):
        Portfolio.object.create(profile=profile, title='xlk%d'%i)
    
    for i in range(20,40):
        Portfolio.object.get(title='xlk%d'%i).category(cate2)
        
    for i in range(40):
        album = Portfolio.object.get(title='xlk0')
        Work.object.create(profile=profile, album=album, title='photo%d'%i, url='www.baidu.com', description='hello')

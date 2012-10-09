#coding=utf8
import logging

from django.contrib import admin
from django.db import models
from django.forms import ModelForm
from authorize.models import UserProfile
class UserFriendProfileManager(models.Manager):
    pass
        
class UserFriendshipProfileModel(models.Model):
    class Meta:
        unique_together = ('related_user', 'related_friend')
    
    related_user = models.ForeignKey(UserProfile, related_name='related_user')
    related_friend = models.ForeignKey(UserProfile, related_name='related_friend')
    data_time = models.DateTimeField(auto_now=True, auto_now_add=True)
    is_follower = models.BooleanField(blank=True)
    is_following = models.BooleanField(blank=True)
    is_friends = models.BooleanField(blank=True)
    
    objects = UserFriendProfileManager()

    
class UserFriendshipProfileForm(ModelForm):
    class Meta:
        model = UserFriendshipProfileModel
          
class DoubanFriendProfileManager(models.Manager):

    def get_or_none(self, cans_id, uid):
        u = self.filter(cans_id=cans_id, uid=uid)
        if len(u):
            print(u[0])
            return u[0]
        else:
            return None

class DoubanFriendProfileModel(models.Model):
    cans_id = models.CharField(max_length=36)
    uid = models.CharField(primary_key=True, max_length=256)
    title = models.CharField(max_length=256)
    location = models.CharField(max_length=256)
    content = models.TextField()
    alternate_link = models.URLField(blank=True)
    homepage_link = models.URLField(blank=True)
    icon_link = models.URLField(blank=True)
    friend = models.BooleanField()

    objects = DoubanFriendProfileManager()



class DoubanFriendProfileForm(ModelForm):
    class Meta:
        model = DoubanFriendProfileModel

class QQFriendProfileManager(models.Manager):

    def get_or_none(self, cans_id, uid):
        u = self.filter(cans_id=cans_id, uid=uid)
        if len(u):
            print(u[0])
            return u[0]
        else:
            return None


class QQFriendshipsModel(models.Model):

    class Meta:
        unique_together = (("cans_id", "openid"),)

    cans_id = models.CharField(max_length=36)
    name = models.CharField('帐户名', max_length=128)
    openid = models.CharField('用户唯一id', max_length=128)
    nick = models.CharField('昵称', max_length=128, blank=True)
    head = models.URLField('头像url', blank=True)
    sex = models.IntegerField('用户性别1男2女0未填写')
    location = models.CharField('用户所在地', max_length=128, blank=True)
    countrycode = models.IntegerField('国家码', blank=True, null=True)
    provincecode = models.IntegerField('省份码', blank=True, null=True)
    citycode = models.CharField('城市码', max_length=128, blank=True, null=True)
    fansnum = models.IntegerField('听众数', blank=True)
    idolnum = models.IntegerField('关注数', blank=True)
    ismyidol = models.BooleanField('是否我收听的人', blank=True)
    isfans = models.BooleanField('是否我的粉丝', blank=True)
    isvip = models.BooleanField('是否名人用户', blank=True)
    tag = models.TextField(blank=True)
    object = QQFriendProfileManager()

class SINAFriendshipsManager(models.Manager):
    def get_or_none(self, cans_id, uid):
        u = self.filter(cans_id=cans_id, uid=uid)
        if len(u):
            print(u[0])
            return u[0]
        else:
            return None

class SINAFriendshipsModel(models.Model):
    
    class Meta:
        unique_together = (("cans_id", "uid"),)
        
    cans_id = models.CharField(max_length=36)
    uid = models.CharField('用户UID', max_length=128)
    screen_name	= models.CharField('用户昵称', max_length=128)
    name = models.CharField('友好显示名称', max_length=128)
    province = models.IntegerField('用户所在地区ID')
    city = models.IntegerField('用户所在城市ID')
    location = models.CharField('用户所在地', max_length=128, blank=True)
    description = models.TextField('用户描述', blank=True)
    url = models.URLField('用户博客地址', blank=True)
    profile_image_url = models.URLField('用户头像地址')
    domain = models.CharField('用户的个性化域名', max_length=128, blank=True)
    gender = models.CharField('性别m男;f女;n未知;', max_length=2)
    followers_count = models.IntegerField('粉丝数')
    friends_count = models.IntegerField('关注数')
    statuses_count = models.IntegerField('微博数')
    favourites_count = models.IntegerField('收藏数')
    created_at = models.DateTimeField('创建时间')
    following = models.BooleanField('当前登录用户是否已关注该用户')
    allow_all_act_msg = models.BooleanField('是否允许所有人给我发私信')
    geo_enabled = models.BooleanField('是否允许带有地理信息')
    verified = models.BooleanField('是否是微博认证用户，即带V用户')
    allow_all_comment = models.BooleanField('是否允许所有人对我的微博进行评论')
    avatar_large = models.URLField('用户大头像地址')
    verified_reason	= models.CharField('认证原因', max_length=128, blank=True)
    follow_me = models.BooleanField('该用户是否关注当前登录用户')
    online_status = models.IntegerField('用户的在线状态，0:不在线;1:在线')
    bi_followers_count = models.IntegerField('用户的互粉数')
    is_friend = models.BooleanField(blank=True)
    is_follower = models.BooleanField(blank=True)

    objects = SINAFriendshipsManager()


class SINAFriendshipsForm(ModelForm):
    class Meta:
        model = SINAFriendshipsModel

class QQFriendshipsForm(ModelForm):
    class Meta:
        model = QQFriendshipsModel

class DoubanFriendProfileAdmin(admin.ModelAdmin):
    list_display = ('title', 'uid', 'cans_id',)

class QQFriendshipsAdmin(admin.ModelAdmin):
    list_display = ('name', 'nick', 'fansnum', 'idolnum', 'ismyidol', 'isfans', 'isvip')

class SINAFriendshipsAdmin(admin.ModelAdmin):
    list_display = ('screen_name', 'friends_count', 'followers_count', 'statuses_count', 'is_friend', 'is_follower', 'verified')

class UserFriendshipProfileAdmin(admin.ModelAdmin):
    list_display = ('related_user','related_friend' )

admin.site.register(DoubanFriendProfileModel, DoubanFriendProfileAdmin)
admin.site.register(QQFriendshipsModel, QQFriendshipsAdmin)
admin.site.register(SINAFriendshipsModel, SINAFriendshipsAdmin)
admin.site.register(UserFriendshipProfileModel, UserFriendshipProfileAdmin)

#coding=utf8
from base.models import Province, City
from django import forms
from django.contrib import admin
from django.contrib.auth.models import User
from django.db import models
from django.db.models.signals import post_save
from django.forms import ModelForm
from google.appengine.ext import blobstore
from google.appengine.ext import db
from brand.models import Brand
# Create your models here.


class UserProfileManager(models.Manager):
    def get_or_none_by_cansid(self, cans_id):
        u = self.filter(cans_id=cans_id)
        if len(u):
            return u[0]
        else:
            return None
        
    def get_or_none_by_user(self, user):
        u = self.filter(user=user)
        if len(u):
            return u[0]
        else:
            return None

class UserProfile(models.Model):
    class Meta:
        verbose_name_plural = '6Cans平台用户信息'

    GENDER_CHOICES = ((True, '男性'), (False, '女性'))

    user = models.OneToOneField(User)
    nickname = models.CharField(max_length=256)
    gender = models.BooleanField(choices=GENDER_CHOICES)
    head = models.CharField(max_length=256)
    cans_id = models.CharField(max_length=128)
    followers_count = models.CharField(max_length=128, default=0)
    friends_count = models.CharField(max_length=128, default=0)
    works_count = models.CharField(max_length=128, default=0)
    introduction = models.TextField('介绍', blank=True)
    city = models.ForeignKey(City, blank=True, null=True)
    province = models.ForeignKey(Province, blank=True, null=True)
    
    objects = UserProfileManager()

    def __unicode__(self):
        return "%s's profile" % self.user

    def get_profile_detail(self):
        details = {}
        for field in UserProfile._meta.fields:
            details[field.name]=field.value_to_string(self)
        return details

class NormalIdentityForm(ModelForm):
    class Meta:
        model = UserProfile
        exclude = ('followers_count', 'city', 'friends_count',  'works_count', 'user', 'cans_id')
        widgets = {'gender': forms.RadioSelect}

    def __init__(self, *args, **kwargs):
        from django.forms.widgets import HiddenInput
        super(NormalIdentityForm, self).__init__(*args, **kwargs)
        self.fields['head'].widget = HiddenInput()
        self.fields['head'].required = False

        
class DesignerIdentityForm(ModelForm):
    class Meta:
        model = Brand
        fields = ('name', 'introduction')
  
def create_user_profile(sender, instance, created, **kwargs):
    if created:
        UserProfile.objects.create(user=instance)
post_save.connect(create_user_profile, sender=User)

class TwitterProfileManager(models.Manager):
    pass

class TwitterProfileModel(models.Model):
    pass
    objects = TwitterProfileManager()

class QQProfileManager(models.Manager):
    def get_or_none(self, openid):
        u = self.filter(openid=openid)
        print(u)
        if len(u):
            return u[0]
        else:
            return None
        
class QQErrorManager(models.Manager):
    def get_or_none(self, openid):
        u = self.filter(openid=openid)
        print(u)
        if len(u):
            return u[0]
        else:
            return None
        
class QQErrorModel(models.Model):
    cans_id = models.CharField(max_length=36)
    errcode = models.CharField(max_length=36)
    msg = models.CharField(max_length=36)
    ret = models.CharField(max_length=36)
    seqid = models.CharField(max_length=36)
    
    objects = QQErrorManager()
    
class QQProfileModel(models.Model):
    class Meta:
        verbose_name_plural = '腾讯用户信息'

    cans_profile = models.OneToOneField(UserProfile)
    access_key = models.CharField("access_token", max_length=128, blank=True)
    access_secret = models.CharField("access_token_secret", max_length=128, blank=True)
    openid = models.CharField('id', max_length=128, blank=True, primary_key=True)
    name = models.CharField('账户名', max_length=128)
    nick = models.CharField('昵称', max_length=128)
    head = models.URLField('头像URL', blank=True)
    location = models.CharField('所在地', max_length=128, blank=True)
    countrycode = models.CharField('国家ID', max_length=128, blank=True)
    provincecode = models.CharField('省市ID', max_length=128, blank=True, null=True)
    citycode = models.CharField('城市', max_length=128, null=True, blank=True)
    isvip = models.BooleanField('是否认证')
    isent = models.BooleanField('企业')
    introduction = models.TextField('介绍', blank=True)
    verifyinfo = models.CharField('认证信息', max_length=256, blank=True)
    birthyear = models.CharField('出生年', max_length=6)
    birthmonth = models.CharField('出生月', max_length=6)
    birthday = models.CharField('出生日', max_length=6)
    sex = models.IntegerField('用户性别')
    fansnum = models.IntegerField('粉丝数')
    idolnum = models.IntegerField('收听数')
    tweetnum = models.IntegerField('微博数', blank=True)
    audit = models.BooleanField('受控帐户', default=False)
    errcode = models.CharField('errorcode', max_length=256, blank=True)
    msg = models.CharField('msg', max_length=6, blank=True)
    ret = models.CharField('ret', max_length=6, blank=True)
    seqid = models.CharField('seqid', max_length=256, blank=True)

    objects = QQProfileManager()

class QQProfileForm(ModelForm):
    class Meta:
        model = QQProfileModel
        exclude = ('cans_profile',)

class DoubanProfileManager(models.Manager):
    def get_or_none(self, uid):
        u = self.filter(uid=uid)
        if len(u):
            return u[0]
        else:
            return None

class DoubanProfileModel(models.Model):
    class Meta:
        verbose_name_plural = '豆瓣用户信息'

    cans_profile = models.OneToOneField(UserProfile)
    uid = models.CharField(primary_key=True, max_length=256)
    name = models.CharField(max_length=256)
    created = models.DateTimeField()
    avatar = models.URLField()
    loc_id = models.CharField(max_length=256)
    loc_name = models.CharField(max_length=256)
    alt = models.URLField()
    desc = models.CharField(max_length=256, blank=True)
    
    objects = DoubanProfileManager()
    
class DoubanProfileForm(ModelForm):
    class Meta:
        model = DoubanProfileModel
        exclude = ('cans_profile',)

class SINAProfileManager(models.Manager):
    def get_or_none(self, uid):
        u = self.filter(uid=uid)
        if len(u):
            return u[0]
        else:
            return None

class SINAProfileModel(models.Model):
    class Meta:
        verbose_name_plural = '新浪用户信息'

    cans_profile = models.OneToOneField(UserProfile)
    access_token = models.CharField('access_token', max_length=32, blank=True)
    expires_in = models.IntegerField("过期时间", blank=True)
    uid = models.CharField(max_length=32, primary_key=True)
    name = models.CharField(max_length=32)
    screen_name = models.CharField(max_length=32)
    province = models.CharField(max_length=32)
    city = models.CharField(max_length=32)
    location = models.CharField(max_length=32, blank=True)
    description = models.TextField(blank=True)
    url = models.CharField(max_length=256, blank=True)
    profile_image_url = models.URLField()
    domain = models.CharField(max_length=32, blank=True)
    gender = models.CharField(max_length=2)
    followers_count = models.IntegerField()
    friends_count = models.IntegerField()
    statuses_count = models.IntegerField()
    favourites_count = models.IntegerField()
    created_at = models.DateTimeField()
    following = models.BooleanField()
    allow_all_act_msg = models.BooleanField()
    geo_enabled = models.BooleanField()
    verified = models.BooleanField(blank=True)
    audit = models.BooleanField("受控帐户")
    allow_all_comment = models.BooleanField("是否允许所有人对我的微博进行评论")
    avatar_large = models.URLField("用户大头像地址")
    verified_reason    = models.CharField("认证原因", max_length=128, blank=True)
    follow_me = models.BooleanField("该用户是否关注当前登录用户")
    online_status = models.IntegerField("用户的在线状态0:不在线1:在线")
    bi_followers_count = models.IntegerField("用户的互粉数")

    objects = SINAProfileManager()
    
class SINAProfileForm(ModelForm):
    class Meta:
        model = SINAProfileModel
        exclude = ('cans_profile',)
    
class RenRenProfileManager(models.Manager):
    def get_or_none(self, uid):
        u = self.filter(uid=uid)
        if len(u):
            return u[0]
        else:
            return None
    
class RenRenProfileModel(models.Model):
    class Meta:
        verbose_name_plural = '人人用户信息'

    cans_profile = models.OneToOneField(UserProfile)
    uid = models.IntegerField('表示用户id')
    name = models.CharField('表示用户名', max_length=128)
    sex = models.BooleanField('表示性别，值1表示男性；值0表示女性')
    star = models.BooleanField('表示是否为星级用户，值“1”表示“是”；值“0”表示“不是”')
    zidou = models.BooleanField('表示是否为vip用户，值1表示是；值0表示不是')
    vip = models.BooleanField('表示是否为vip用户等级，前提是zidou节点必须为1')
    birthday = models.DateTimeField()
    email_hash = models.CharField(max_length=128, blank=True)
    tinyurl = models.URLField('表示头像链接 50*50大小')
    headurl = models.URLField('表示头像链接 100*100大小')
    mainurl = models.URLField('表示头像链接 200*200大小')
    hometown_location_country = models.CharField('表示家乡信息', max_length=128, blank=True)
    hometown_location_province = models.CharField('（子节点）表示所在省份', max_length=128, blank=True)
    hometown_location_city = models.CharField('（子节点）表示所在城市', max_length=128, blank=True)
    
    objects = RenRenProfileManager()
    
class RenRenProfileForm(ModelForm):
    class Meta:
        model = RenRenProfileModel
        exclude = ('cans_profile',)
class UserProfileAdmin(admin.ModelAdmin):
    list_display = ('user', 'nickname')
class DoubanProfileAdmin(admin.ModelAdmin):
    list_display = ('uid', 'name',)
class QQProfileAdmin(admin.ModelAdmin):
    list_display = ('name',)
class SINAProfileAdmin(admin.ModelAdmin):
    list_display = ('name',)
class RenRenProfileAdmin(admin.ModelAdmin):
    list_display = ('name',)
admin.site.register(UserProfile, UserProfileAdmin)
admin.site.register(DoubanProfileModel, DoubanProfileAdmin)
admin.site.register(QQProfileModel, QQProfileAdmin)
admin.site.register(SINAProfileModel, SINAProfileAdmin)
admin.site.register(RenRenProfileModel, RenRenProfileAdmin)

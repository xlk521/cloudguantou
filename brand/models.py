#coding=utf8
from django.db import models
from authorize.models import UserProfile
from django.forms import ModelForm,Textarea

# Create your models here.
class Brand(models.Model):
    class Meta:
        verbose_name_plural = u'品牌信息'
        
    name = models.CharField(max_length=128, primary_key=True)
    logo = models.URLField()
    create_date = models.DateTimeField(auto_now=True, auto_now_add=True)
    cancelled_date = models.DateTimeField(blank=True, null=True)
    introduction = models.TextField()
    follower_count = models.IntegerField(default=0)
    favorite_count = models.IntegerField(default=0)
    master = models.ForeignKey(UserProfile, related_name='master')
    
class DesignerIdentityForm(ModelForm):
    class Meta:
        model = Brand
        fields = ('name', 'introduction')
        widgets = {
            'introduction': Textarea(attrs={'cols': 20, 'rows': 5}),
        }
    
class Membership(models.Model):
    class Meta:
        verbose_name_plural = u'品牌成员信息'
        
    user = models.ForeignKey(UserProfile)
    brand = models.ForeignKey(Brand)
    date_joined = models.DateTimeField(auto_now=True, auto_now_add=True)
    date_dismissed = models.DateTimeField(auto_now=True, auto_now_add=True)
    available = models.BooleanField()
    
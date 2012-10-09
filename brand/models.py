#coding=utf8
from django.db import models
from django.contrib.auth.models import User

# Create your models here.
class BrandProfile(models.Model):
    class Meta:
        verbose_name_plural = u'品牌信息'
        
    name = models.CharField(max_length=128, primary_key=True)
    logo = models.URLField()
    create_date = models.DateTimeField(auto_now=True, auto_now_add=True)
    cancelled_date = models.DateTimeField(blank=True)
    introduction = models.TextField()
    follower_count = models.IntegerField(default=0)
    favorite_count = models.IntegerField(default=0)
    master = models.ForeignKey(User, related_name='master')
    members = models.ManyToManyField(User, related_name='members', through='Membership')
    
class Membership(models.Model):
    class Meta:
        verbose_name_plural = u'品牌成员信息'
        
    user = models.ForeignKey(User)
    brand = models.ForeignKey(BrandProfile)
    date_joined = models.DateTimeField(auto_now=True, auto_now_add=True)
    date_dismissed = models.DateTimeField(auto_now=True, auto_now_add=True)
    available = models.BooleanField()
    
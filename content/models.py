#coding=utf8
from django.db import models
from django.forms import ModelForm
from authorize.models import UserProfile
from django.contrib import admin
from utils import BaseModelManager
import uuid
# Create your models here.
class CategoryModelManager(BaseModelManager):
    pass

class CategoryModel(models.Model):
    name = models.CharField(max_length=64)
    
    object = CategoryModelManager()
    
    def __unicode__(self):
        return '%s'%self.name
   
class CategoryModelForm(ModelForm):
    class Meta:
        model = CategoryModel()

class PortfolioManager(BaseModelManager):
    pass

class Portfolio(models.Model):
    albumid = models.CharField(max_length=36, default=uuid.uuid5(uuid.NAMESPACE_DNS, 'album'))
    frontcover = models.CharField(max_length=128, blank=True)
    profile = models.ForeignKey(UserProfile)
    title = models.CharField(max_length=128)
    category = models.ForeignKey(CategoryModel)
    description = models.CharField(max_length=128, blank=True)
    parameter = models.CharField(max_length=128, blank=True)
    datetime = models.DateTimeField(auto_now=True, auto_now_add=True)
    
    objects = PortfolioManager()
    
    def __unicode__(self):
        return '%s Album'%self.title    

class PortfolioForm(ModelForm):
    class Meta:
        model = Portfolio

class WorkManager(BaseModelManager):
    pass

class Work(models.Model):
    photoid = models.CharField(max_length=36, default=uuid.uuid5(uuid.NAMESPACE_DNS, 'photo'))
    profile = models.ForeignKey(UserProfile)
    album = models.ForeignKey(Portfolio)
    title = models.CharField(max_length=128)
    url = models.CharField(max_length=128)
    description = models.CharField(max_length=128, blank=True)
    parameter = models.CharField(max_length=128, blank=True)
    price = models.FloatField(blank=True)
    
    objects = WorkManager()

    def __unicode__(self):
        return '%s Photo'%self.title
    
class WorkForm(ModelForm):
    class Meta:
        model = Work()

class PortfolioAdmin(admin.ModelAdmin):
    list_display = ('profile', 'title',)

class WorkAdmin(admin.ModelAdmin):
    list_display = ('profile', 'album', 'title')
    
class CategoryModelAdmin(admin.ModelAdmin):
    list_display = ('name',)

admin.site.register(Work, WorkAdmin)
admin.site.register(Portfolio, PortfolioAdmin)
admin.site.register(CategoryModel, CategoryModelAdmin)
    

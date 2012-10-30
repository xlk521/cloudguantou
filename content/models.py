#coding=utf8
from authorize.models import UserProfile
from brand.models import Brand
from django.contrib import admin
from django.contrib.admin import widgets
from django.db import models
from django.forms import ModelForm, Textarea
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

class ReCategoryBrandModelManager(BaseModelManager):
    pass

class ReCategoryBrandModel(models.Model):
    category = models.ForeignKey(CategoryModel)
    brand = models.ForeignKey(Brand)
    
    objects = ReCategoryBrandModelManager()
    
    def __unicode__(self):
        return '%s'%self.name
   
class ReCategoryBrandModelForm(ModelForm):
    class Meta:
        model = ReCategoryBrandModel()
        
class PortfolioManager(BaseModelManager):
    pass

class Portfolio(models.Model):
    pid = models.CharField(max_length=36)
    frontcover = models.CharField(max_length=128, blank=True)
    profile = models.ForeignKey(UserProfile)
    title = models.CharField(max_length=128)
    category = models.ForeignKey(CategoryModel)
    description = models.CharField(max_length=128, blank=True)
    parameter = models.CharField(max_length=128, blank=True)
    createtime = models.DateTimeField(blank=True, null=True)
    datetime = models.DateTimeField(auto_now=True, auto_now_add=True)
    
    objects = PortfolioManager()
    
    def __unicode__(self):
        return '%s Album'%self.title    

class PortfolioForm(ModelForm):
    class Meta:
        model = Portfolio
        fields=('title', 'description', 'createtime')
        widgets = {'description': Textarea(attrs={'cols': 20, 'rows': 5})}
         
    def __init__(self, *args, **kwargs):
        super(PortfolioForm, self).__init__(*args, **kwargs)
        self.fields['createtime'].widget = widgets.AdminDateWidget()
        #self.fields['mytime'].widget = widgets.AdminTimeWidget()
        #self.fields['mydatetime'].widget = widgets.AdminSplitDateTime()

class WorkManager(models.Manager):
    def get_or_none(self, **kwargs):
        try:
            return self.get(**kwargs)
        except self.model.DoesNotExist:
            return None

class Work(models.Model):
    wid = models.CharField(max_length=36)
    profile = models.ForeignKey(UserProfile)
    portfolio = models.ForeignKey(Portfolio)
    title = models.CharField(max_length=128)
    url = models.CharField(max_length=128)
    description = models.CharField(max_length=128, blank=True)
    parameter = models.CharField(max_length=128, blank=True)
    price = models.FloatField(blank=True)
    datetime = models.DateTimeField(auto_now=True, auto_now_add=True)

    #collections = models.FloatField(blank=True)
    
    objects = WorkManager()

    def __unicode__(self):
        return '%s Photo'%self.title
    
class WorkForm(ModelForm):
    class Meta:
        model = Work()
        fields=('title', 'description', 'url')

class WorkAdmin(admin.ModelAdmin):
    list_display = ('profile', 'title',)

class PortfolioAdmin(admin.ModelAdmin):
    list_display = ('profile', 'title')
    
class CategoryModelAdmin(admin.ModelAdmin):
    list_display = ('name',)

admin.site.register(Work, WorkAdmin)
admin.site.register(Portfolio, PortfolioAdmin)
admin.site.register(CategoryModel, CategoryModelAdmin)
    

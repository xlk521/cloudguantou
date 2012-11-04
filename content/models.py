#coding=utf8
from authorize.models import UserProfile
from brand.models import Brand
from django.contrib import admin
from django.contrib.admin import widgets
from django.db import models
from django import forms
from django.forms import ModelForm, Textarea
from utils import BaseModelManager
import uuid

# Create your models here.
class CategoryModelManager(BaseModelManager):
    pass

class CategoryModel(models.Model):
    class Meta:
        verbose_name_plural = u'产品类别'
        ordering = ['name']

    name = models.CharField(max_length=64)
    
    objects = CategoryModelManager()
    
    def __unicode__(self):
        return '%s'%self.name
   
class CategoryModelForm(ModelForm):
    class Meta:
        model = CategoryModel()

class PortfolioManager(BaseModelManager):
    pass

class Portfolio(models.Model):
    pid = models.CharField(max_length=36)
    profile = models.ForeignKey(UserProfile)
    title = models.CharField(max_length=128)
    category = models.ForeignKey(CategoryModel)
    description = models.CharField(max_length=128, blank=True)
    createtime = models.DateTimeField(blank=True, null=True)
    datetime = models.DateTimeField(auto_now=True, auto_now_add=True)
    coverkey = models.CharField(max_length=512, null=True)
    audited = models.BooleanField(default=False)
    
    objects = PortfolioManager()
    
    def __unicode__(self):
        return '%s Album'%self.title    

class PortfolioForm(ModelForm):
    class Meta:
        model = Portfolio
        fields=('title', 'description', 'createtime', 'category')
        widgets = {
            'description': Textarea(attrs={'cols': 20, 'rows': 5}),
            'createtime': forms.DateTimeInput(format='%d%m%Y',attrs={
                'class':'createtime',
                'readonly':'readonly',
                'size':'15',
            })
        }
         
    def __init__(self, *args, **kwargs):
        super(PortfolioForm, self).__init__(*args, **kwargs)
        self.fields['createtime'].widget = widgets.AdminDateWidget()

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
    key = models.CharField(max_length=512)
    description = models.CharField(max_length=128, blank=True)
    datetime = models.DateTimeField(auto_now=True, auto_now_add=True)
    price = models.FloatField(blank=True, default=0.0)
    is_cover = models.BooleanField(default=False)
    available = models.BooleanField(default=True)
    url = models.CharField(blank=True)
    
    objects = WorkManager()

    def __unicode__(self):
        return '%s'%self.title
    
class WorkForm(ModelForm):
    class Meta:
        model = Work()
        fields=('title', 'description', 'key')

class WorkAdmin(admin.ModelAdmin):
    list_display = ('profile', 'title',)

class PortfolioAdmin(admin.ModelAdmin):
    list_display = ('profile', 'title')
    
class CategoryModelAdmin(admin.ModelAdmin):
    list_display = ('name',)

admin.site.register(Work, WorkAdmin)
admin.site.register(Portfolio, PortfolioAdmin)
admin.site.register(CategoryModel, CategoryModelAdmin)
    

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
    frontcover = models.CharField(max_length=128, blank=True)
    pid = models.CharField(max_length=36, default=str(uuid.uuid4()))
    profile = models.ForeignKey(UserProfile)
    title = models.CharField(max_length=128)
    category = models.ForeignKey(CategoryModel)
    description = models.CharField(max_length=128, blank=True)
    createtime = models.DateTimeField(blank=True, null=True)
    datetime = models.DateTimeField(auto_now=True, auto_now_add=True)
    cover_key = models.CharField(max_length=512, null=True)
    
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
        from django.forms.widgets import HiddenInput
        super(PortfolioForm, self).__init__(*args, **kwargs)
        self.fields['createtime'].widget = widgets.AdminDateWidget()

class WorkManager(models.Manager):
    def get_or_none(self, **kwargs):
        try:
            return self.get(**kwargs)
        except self.model.DoesNotExist:
            return None

class Work(models.Model):
<<<<<<< HEAD
    wid = models.CharField(max_length=36)
=======
    wid = models.CharField(max_length=36, default=str(uuid.uuid4()))
>>>>>>> branch 'master' of https://github.com/guiyang/cloudguantou.git
    profile = models.ForeignKey(UserProfile)
    portfolio = models.ForeignKey(Portfolio)
    title = models.CharField(max_length=128)
    key = models.CharField(max_length=512)
    description = models.CharField(max_length=128, blank=True)
<<<<<<< HEAD
    parameter = models.CharField(max_length=128, blank=True)
    price = models.FloatField(blank=True)
    datetime = models.DateTimeField(auto_now=True, auto_now_add=True)

    #collections = models.FloatField(blank=True)
=======
    price = models.FloatField(blank=True, default=0.0)
    is_cover = models.BooleanField(default=False)
    audited = models.BooleanField(default=True)
>>>>>>> branch 'master' of https://github.com/guiyang/cloudguantou.git
    
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
    

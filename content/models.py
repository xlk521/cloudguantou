#coding=utf8
from django.db import models
from django.forms import ModelForm, Textarea
from authorize.models import UserProfile
from brand.models import Brand
from django.contrib import admin
from utils import BaseModelManager
import uuid
from django.contrib.admin import widgets        
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

<<<<<<< HEAD
class ReCategoryBrandModelManager(models.Manager):
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
        
class AlbumModelManager(models.Manager):
=======
class PortfolioManager(BaseModelManager):
>>>>>>> branch 'master' of https://github.com/guiyang/cloudguantou.git
    pass

class Portfolio(models.Model):
    albumid = models.CharField(max_length=36, default=uuid.uuid5(uuid.NAMESPACE_DNS, 'album'))
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
<<<<<<< HEAD
        model = AlbumModel
        fields=('title', 'description', 'createtime')
        widgets = {
            'description': Textarea(attrs={'cols': 20, 'rows': 5})
        }
         
    def __init__(self, *args, **kwargs):
        super(AlbumModelForm, self).__init__(*args, **kwargs)
        self.fields['createtime'].widget = widgets.AdminDateWidget()
        #self.fields['mytime'].widget = widgets.AdminTimeWidget()
        #self.fields['mydatetime'].widget = widgets.AdminSplitDateTime()
=======
        model = Portfolio
>>>>>>> branch 'master' of https://github.com/guiyang/cloudguantou.git

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
<<<<<<< HEAD
        model = PhotoModel()
        fields=('title', 'description', 'url')
=======
        model = Work()
>>>>>>> branch 'master' of https://github.com/guiyang/cloudguantou.git

class PortfolioAdmin(admin.ModelAdmin):
    list_display = ('profile', 'title',)

class WorkAdmin(admin.ModelAdmin):
    list_display = ('profile', 'album', 'title')
    
class CategoryModelAdmin(admin.ModelAdmin):
    list_display = ('name',)

admin.site.register(Work, WorkAdmin)
admin.site.register(Portfolio, PortfolioAdmin)
admin.site.register(CategoryModel, CategoryModelAdmin)
    

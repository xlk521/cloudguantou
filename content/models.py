#coding=utf8
from django.db import models
from django.forms import ModelForm
from authorize.models import UserProfile
from django.contrib import admin
# Create your models here.
class CategoryModelManager(models.Manager):
    pass

class CategoryModel(models.Model):
    name = models.CharField(max_length=64)
    #photograph = models.BooleanField('摄影', default = False)
    #handicraft = models.BooleanField('手工艺', default = False)
    #illustration = models.BooleanField('插画', default = False)
    
    object = CategoryModelManager()
    
    def __unicode__(self):
        return '%s'%self.name
   
class CategoryModelForm(ModelForm):
    class Meta:
        model = CategoryModel()   



class AlbumModelManager(models.Manager):
    pass

class AlbumModel(models.Model):
    
    profile = models.ForeignKey(UserProfile)
    title = models.CharField(max_length=128)
    category = models.ManyToManyField(CategoryModel)
    description = models.CharField(max_length=128, blank=True)
    parameter = models.CharField(max_length=128, blank=True)
    create_time = models.DateTimeField(auto_now=True, auto_now_add=True)
    
    object = AlbumModelManager()
    
    def __unicode__(self):
        return '%s Album'%self.title
    
class AlbumModelForm(ModelForm):
    class Meta:
        model = AlbumModel


class PhotoModelManager(models.Manager):
    pass

class PhotoModel(models.Model):
    profile = models.ForeignKey(UserProfile)
    album = models.ForeignKey(AlbumModel)
    title = models.CharField(max_length=128)
    url = models.CharField(max_length=128)
    description = models.CharField(max_length=128, blank=True)
    parameter = models.CharField(max_length=128, blank=True)
    
    object = PhotoModelManager()
    
    
   
class PhotoModelForm(ModelForm):
    class Meta:
        model = PhotoModel()
        
   

    


class AlbumModelAdmin(admin.ModelAdmin):
    list_display = ('profile', 'title',)

class PhotoModelAdmin(admin.ModelAdmin):
    list_display = ('profile', 'album', 'title')
    
class CategoryModelAdmin(admin.ModelAdmin):
    list_display = ('name',)

admin.site.register(PhotoModel, PhotoModelAdmin)
admin.site.register(AlbumModel, AlbumModelAdmin)
admin.site.register(CategoryModel, CategoryModelAdmin)
    

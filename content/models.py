#coding=utf8
from django.db import models
from django.forms import ModelForm
from authorize.models import UserProfile
from django.contrib import admin
import uuid
# Create your models here.
class CategoryModelManager(models.Manager):
    pass

class CategoryModel(models.Model):
    name = models.CharField(max_length=64)
    
    object = CategoryModelManager()
    
    def __unicode__(self):
        return '%s'%self.name
   
class CategoryModelForm(ModelForm):
    class Meta:
        model = CategoryModel()

class AlbumModelManager(models.Manager):
    pass

class AlbumModel(models.Model):
    albumid = models.CharField(default=uuid.uuid5(uuid.NAMESPACE_DNS, 'album'))
    frontcover = models.CharField(max_length=128, blank=True)
    profile = models.ForeignKey(UserProfile)
    title = models.CharField(max_length=128)
    category = models.ForeignKey(CategoryModel)
    description = models.CharField(max_length=128, blank=True)
    parameter = models.CharField(max_length=128, blank=True)
    datetime = models.DateTimeField(auto_now=True, auto_now_add=True)
    
    objects = AlbumModelManager()
    
    def __unicode__(self):
        return '%s Album'%self.title
    
class AlbumModelForm(ModelForm):
    class Meta:
        model = AlbumModel

class PhotoModelManager(models.Manager):
    def get_or_none(self, **kwargs):
        try:
            return self.get(**kwargs)
        except self.model.DoesNotExist:
            return None

class PhotoModel(models.Model):
        
    photoid = models.CharField(default=uuid.uuid5(uuid.NAMESPACE_DNS, 'photo'))
    profile = models.ForeignKey(UserProfile)
    album = models.ForeignKey(AlbumModel)
    title = models.CharField(max_length=128)
    url = models.CharField(max_length=128)
    description = models.CharField(max_length=128, blank=True)
    parameter = models.CharField(max_length=128, blank=True)
    price = models.FloatField(blank=True)
    
    objects = PhotoModelManager()

    def __unicode__(self):
        return '%s Photo'%self.title
    
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
    

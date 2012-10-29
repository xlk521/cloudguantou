#coding=utf8
from django.db import models
from django.forms import ModelForm, Textarea
from authorize.models import UserProfile
from brand.models import Brand
from django.contrib import admin
import uuid
from django.contrib.admin import widgets        
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
    pass

class AlbumModel(models.Model):
    albumid = models.CharField(max_length=36, default=uuid.uuid5(uuid.NAMESPACE_DNS, 'album'))
    frontcover = models.CharField(max_length=128, blank=True)
    profile = models.ForeignKey(UserProfile)
    title = models.CharField(max_length=128)
    category = models.ForeignKey(CategoryModel)
    description = models.CharField(max_length=128, blank=True)
    parameter = models.CharField(max_length=128, blank=True)
    createtime = models.DateTimeField(blank=True, null=True)
    datetime = models.DateTimeField(auto_now=True, auto_now_add=True)
    
    objects = AlbumModelManager()
    
    def __unicode__(self):
        return '%s Album'%self.title    

class AlbumModelForm(ModelForm):
    class Meta:
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

class PhotoModelManager(models.Manager):
    def get_or_none(self, **kwargs):
        try:
            return self.get(**kwargs)
        except self.model.DoesNotExist:
            return None

class PhotoModel(models.Model):
        
    photoid = models.CharField(max_length=36, default=uuid.uuid5(uuid.NAMESPACE_DNS, 'photo'))
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
        fields=('title', 'description', 'url')

class AlbumModelAdmin(admin.ModelAdmin):
    list_display = ('profile', 'title',)

class PhotoModelAdmin(admin.ModelAdmin):
    list_display = ('profile', 'album', 'title')
    
class CategoryModelAdmin(admin.ModelAdmin):
    list_display = ('name',)

admin.site.register(PhotoModel, PhotoModelAdmin)
admin.site.register(AlbumModel, AlbumModelAdmin)
admin.site.register(CategoryModel, CategoryModelAdmin)
    

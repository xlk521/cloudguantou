# coding=utf8
from django.db import models
from django.contrib import admin
from django.db.models.signals import pre_save
from utils import get_first_letter, BaseModelManager

# Create your models here.
class ProvinceManager(BaseModelManager):
    pass

class Province(models.Model):
    class Meta:
        verbose_name_plural = u'省级名称'
        ordering = ['ordering_letter']

    ordering_letter = models.CharField(max_length=2)
    name = models.CharField(primary_key=True, max_length=128)

    objects = ProvinceManager()

    def __unicode__(self):
        return self.name

class CityManager(models.Manager):
    pass

class City(models.Model):
    class Meta:
        verbose_name_plural = u'市级名称'
        unique_together = ('name', 'province')
        ordering = ['ordering_letter']

    ordering_letter = models.CharField(max_length=2)
    name = models.CharField(max_length=128)
    province = models.ForeignKey(Province)

    objects = CityManager()

    def __unicode__(self):
        return self.name

class CityInLine(admin.TabularInline):
    model = City

    def formfield_for_foreignkey(self, db_field, request=None, **kwargs):
        field = super(CityInLine, self).formfield_for_foreignkey(db_field, request, **kwargs)
        if db_field.name == 'inside_root':
            if request._obj__ is not None:
                field.queryset = field.queryset.filter(building__exact=request._obj_)
            else:
                field.queryset = field.queryset.none()

class ProvinceAdmin(admin.ModelAdmin):
    inlines = (CityInLine,)
    list_display = ('name',)

    def get_form(self, request, obj=None, **kwargs):
        request._obj_ = obj
        return super(ProvinceAdmin, self).get_form(request, obj, **kwargs)

class CityAdmin(admin.ModelAdmin):
    list_display = ('ordering_letter', 'name',)

admin.site.register(Province, ProvinceAdmin)
admin.site.register(City, CityAdmin)

def __update_ording_letter(sender, instance, **kwargs):
    instance.ordering_letter = get_first_letter(instance.name)
pre_save.connect(__update_ording_letter, sender=Province)
pre_save.connect(__update_ording_letter, sender=City)


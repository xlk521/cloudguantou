#coding=utf8
from django.db import models
from django.contrib import admin
from django.db.models.signals import pre_save

# Create your models here.
class ProvinceManager(models.Manager):
    def get_or_none(self, **kwargs):
        try:
            return self.get(**kwargs)
        except self.model.DoesNotExist:
            return None

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
    def get_or_none(self, **kwargs):
        try:
            return self.get(**kwargs)
        except self.model.DoesNotExist:
            return None

class City(models.Model):
    class Meta:
        verbose_name_plural = u'市级名称'
        unique_together = ('name','province')
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
                field.queryset = field.queryset.filter(building__exact = request._obj_)
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
    instance.ordering_letter = __get_first_letter(instance.name)
pre_save.connect(__update_ording_letter, sender=Province)
pre_save.connect(__update_ording_letter, sender=City)

def __get_first_letter(name):
    str = name.encode('GBK')
    if str<"\xb0\xa1" or str>"\xd7\xf9":
        return ""
    if str<"\xb0\xc4":
        return "A"
    if str<"\xb2\xc0":
        return "B"
    if str<"\xb4\xed":
        return "C"
    if str<"\xb6\xe9":
        return "D"
    if str<"\xb7\xa1":
        return "E"
    if str<"\xb8\xc0":
        return "F"
    if str<"\xb9\xfd":
        return "G"
    if str<"\xbb\xf6":
        return "H"
    if str<"\xbf\xa5":
        return "J"
    if str<"\xc0\xab":
        return "K"
    if str<"\xc2\xe7":
        return "L"
    if str<"\xc4\xc2":
        return "M"
    if str<"\xc5\xb5":
        return "N"
    if str<"\xc5\xbd":
        return "O"
    if str<"\xc6\xd9":
        return "P"
    if str<"\xc8\xba":
        return "Q"
    if str<"\xc8\xf5":
        return "R"
    if str<"\xcb\xf9":
        return "S"
    if str<"\xcd\xd9":
        return "T"
    if str<"\xce\xf3":
        return "W"
    if str<"\xd1\x88":
        return "X"
    if str<"\xd4\xd0":
        return "Y"
    if str<"\xd7\xf9":
        return "Z"
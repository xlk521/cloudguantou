from django.db import models
from utils.helper import BaseModelManager
from authorize.models import UserProfile
from django.forms.models import ModelForm
class DesignerVerInfoManager(BaseModelManager):
    pass

class DesignerVerInfo(models.Model):
    profile = models.ForeignKey(UserProfile)
    realname = models.CharField(max_length=128)
    phonenumber = models.CharField(max_length=128)
    address = models.CharField(max_length=128)
    worksample = models.CharField(max_length=128)
    id_type = models.CharField(max_length=128)
    id_num = models.CharField(max_length=128)
    id_photo = models.CharField(max_length=128)
    personal_details = models.CharField(max_length=128, blank=True)
    create_time = models.DateTimeField(auto_now_add=True)
    modify_time = models.DateTimeField(auto_now_add=True, auto_now=True)
    
    objects = DesignerVerInfoManager()
    
    def __unicode__(self):
        return '%s DesignerVerInfo'%self.realname    

class DesignerVerInfoForm(ModelForm):
    class Meta:
        model = DesignerVerInfo
        exclude={'create_time','modify_time','profile'}



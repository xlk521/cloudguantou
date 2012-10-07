#coding=utf8

from django import forms
#from account.fields import ReCaptchaField
from django.utils.translation import ugettext_lazy as _

class LoginForm(forms.Form):

    """ Form with ReCaptcha """

    username = forms.CharField(label="用户名:", min_length=2, max_length=30, required=True)
    password = forms.CharField(widget=forms.PasswordInput, label="密码", required=True)
    #recaptcha = ReCaptchaField()

class PhotoForm(forms.Form):
    name = forms.CharField(required=True)
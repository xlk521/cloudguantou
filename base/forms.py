#coding=utf8
'''
Created on 2012-8-28

@author: damon
'''
from django import forms
from registration.forms import RegistrationForm
from django.contrib.auth.models import User


class Email(forms.EmailField): 
    def clean(self, value):
        super(Email, self).clean(value)
        try:
            User.objects.get(email=value)
            raise forms.ValidationError("此邮件地址已经被注册，请更换另一邮件地址或使用此邮件地址登陆。")
        except User.DoesNotExist:
            return value


class UserRegistrationForm(forms.Form):
    password1 = forms.CharField(widget=forms.PasswordInput(), label="Password")
    #email will be become username
    email = Email()

    def clean_password(self):
        #if self.data['password1'] != self.data['password2']:
        #    raise forms.ValidationError('Passwords are not the same')
        return self.data['password1']
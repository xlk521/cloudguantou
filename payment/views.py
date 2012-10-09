# Create your views here.
from django.shortcuts import render_to_response

def order_check(request):
    return render_to_response('payment/order_check.jade')

def order_ok(request):
    return render_to_response('payment/order_ok.jade')

def order_write(request):
    return render_to_response('payment/order_write.jade')

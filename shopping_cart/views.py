# Create your views here.
from django.shortcuts import render_to_response

def choose_identity(request):
    return render_to_response('shopping_cart/my_cart.jade')
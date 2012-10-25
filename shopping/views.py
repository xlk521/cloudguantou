# Create your views here.
from content.models import PhotoModel
from .models import Product
from django.shortcuts import render
from django.http import Http404
from django.views.decorators.http import require_http_methods
import logging


log = logging.getLogger()
log.setLevel(logging.DEBUG)


@require_http_methods(["POST", "GET"])
def get_product(request, work_id):
    if request.method == "GET":
        work = PhotoModel.objects.get_or_none(photoid=work_id)
        if work:
            return render(request, 'shopping/product.jade', {})
        else:
            raise Http404

@require_http_methods(["POST", "GET"])
def get_cart(request, work_id):
    if request.method == "GET":
        #work = PhotoModel.objects.get_or_none(photoid=work_id)
        #if work:
        #return render(request, 'shopping/product.jade', {})
        #else:
        #    raise Http404
        pass

    elif request.method == "POST":
        pass
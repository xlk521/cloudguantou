#coding=utf8
# Create your views here.
from content.models import PhotoModel, AlbumModel
from .models import Product, Size, Package, Delivery, ProductForm
from base.models import City
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
            form = ProductForm()
            #获得图片尺寸
            sizes = Size.objects.filter(work=work)
            #获得包装或装饰
            packages = Package.objects.filter(work=work)
            #获得同系列的其他作品
            brothers = PhotoModel.objects.filter(album=work.album)
            #获得快递信息
            deliveries = Delivery.objects.all()
            #获得城市列表
            _from = _to = City.objects.all()
            return render(request, 'shopping/product.jade', {
                    'form':form, 'sizes':sizes, 'packages':packages, 
                    'brothers':brothers, 'deliveries':deliveries, '_from':_from, '_to':_to
                })
        else:
            raise Http404
    else:
        work_id = request.POST.get(work_id, False)
        delivery_id = request.POST.get(delivery_id, False)
        price_id = request.POST.get(delivery_price, False)
        size_id = request.POST.get(size_id, False)
        package_id = request.POST.get(ackage_id, False)
        if work_id and delivery_id and delivery_price and size_id:
            work = PhotoModel.objects.get_or_none(photoid=work_id)
            delivery = Delivery.objects.get_or_none(did=delivery_id)
            price = DeliveryPrice.objects.get_or_none(pid=price_id)
            size = Size.objects.get_or_none(sid=size_id)
            package = Package.objects.get_or_none(pid=package_id)
            if work and delivery and price and size and package:
                profile = request.user.get_profile()
                product = Product(work=work, delivery=delivery, price=price, size=size, package=package)
                form = ProductForm(request.POST, instance=product)
                if form.is_valid():
                    form.save()
                else:
                    log.error(form.errors)
            else:
                raise Http404
        else:
            raise Http404

@require_http_methods(["POST", "GET"])
def get_cart(request, work_id):
    if request.method == "GET":
        pass
    elif request.method == "POST":
        pass
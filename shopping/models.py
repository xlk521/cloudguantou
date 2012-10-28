#coding=utf8
from authorize.models import UserProfile
from base.models import City
from content.models import Work
from django.db import models
from django.forms import ModelForm
from utils import BaseModelManager
import uuid

# Create your models here.
class DeliveryManager(BaseModelManager):
    pass

class Delivery(models.Model):
    did = models.CharField("快递ID", max_length=36, default=str(uuid.uuid5(uuid.NAMESPACE_DNS, 'shopping_bank')))
    name = models.CharField(max_length=256)

    objects = DeliveryManager()

class DeliveryPriceManager(BaseModelManager):
    pass

class DeliveryPrice(models.Model):
    did = models.CharField("快递ID", max_length=36, default=str(uuid.uuid5(uuid.NAMESPACE_DNS, 'shopping_bank')))
    _from = models.ForeignKey(City, related_name='_from')
    _to = models.ForeignKey(City, related_name='_to')
    price = models.FloatField()

    objects = DeliveryPriceManager()

class BankManager(BaseModelManager):
    pass

class Bank(models.Model):
    bid = models.CharField('银行及支付平台ID', max_length=36, default=str(uuid.uuid5(uuid.NAMESPACE_DNS, 'shopping_bank')))
    name = models.CharField('名称', max_length=256)

    objects = BankManager()

class TransactionManager(BaseModelManager):
    pass

class Transaction(models.Model):
    tid = models.CharField('交易ID', max_length=36, default=str(uuid.uuid5(uuid.NAMESPACE_DNS, 'shopping_transaction')))

    objects = TransactionManager()

class PaymentManager(BaseModelManager):
    pass

class Payment(models.Model):
    STATUS_CHOICES = (
        (-1, '未完成'),
        (1, '已完成'),
    )

    pid = models.CharField('支付ID', max_length=36, default=str(uuid.uuid5(uuid.NAMESPACE_DNS, 'shopping_payment')))
    bank = models.ForeignKey(Bank)
    transaction = models.ForeignKey(Transaction)
    datetime = models.DateTimeField()
    status = models.IntegerField(choices=STATUS_CHOICES)

    objects = PaymentManager()

class SizeManager(BaseModelManager):
    pass

class Size(models.Model):
    sid = models.CharField("尺寸ID", max_length=36, default=str(uuid.uuid5(uuid.NAMESPACE_DNS, 'shopping_size')))
    name = models.CharField(max_length=128)
    price = models.CharField(max_length=128)
    work = models.ForeignKey(Work)

    objects = SizeManager()

class OrderManager(BaseModelManager):
    pass

class Order(models.Model):
    oid = models.CharField('订单ID', max_length=36, default=str(uuid.uuid5(uuid.NAMESPACE_DNS, 'shopping_order')))
    profile = models.ForeignKey(UserProfile)
    payment = models.ForeignKey(Payment)

    objects = OrderManager()

class ProductManager(BaseModelManager):
    pass

class Product(models.Model):
    pid = models.CharField('物品ID', max_length=36, default=str(uuid.uuid5(uuid.NAMESPACE_DNS, 'shopping_product')))
    work = models.ForeignKey(Work)
    profile = models.ForeignKey(UserProfile)
    quantity = models.FloatField('产品定价')
    delivery = models.ForeignKey(Delivery)
    delivery_price = models.ForeignKey(DeliveryPrice)
    order = models.ForeignKey(Order, blank=True)
    size = models.ForeignKey(Size)
    add_date = models.DateTimeField(auto_now=True)

    objects = ProductManager()

class ProductForm(ModelForm):
    class Meta:
        model = Product

class PackageManager(BaseModelManager):
    pass

class Package(models.Model):
    pid = models.CharField('包装ID', max_length=36, default=str(uuid.uuid5(uuid.NAMESPACE_DNS, 'shopping_package')))
    name = models.CharField('包装名称', max_length=128)
    weight = models.IntegerField('包装重量')
    price = models.FloatField('包装价格')
    work = models.ForeignKey(Work)

    objects = PackageManager()

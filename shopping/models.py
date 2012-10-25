#coding=utf8
from django.db import models
import uuid
from authorize.models import UserProfile
from content.models import PhotoModel

# Create your models here.
class PackageManager(models.Manager):
    pass

class Package(models.Model):
    pid = models.CharField('包装ID', max_length=36, default=str(uuid.uuid5(uuid.NAMESPACE_DNS, 'package')))
    name = models.CharField('包装名称', max_length=128)
    weight = models.IntegerField('包装重量')
    price = models.FloatField('包装价格')

    objects = PackageManager()

class BankManager(models.Manager):
    pass

class Bank(models.Model):
    bid = models.CharField('银行及支付平台ID', max_length=36, default=str(uuid.uuid5(uuid.NAMESPACE_DNS, 'bank')))
    name = models.CharField('名称', max_length=256)

    objects = BankManager()

class TransactionManager(models.Manager):
    pass

class Transaction(models.Model):
    tid = models.CharField('交易ID', max_length=36, default=str(uuid.uuid5(uuid.NAMESPACE_DNS, 'transaction')))

    objects = TransactionManager()

class PaymentManager(models.Manager):
    pass

class Payment(models.Model):
    STATUS_CHOICES = (
        (-1, '未完成'),
        (1, '已完成'),
    )

    pid = models.CharField('支付ID', max_length=36, default=str(uuid.uuid5(uuid.NAMESPACE_DNS, 'payment')))
    bank = models.ForeignKey(Bank)
    transaction = models.ForeignKey(Transaction)
    datetime = models.DateTimeField()
    status = models.IntegerField(choices=STATUS_CHOICES)

    objects = PaymentManager()

class OrderManager(models.Manager):
    pass

class Order(models.Model):
    oid = models.CharField('订单ID', max_length=36, default=str(uuid.uuid5(uuid.NAMESPACE_DNS, 'order')))
    profile = models.ForeignKey(UserProfile)
    payment = models.ForeignKey(Payment)

    objects = OrderManager()

class ProductManager(models.Manager):
    pass

class Product(models.Model):
    pid = models.CharField('物品ID', max_length=36, default=str(uuid.uuid5(uuid.NAMESPACE_DNS, 'product')))
    work = models.ForeignKey(PhotoModel)
    package = models.ForeignKey(Package)
    profile = models.ForeignKey(UserProfile)
    order = models.ForeignKey(Order, blank=True)
    quantity = models.FloatField('产品定价')
    add_date = models.DateTimeField(auto_now=True)

    objects = ProductManager()

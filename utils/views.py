#coding=utf8
# Create your views here.

import sys
import traceback
from uuid import uuid4
import json
from django.conf import settings
from django.core.serializers.json import DjangoJSONEncoder
def formatExceptionInfo(maxTBlevel=5):
    cla, exc, trbk = sys.exc_info()
    excName = cla.__name__
    try:
        excArgs = exc.__dict__["args"]
    except KeyError:
        excArgs = "<no args>"
    excTb = traceback.format_tb(trbk, maxTBlevel)
    return (excName, excArgs, excTb)

def convertjson(result):
    try:
        result =  json.dumps(result, ensure_ascii=False, separators=(',',':'), cls=DjangoJSONEncoder)      
    except Exception as e:
        print(e)
    return result

'''
Created on 2012-10-1
@author: damon
'''
from google.appengine.api import images, files
from google.appengine.ext import blobstore
from django import template
from django.db import models
from django.utils.datastructures import SortedDict
from uuid import uuid4
import json
import logging
import os
from django.core.serializers.json import DjangoJSONEncoder


log = logging.getLogger()
log.setLevel(logging.DEBUG)


register = template.Library()
@register.filter(name='sort')
def listsort(value):
    if isinstance(value, dict):
        new_dict = SortedDict()
        key_list = value.keys()
        key_list.sort()
        for key in key_list:
            new_dict[key] = value[key]
        return new_dict
    elif isinstance(value, list):
        new_list = list(value)
        new_list.sort()
        return new_list
    else:
        return value

class BaseModelManager(models.Manager):
    def get_or_none(self, **kwargs):
        try:
            return self.get(**kwargs)
        except self.model.DoesNotExist:
            return None

class HeadFileUploader(object):
    def __init__(self, allowedExtensions=[], sizeLimit=1024 * 1024 * 1024 * 100):
        self.allowedExtensions = allowedExtensions
        self.sizeLimit = sizeLimit
    
    def handleUpload(self, djangoRequest, uploadDirectory):
        uploaded = djangoRequest.read
        fileSize = int(uploaded.im_self.META["CONTENT_LENGTH"])
        fileName = uploaded.im_self.META["HTTP_X_FILE_NAME"]
        extension = self.__getExtensionFromFileName(fileName)
        if extension in self.allowedExtensions:
            if fileSize <= self.sizeLimit:
                filename = '%s%s' % (str(uuid4()), extension)
                _file = open(uploadDirectory + filename, "wb")
                _file.write(djangoRequest.read(fileSize))
                _file.close()
                return json.dumps({'success':True, 'file':filename}), filename
            else:
                return '{"error":"File is too large."}'
        else:
            return '{"error":"File has an invalid extension."}'
            
    def __getExtensionFromFileName(self, file_name):
        complete = os.path.splitext(file_name)
        return complete[2].lower()

class ImageFactory(object):
    def __init__(self, blob_key, rotate=True, resize=(800, 600), remove=True):
        self.resize_width = resize[0]
        self.resize_height = resize[1]
        scale = 1
        image = images.Image(image_data=blobstore.BlobReader(blob_key).read())
        image.rotate(0)
        image.execute_transforms(parse_source_metadata=True)
        exif = image.get_original_metadata()
        if exif and rotate:
            orientation = exif.get('Orientation', False)
            if orientation:
                if orientation == 1 or orientation == 2:
                    pass
                elif orientation == 3 or orientation == 4:
                    image.rotate(180)
                elif orientation == 5 or orientation == 6:
                    image.rotate(90)
                elif orientation == 7 or orientation == 8:
                    image.rotate(-90)
        width, height = image.width, image.height
        if width > height:
            if width > self.resize_width:
                scale = int(width / self.resize_width)
            image.resize(width=self.resize_width, height=int(height / scale))
        else:
            if height > self.resize_height:
                scale = int(height / self.resize_height)
            image.resize(width=int(width / scale), height=self.resize_height)
        new_image = image.execute_transforms(output_encoding=images.PNG)
        file_name = files.blobstore.create(mime_type='image/png')
        with files.open(file_name, 'a') as f:
            f.write(new_image)
        files.finalize(file_name)
        if remove:
            blobstore.delete(blob_key)
        self.blob_key = files.blobstore.get_blob_key(file_name)

    def get_exif(self):
        return self.image.get_original_metadata()
        
    def get_blobkey(self):
        return self.blob_key

def get_first_letter(name):
    letter = name.encode('GBK')
    if letter < "\xb0\xa1" or letter > "\xd7\xf9":
        return ""
    if letter < "\xb0\xc4":
        return "A"
    if letter < "\xb2\xc0":
        return "B"
    if letter < "\xb4\xed":
        return "C"
    if letter < "\xb6\xe9":
        return "D"
    if letter < "\xb7\xa1":
        return "E"
    if letter < "\xb8\xc0":
        return "F"
    if letter < "\xb9\xfd":
        return "G"
    if letter < "\xbb\xf6":
        return "H"
    if letter < "\xbf\xa5":
        return "J"
    if letter < "\xc0\xab":
        return "K"
    if letter < "\xc2\xe7":
        return "L"
    if letter < "\xc4\xc2":
        return "M"
    if letter < "\xc5\xb5":
        return "N"
    if letter < "\xc5\xbd":
        return "O"
    if letter < "\xc6\xd9":
        return "P"
    if letter < "\xc8\xba":
        return "Q"
    if letter < "\xc8\xf5":
        return "R"
    if letter < "\xcb\xf9":
        return "S"
    if letter < "\xcd\xd9":
        return "T"
    if letter < "\xce\xf3":
        return "W"
    if letter < "\xd1\x88":
        return "X"
    if letter < "\xd4\xd0":
        return "Y"
    if letter < "\xd7\xf9":
        return "Z"


def convertjson(result):
    try:
        result =  json.dumps(result, ensure_ascii=False, separators=(',',':'), cls=DjangoJSONEncoder)      
    except Exception as e:
        print(e)
    return result
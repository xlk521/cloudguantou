'''
Created on 2012-10-1
@author: damon
'''
from google.appengine.api import images
from google.appengine.ext import blobstore
from uuid import uuid4
import json
import logging

log = logging.getLogger()
log.setLevel(logging.DEBUG)


class HeadFileUploader(object):
    def __init__(self, allowedExtensions = [], sizeLimit = 1024*1024*1024*100):
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
                file = open(uploadDirectory + filename, "wb")
                file.write(djangoRequest.read(fileSize))
                file.close()
                return json.dumps({'success':True, 'file':filename}), filename
            else:
                return '{"error":"File is too large."}'
        else:
            return '{"error":"File has an invalid extension."}'
            
    def __getExtensionFromFileName(self,fileName):
        import os
        filename, extension = os.path.splitext(fileName)
        return extension.lower()

class ImageFactory(object):   
    def __init__(self, image):
        #获取图片Exif信息
        image.rotate(0)
        image.execute_transforms(output_encoding=images.PNG, quality=100, parse_source_metadata=True)
        exif = image.get_original_metadata()
        if exif:
            orientation = exif['Orientation']
            log.debug(orientation)
            if orientation==1 or orientation==2:
                pass
            elif orientation==3 or orientation==4:
                image.rotate(180)
            elif orientation==5 or orientation==6:
                image.rotate(90)
            elif orientation==7 or orientation==8:
                image.rotate(90)
        return

    def get_exif(self):
        return self.image.get_original_metadata()
        
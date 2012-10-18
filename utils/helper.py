'''
Created on 2012-10-1
@author: damon
'''
from google.appengine.api import images, files
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
    def __init__(self, blob_key):
        self.resize_width=800
        self.resize_height=600
        scale = 1
        image = images.Image(image_data=blobstore.BlobReader(blob_key).read())
        image.rotate(0)
        image.execute_transforms(parse_source_metadata=True)
        exif = image.get_original_metadata()
        if exif:
            orientation = exif.get('Orientation', False)
            if orientation:
                if orientation==1 or orientation==2:
                    pass
                elif orientation==3 or orientation==4:
                    image.rotate(180)
                elif orientation==5 or orientation==6:
                    image.rotate(90)
                elif orientation==7 or orientation==8:
                    image.rotate(-90)
        width, height = image.width, image.height
        if width>height:
            if width>self.resize_width:
                scale = int(width/self.resize_width)
            image.resize(width=self.resize_width, height=int(height/scale))
        else:
            if height>self.resize_height:
                scale = int(height/self.resize_height)
            image.resize(width=int(width/scale), height=self.resize_height)
        new_image = image.execute_transforms(output_encoding=images.PNG)
        file_name = files.blobstore.create(mime_type='image/png')
        with files.open(file_name, 'a') as f:
            f.write(new_image)
        files.finalize(file_name)
        blobstore.delete(blob_key)
        self.blob_key = files.blobstore.get_blob_key(file_name)

    def get_exif(self):
        return self.image.get_original_metadata()
        
    def get_blob_key(self):
        return self.blob_key
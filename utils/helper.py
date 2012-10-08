'''
Created on 2012-10-1

@author: damon
'''
import logging
import json
from uuid import uuid4
from google.appengine.ext import blobstore

log = logging.getLogger()

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

def get_uploads(request, field_name=None, populate_post=False):
    """
    http://appengine-cookbook.appspot.com/recipe/blobstore-get_uploads-helper-function-for-django-request/
 
    Get uploads sent to this handler.
 
    Args:
    field_name: Only select uploads that were sent as a specific field.
    populate_post: Add the non blob fields to request.POST
 
    Returns:
    A list of BlobInfo records corresponding to each upload.
    Empty list if there are no blob-info records for field_name.
    """
    log.debug('get uploads')
    log.debug(request)

    """
    if hasattr(request,'__uploads') == False:
        request.META['wsgi.input'].seek(0)
        fields = cgi.FieldStorage(request.META['wsgi.input'], environ=request.META)
        request.__uploads = {}
        if populate_post:
            request.POST = {}
        for key in fields.keys():
            log.debug(key)
            field = fields[key]
            if isinstance(field, cgi.FieldStorage) and 'blob-key' in field.type_options:
                request.__uploads.setdefault(key, []).append(blobstore.parse_blob_info(field))
            elif populate_post:
                request.POST[key] = field.value
    """

    if field_name:
        try:
            return list(request.__uploads[field_name])
        except KeyError:
            return []
    else:
        results = []
        for uploads in request.__uploads.itervalues():
            results += uploads
        return results
'''
Created on 2012-9-12

@author: damon
'''
from client import Client
import md5
import urllib

class RRClient(Client):
    '''
    classdocs
    '''

    def __init__(self, client_id, client_secret, **opts):
        '''
        Constructor
        '''
        Client.__init__(self, client_id, client_secret, **opts)
        self.params = {'format':'JSON', 'v':'1.0'}

    def user_getInfo(self):
        self.params['method']='users.getInfo'
        self.params['fields']='uid,name,sex,email_hash,star,zidou,vip,birthday,tinyurl,headurl,mainurl,hometown_location,work_history,university_history'
        return self.__send_request().body
    
    def __send_request(self):
        return self.request('POST', self.__build_url())
    
    def set_access_token(self, token):
        self.params['access_token'] = token

    def __build_url(self):
        self.site = 'http://api.renren.com/restserver.do'
        keys = self.params.keys()
        keys.sort()
        sig = ''
        for key in keys:
            sig += key + '=' + self.params[key]
        sig += self.secret
        self.params['sig'] = md5.new(sig).hexdigest()
        print(self.params['sig'])
        url = urllib.urlencode(self.params)
        print(url)
        return '?%s'%url
        
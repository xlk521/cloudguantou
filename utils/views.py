#coding=utf8
# Create your views here.

import sys
import traceback
import json
from django.http import HttpResponse
from django.contrib.auth.models import User
from authorize.models import UserProfile
from friendships.models import UserFriendshipProfileModel
from identity.models import DesignerVerInfo
from content.models import CategoryModel, Portfolio, Work
import uuid
import logging

log = logging.getLogger()
log.setLevel(logging.DEBUG)

def formatExceptionInfo(maxTBlevel=5):
    cla, exc, trbk = sys.exc_info()
    excName = cla.__name__
    try:
        excArgs = exc.__dict__["args"]
    except KeyError:
        excArgs = "<no args>"
    excTb = traceback.format_tb(trbk, maxTBlevel)
    return (excName, excArgs, excTb)

def initialization(request):
    #cleanupDataBase()
    for i in range(40):
        User.objects.create_user(username='User%d'%i, email='liangcc611@sina.com', password='111111')
    for i in range(40):
        user = User.objects.filter(username = 'User%d'%i)[0]
        profile = UserProfile.objects.filter(user = user)[0]
        profile.nickname = 'nick%d'%i
        profile.head = '/statics/img/hand.jpg'
        profile.gender = True
        profile.cans_id = '%d'%i
        profile.followers_count = '%d'%i
        profile.friends_count = '%d'%i
        profile.works_count = '3'
        profile.introduction = 'helloworld'
        profile.save()
    for i in range(20):
        related_user = UserProfile.objects.filter(nickname = 'nick39')[0]
        related_friend = UserProfile.objects.filter(nickname = 'nick%s'%i)[0]
        UserFriendshipProfileModel.objects.create(related_user = related_user,
                                                  related_friend=related_friend, is_follower=True)
        
    for i in range(20,40):
        related_user = UserProfile.objects.filter(nickname = 'nick39')[0]
        related_friend = UserProfile.objects.filter(nickname = 'nick%s'%i)[0]
        UserFriendshipProfileModel.objects.create(related_user = related_user,
                                                  related_friend=related_friend, is_following=True) 

    #===========================================================================
    # for i in range(20):
    #    related_user = UserProfile.objects.filter(nickname = 'nick39')[0]
    #    related_friend = UserProfile.objects.filter(nickname = 'nick%s'%i)[0]
    #    model = UserFriendshipProfileModel.objects.filter(related_user = related_user,
    #                                              related_friend=related_friend)[0]
    #    model.is_friend=True
    #    model.save()
    #===========================================================================
    initContentIndex()
    #WriteLoctionJsonToDatabase()
    return HttpResponse('initialization add succeed!')

def cleanupDataBase():
    User.objects.all().delete();
    UserProfile.objects.all().delete();
    UserFriendshipProfileModel.objects.all().delete();
    CategoryModel.objects.all().delete();
    Portfolio.objects.all().delete();
    DesignerVerInfo.objects.all().delete();
    Work.objects.all().delete();
    
    
location_json = '{"北京市":["海淀区","东城区","西城区","宣武区","丰台区","朝阳区","崇文区","大兴区","石景山区","门头沟区","房山区","通州区","顺义区","怀柔区","昌平区","平谷区","密云县","延庆县"],"天津市":["和平区","河西区","河北区","河东区","南开区","红桥区","北辰区","津南区","武清区","塘沽区","西青区","汉沽区","大港区","宝坻区","东丽区","蓟县","静海县","宁河县"],"上海":["黄浦区","卢湾区","徐汇区","长宁区","静安区","普陀区","闸北区","杨浦区","虹口区","闵行区","宝山区","嘉定区","浦东新区","金山区","松江区","青浦区","南汇区","奉贤区","崇明县"],"重庆":["渝中区","大渡口区","江北区","沙坪坝区","九龙坡区","南岸区","北碚区","万盛区","双桥区","渝北区","巴南区","万州区","涪陵区","黔江区","长寿区","江津区","永川区","南川区","綦江县","潼南县","铜梁县","大足县","荣昌县","璧山县","垫江县","武隆县","丰都县","城口县","梁平县","开县","巫溪县","巫山县","奉节县","云阳县","忠县","石柱土家族自治县","彭水苗族土家族自治县","酉阳苗族自治县","秀山土家族苗族自治县"],"新疆维吾尔自治区":["乌鲁木齐","克拉玛依","石河子","阿拉尔市","图木舒克","五家渠","哈密","吐鲁番","阿克苏","喀什","和田","伊宁","塔城","阿勒泰","奎屯","博乐","昌吉","阜康","库尔勒","阿图什","乌苏"],"西藏自治区":["拉萨","日喀则"],"宁夏回族自治区":["银川","石嘴山","吴忠","固原","中卫","青铜峡市","灵武市"],"内蒙古自治区":["呼和浩特","包头","乌海","赤峰","通辽","鄂尔多斯","呼伦贝尔","巴彦淖尔","乌兰察布","霍林郭勒市","满洲里市","牙克石市","扎兰屯市","根河市","额尔古纳市","丰镇市","锡林浩特市","二连浩特市","乌兰浩特市","阿尔山市"],"广西壮族自治区":["南宁","柳州","桂林","梧州","北海","崇左","来宾","贺州","玉林","百色","河池","钦州","防城港","贵港","岑溪","凭祥","合山","北流","宜州","东兴","桂平"],"黑龙江":["哈尔滨","大庆","齐齐哈尔","佳木斯","鸡西","鹤岗","双鸭山","牡丹江","伊春","七台河","黑河","绥化","五常","双城","尚志","纳河","虎林","密山","铁力","同江","富锦","绥芬河","海林","宁安","穆林","北安","五大连池","肇东","海伦","安达"],"吉林":["长春","吉林","四平","辽源","通化","白山","松原","白城","九台市","榆树市","德惠市","舒兰市","桦甸市","蛟河市","磐石市","公主岭市","双辽市","梅河口市","集安市","临江市","大安市","洮南市","延吉市","图们市","敦化市","龙井市","珲春市","和龙市"],"辽宁":["沈阳","大连","鞍山","抚顺","本溪","丹东","锦州","营口","阜新","辽阳","盘锦","铁岭","朝阳","葫芦岛","新民","瓦房店","普兰","庄河","海城","东港","凤城","凌海","北镇","大石桥","盖州","灯塔","调兵山","开原","凌源","北票","兴城"],"河北":["石家庄","唐山","邯郸","秦皇岛","保定","张家口","承德","廊坊","沧州","衡水","邢台","辛集市","藁城市","晋州市","新乐市","鹿泉市","遵化市","迁安市","武安市","南宫市","沙河市","涿州市","定州市","安国市","高碑店市","泊头市","任丘市","黄骅市","河间市","霸州市","三河市","冀州市","深州市"],"山东":["济南","青岛","淄博","枣庄","东营","烟台","潍坊","济宁","泰安","威海","日照","莱芜","临沂","德州","聊城","菏泽","滨州","章丘","胶南","胶州","平度","莱西","即墨","滕州","龙口","莱阳","莱州","招远","蓬莱","栖霞","海阳","青州","诸城","安丘","高密","昌邑","兖州","曲阜","邹城","乳山","文登","荣成","乐陵","临清","禹城"],"江苏":["南京","镇江","常州","无锡","苏州","徐州","连云港","淮安","盐城","扬州","泰州","南通","宿迁","江阴市","宜兴市","邳州市","新沂市","金坛市","溧阳市","常熟市","张家港市","太仓市","昆山市","吴江市","如皋市","通州市","海门市","启东市","东台市","大丰市","高邮市","江都市","仪征市","丹阳市","扬中市","句容市","泰兴市","姜堰市","靖江市","兴化市"],"安徽":["合肥","蚌埠","芜湖","淮南","亳州","阜阳","淮北","宿州","滁州","安庆","巢湖","马鞍山","宣城","黄山","池州","铜陵","界首","天长","明光","桐城","宁国"],"浙江":["杭州","嘉兴","湖州","宁波","金华","温州","丽水","绍兴","衢州","舟山","台州","建德市","富阳市","临安市","余姚市","慈溪市","奉化市","瑞安市","乐清市","海宁市","平湖市","桐乡市","诸暨市","上虞市","嵊州市","兰溪市","义乌市","东阳市","永康市","江山市","临海市","温岭市","龙泉市"],"福建":["福州","厦门","泉州","三明","南平","漳州","莆田","宁德","龙岩","福清市","长乐市","永安市","石狮市","晋江市","南安市","龙海市","邵武市","武夷山","建瓯市","建阳市","漳平市","福安市","福鼎市"],"广东":["广州","深圳","汕头","惠州","珠海","揭阳","佛山","河源","阳江","茂名","湛江","梅州","肇庆","韶关","潮州","东莞","中山","清远","江门","汕尾","云浮","增城市","从化市","乐昌市","南雄市","台山市","开平市","鹤山市","恩平市","廉江市","雷州市","吴川市","高州市","化州市","高要市","四会市","兴宁市","陆丰市","阳春市","英德市","连州市","普宁市","罗定市"],"海南":["海口","三亚","琼海","文昌","万宁","五指山","儋州","东方"],"云南":["昆明","曲靖","玉溪","保山","昭通","丽江","普洱","临沧","安宁市","宣威市","个旧市","开远市","景洪市","楚雄市","大理市","潞西市","瑞丽市"],"贵州":["贵阳","六盘水","遵义","安顺","清镇市","赤水市","仁怀市","铜仁市","毕节市","兴义市","凯里市","都匀市","福泉市"],"四川":["成都","绵阳","德阳","广元","自贡","攀枝花","乐山","南充","内江","遂宁","广安","泸州","达州","眉山","宜宾","雅安","资阳","都江堰市","彭州市","邛崃市","崇州市","广汉市","什邡市","绵竹市","江油市","峨眉山市","阆中市","华蓥市","万源市","简阳市","西昌市"],"湖南":["长沙","株洲","湘潭","衡阳","岳阳","郴州","永州","邵阳","怀化","常德","益阳","张家界","娄底","浏阳市","醴陵市","湘乡市","韶山市","耒阳市","常宁市","武冈市","临湘市","汨罗市","津市市","沅江市","资兴市","洪江市","冷水江市","涟源市","吉首市"],"湖北":["武汉","襄樊","宜昌","黄石","鄂州","随州","荆州","荆门","十堰","孝感","黄冈","咸宁","大冶市","丹江口市","洪湖市","石首市","松滋市","宜都市","当阳市","枝江市","老河口市","枣阳市","宜城市","钟祥市","应城市","安陆市","汉川市","麻城市","武穴市","赤壁市","广水市","仙桃市","天门市","潜江市","恩施市","利川市"],"河南":["郑州","洛阳","开封","漯河","安阳","新乡","周口","三门峡","焦作","平顶山","信阳","南阳","鹤壁","濮阳","许昌","商丘","驻马店","巩义市","新郑市","新密市","登封市","荥阳市","偃师市","汝州市","舞钢市","林州市","卫辉市","辉县市","沁阳市","孟州市","禹州市","长葛市","义马市","灵宝市","邓州市","永城市","项城市","济源市"],"山西":["太原","大同","忻州","阳泉","长治","晋城","朔州","晋中","运城","临汾","吕梁","古交","潞城","高平","介休","永济","河津","原平","侯马","霍州","孝义","汾阳"],"陕西":["西安","咸阳","铜川","延安","宝鸡","渭南","汉中","安康","商洛","榆林","兴平市","韩城市","华阴市"],"甘肃":["兰州","天水","平凉","酒泉","嘉峪关","金昌","白银","武威","张掖","庆阳","定西","陇南","玉门市","敦煌市","临夏市","合作市"],"青海":["西宁","格尔木","德令哈"],"江西":["南昌","九江","赣州","吉安","鹰潭","上饶","萍乡","景德镇","新余","宜春","抚州","乐平市","瑞昌市","贵溪市","瑞金市","南康市","井冈山市","丰城市","樟树市","高安市","德兴市"],"台湾":["台北","台中","基隆","高雄","台南","新竹","嘉义","板桥市","宜兰市","竹北市","桃园市","苗栗市","丰原市","彰化市","南投市","太保市","斗六市","新营市","凤山市","屏东市","台东市","花莲市","马公市"],"香港特别行政区":["中西区","东区","九龙城区","观塘区","南区","深水埗区","黄大仙区","湾仔区","油尖旺区","离岛区","葵青区","北区","西贡区","沙田区","屯门区","大埔区","荃湾区","元朗区"],"澳门特别行政区":["花地玛堂区","圣安多尼堂区","望德堂区","大堂区","风顺堂区","离岛","氹仔","路环"]}'
def WriteLoctionJsonToDatabase():
    from base.models import Province, City
    l = json.loads(location_json)
    for key in l.keys():
        log.debug(key)
        p = Province(name=key)
        p.save()
        for city in l[key]:
            log.debug(city)
            c = City(name=city, province=p)
            c.save()

def initContentIndex():
    CategoryModel.objects.create(name='摄影')
    CategoryModel.objects.create(name='插画')
    CategoryModel.objects.create(name='手工艺')
    
    userProfile = UserProfile.objects.get(nickname = 'nick39')
    category = CategoryModel.objects.get(name='摄影')
    for i in range(20):
        Portfolio.objects.create(pid=uuid.uuid4(), profile=userProfile, title='title%d'%i, category=category,
                                  description='description%d'%i)
    for i in range(20):
        album = Portfolio.objects.filter(title ='title%s'%i)[0]
        for i in range(2):
            work=Work.objects.create(wid=uuid.uuid4(), profile=userProfile, portfolio=album, title='title%d'%i,
                price='%f'%i, description='description%d'%i, key="1234567")
            if i==0:
                Portfolio.objects.update(cover_key=work.key)
    for i in range(20):
        DesignerVerInfo.objects.create(profile=userProfile, realname='realname%s'%i, phonenumber='111',
                                       address='北京', worksample='/statics/img/content_list.GIF', id_type='身份证',
                                       id_num='1234567890', id_photo='/statics/img/content_list.GIF',
                                       personal_details='personal_details%s'%i)


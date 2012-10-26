from django.contrib.auth.decorators import login_required
from authorize.models import UserProfile
from friendships.models import UserFriendshipProfileModel
from django.http import HttpResponse
from utils import convertjson

@login_required
def concerned_about_friends(request):

    result = {}
    cans_id = request.POST.get('cans_id', False)
    follow = request.POST.get('follow', False)
    unfollow = request.POST.get('unfollow', False)
    profile = request.user.get_profile()
    if cans_id and follow or unfollow:
        result = UserFriendshipProfileModel.objects.filter(related_user=profile, 
                                                           related_friend=UserProfile.objects.get(cans_id = cans_id))
        if follow:
            result.isFollowing = True
        elif unfollow:
            result.isFollowing = False
        result.save()
    result['cans_id'] = cans_id
    return HttpResponse(convertjson(result))
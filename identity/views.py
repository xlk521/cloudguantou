# Create your views here.
from django.shortcuts import render_to_response
from django.views.decorators.http import require_http_methods
from identity.models import DesignerVerInfoForm

def choose_identity(request):
    return render_to_response('identity/choose_identity.html')
@require_http_methods(['GET','POST'])
def identity(request):
    profile = request.user.get_profile()
    if request.method == "POST":
        form = DesignerVerInfoForm(request.POST, instance=profile)
    return render_to_response('identity/identity.html', {'form':form})

def personal_details(request):
    return render_to_response('identity/personal_details.html')

def works_details(request):
    return render_to_response('identity/works_details.html')

from django.shortcuts import render

# Create your views here.
from django.views.generic.edit import CreateView
from myapp.models import Photo
from datetime import date



def photos(request):
    photos = Photo.objects.all()
    return render(request, 'photos.html', {'photos': photos})
    

def hello(request):
    return render(request, 'index.html', {'data':{
        'date': date.today(),
    }

    })
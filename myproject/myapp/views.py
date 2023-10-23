from django.shortcuts import render

# Create your views here.
from django.views.generic.edit import CreateView
from .models import Photo
from datetime import date



def form_valid(request):
    return render(request, 'upload_photo.html')
    

def hello(request):
    return render(request, 'index.html', {'data':{
        'date': date.today(),
    }

    })
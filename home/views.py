from django.shortcuts import render

# Create your views here.

def getHome(req):
    return render(req, 'index.html')
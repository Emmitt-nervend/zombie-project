# Create your views here.
import requests
from django.shortcuts import render, render_to_response
from zombie import settings

def api(request):
	return render(request, "api.html", {})
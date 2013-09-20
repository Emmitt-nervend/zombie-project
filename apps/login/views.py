from django.shortcuts import render, render_to_response
from zombie.apps.login import forms


def home(request):
	return render(request, 'home.html', {})

def signUp(request):
	if request.method == 'POST':
		form = forms.CreateZombieUserForm(request.POST)
	return render(request, 'signUp.html', {})
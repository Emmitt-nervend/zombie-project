from django.shortcuts import render, render_to_response
from django.http import HttpResponseRedirect
from zombie.apps.login import forms

from django.contrib.auth.models import User as Auth_User
from django.contrib.auth import authenticate, logout, login
from zombie.apps.login.models import ZombieUser, Map



def home(request):
	return render(request, 'home.html', {})

def playoption(request):
	return render(request, 'playoption.html', {})

def signIn(request):
	return render(request, 'signIn.html', {})

def signUp(request):
	if request.method == 'POST':
		print "Post"
		form = forms.CreateZombieUserForm(request.POST)
		if request.POST['password'] == request.POST['passwordConfirm']:
			print "Passwords match"
			if form.is_valid():
				print "form is valid"
				cd = form.cleaned_data
				newAuthUser = Auth_User.objects.create_user(cd['userName'], cd['email'], cd['password'])
				newZombieUser = ZombieUser(user=newAuthUser)
				newZombieUser.save()
				user = authenticate(username=cd['userName'], password=cd['password'])
				login(request, user)
				return HttpResponseRedirect('/success/')
			else:
				return render(request, 'signUp.html', {'errors': 'Passowords do not match', 'form': form})
		else:
			return render(request, 'signUp.html', {'errors': 'Passowords do not match', 'form': form})
	else:
		return render(request, 'signUp.html', {})
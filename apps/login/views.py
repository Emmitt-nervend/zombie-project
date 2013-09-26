from django.shortcuts import render, render_to_response
from django.http import HttpResponseRedirect
from zombie.apps.login import forms

from django.contrib.auth.models import User as Auth_User
from django.contrib.auth import authenticate, logout, login
from zombie.apps.login.models import ZombieUser, Map


def home(request):
	return render(request, 'home.html', {})

def playoption(request):
	return render(request, 'playOption.html', {})

def signIn(request):
	if request.method == 'POST':
		form = forms.Login(request.POST)
		submittedName = request.POST['userName']
		submittedPassword = request.POST['password']
		#search for mathcing name
		user = authenticate(username=submittedName, password =submittedPassword)
		if user is not None:
			if user.is_active:
				login(request, user)
				return HttpResponseRedirect('/web/')
			else:
				return render(request, 'login.html', {'errors': 'Invalid user or password'})
		else:
			return render(request, 'login.html', {'errors': 'Invalid user or password'})
	else:
		return render (request, 'login.html', {})



	return render(request, 'login.html', {})

def web(request):
	return render(request, 'app.html', {})

def signUp(request):
	if request.method == 'POST':
		form = forms.CreateZombieUserForm(request.POST)
		if request.POST['password'] == request.POST['passwordConfirm']:
			if form.is_valid():
				cd = form.cleaned_data
				newAuthUser = Auth_User.objects.create_user(cd['userName'], cd['email'], cd['password'])
				newAuthUser.last_name = cd['lastName']
				newAuthUser.first_name = cd['firstName']
				newAuthUser.save()
				if cd['designer'] is 1:
					newZombieUser = ZombieUser(user=newAuthUser, accountType=1)
				else:
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

def success(request):
	return render(request, 'success.html', {})
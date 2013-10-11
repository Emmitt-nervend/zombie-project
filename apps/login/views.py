from django.shortcuts import render, render_to_response
from django.http import HttpResponseRedirect
from zombie.apps.login import forms

from django.contrib.auth.models import User as Auth_User
from django.contrib.auth import authenticate, logout, login
from zombie.apps.login.models import ZombieUser, Map
import json
#import simplejson as json 
import requests

def home(request):
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
				return render(request, 'home.html', {'errors': 'Invalid user or password'})
		else:
			return render(request, 'home.html', {'errors': 'Invalid user or password'})
	else:
		return render(request, 'home.html', {})

def playoption(request):
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
				return render(request, 'home.html', {'errors': 'Invalid user or password'})
		else:
			return render(request, 'home.html', {'errors': 'Invalid user or password'})
	else:
		return render(request, 'playOption.html', {})

def web(request):
	if request.user.is_authenticated():
		return render(request, 'app.html', {})
	else:
		return render(request, 'home.html', {})

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

def guest(request):
	map = {
		'title':'default map',
		'author': 'dave',
		'width': 15,
		'height': 15,
		'x': 4,
		'y': 4,
		'data': {
			'bottom': [
				[22,22,22,22,22,22,22,22,22,22,22,22,22,22,22],
				[22, 0, 8,16,22,22,22,22,22,22,22,22,22,22,22],
				[22, 1, 9, 8,16,22,22,22,22,22,22,22,22,22,22],
				[22, 1, 9, 9,17,22,22,22,22,22,22,22,22,22,22],
				[22, 2, 0, 9, 8,16,22,22,22,22,22,22,22,22,22],
				[22,22, 1, 9, 9, 8, 8,16,22,22,22,22,22,22,22],
				[22,22, 2, 4, 9, 9, 9, 8,16,22,22,22,22,22,22],
				[22,22,22, 2,10, 4, 9, 9, 8,16,22,22,22,22,22],
				[22,22,22,22,22, 2, 4, 9, 9,17,22,22,22,22,22],
				[22,22,22,22,22,22, 2, 4, 9,17,22,22,22,22,22],
				[22,22,22,22,22,22,22, 2,10,18,22,22,22,22,22],
				[22,22,22,22,22,22,22,22,22,22,22,22,22,22,22],
				[22,22,22,22,22,22,22,22,22,22,22,22,22,22,22],
				[22,22,22,22,22,22,22,22,22,22,22,22,22,22,22],
				[22,22,22,22,22,22,22,22,22,22,22,22,22,22,22]
			],
		'middle':[[],[],[],[],[],[],[],[],[],[],[],[],[],[],[]],
		'top':[[],[],[],[],[],[],[],[],[],[],[],[],[],[],[]]
		},
		'events': [],
		'env': 'normal'
	}

	url = 'http://zombie-attack.aws.af.cm/uploadMap/ae8c7e77-4e02-4d95-a63a-603b44cadf87'
	headers = {'content-type': 'application/json'}
	#map = json.dumps(map)
	#print map
	print dir(map)
	r = requests.post(url, data=json.dumps({'map':map}), headers=headers)
	print r.text
	print r.url
	print r.request
	print r.reason
	print r.json

		# $ is the symbol for jquery.
		#$.post('http://zombie-attack.aws.af.cm/uploadMap/12345', { map: map });
	return render(request, 'guest.html', {})	


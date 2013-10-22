import json
import requests

from datetime import datetime, timedelta
from django.contrib.auth.models import User as Auth_User
from django.contrib.auth import authenticate, logout, login
from django.core.mail import send_mail
from django.http import HttpResponseRedirect
from django.shortcuts import render, render_to_response
from django.utils.timezone import utc
from zombie import settings
from zombie.apps.login import forms
from zombie.apps.login.models import ZombieUser, Map, ResetLink

def home(request):
	if request.method == 'POST':
		form = forms.Login(request.POST)
		submitted_name = request.POST['userName']
		submitted_password = request.POST['password']
		#search for mathcing name
		user = authenticate(username=submitted_name, password =submitted_password)
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

def play_option(request):
	if request.method == 'POST':
		form = forms.Login(request.POST)
		submitted_name = request.POST['userName']
		submitted_password = request.POST['password']
		#search for mathcing name
		user = authenticate(username=submitted_name, password = submitted_password)
		if user is not None:
			if user.is_active:
				expiration = 3600  # One hour
				user.login(request, expiration)
				return HttpResponseRedirect('/web/')
			else:
				return render(request, 'home.html', {'errors': 'Inactive account'})
		else:
			return render(request, 'home.html', {'errors': 'Invalid user or password'})
	else:
		return render(request, 'play_option.html', {})

def web(request):
	if request.user.is_authenticated():
		return render(request, 'app.html', {})
	else:
		return render(request, 'home.html', {})

def sign_up(request):
	if request.method == 'POST':
		form = forms.CreateZombieUserForm(request.POST)
		if request.POST['password'] == request.POST['passwordConfirm']:
			if form.is_valid():
				cd = form.cleaned_data
				new_auth_user = Auth_User.objects.create_user(cd['userName'], cd['email'], cd['password'])
				new_auth_user.last_name = cd['lastName']
				new_auth_user.first_name = cd['firstName']
				new_auth_user.save()
				if cd['designer'] is 1:
					new_zombie_user = ZombieUser(user=new_auth_user, accountType=1)
				else:
					new_zombie_user = ZombieUser(user=new_auth_user)
				new_zombie_user.save()
				return HttpResponseRedirect('/success/')
			else:
				return render(request, 'sign_up.html', {'errors': 'Passowords do not match', 
														'form': form})
		else:
			return render(request, 'sign_up.html', {'errors': 'Passowords do not match', 
													'form': form})
	else:
		return render(request, 'sign_up.html', {})

def success(request):
	message = "Success! Your account has been created."
	return render(request, 'message.html', {'message': message})

def logout_user(request):
	if request.user.is_authenticated():
		logout(request)
		message = "You have been successfully logged out."
		return render(request, 'message.html', {'message': message})
	else:
		return HttpResponseRedirect('/')

def password_reset(request):
	if request.method == 'POST':
		form = forms.PasswordReset(request.POST)
		if form.is_valid():
			cd = form.cleaned_data
			email = cd['email']
			try:
				email_lookup = Auth_User.objects.get(email=email)
			except Auth_User.DoesNotExist:
				email_lookup = False
			if email_lookup:
				token = Auth_User.objects.make_random_password()
				current_time = datetime.utcnow().replace(tzinfo=utc)
				new_reset_link = ResetLink(token=token, user=email_lookup, timestamp=current_time)
				new_reset_link.save()
				url = settings.SITE_URL
				send_mail('Password Reset', 
						  'Hi there, ' + email_lookup.first_name +'. You recently requested a new password. Please follow this link to create a new password: ' + settings.SITE_URL + '/change-password/' + token + '.', 
						  'zombieattack51@gmail.com',
    					  [email], fail_silently=False)
				message = "Success! You will recieve an email with a password reset link."
				return render(request, 'message.html', {'message': message})
			else:
				message = "There is no user with that email address."
				return render(request, 'password_reset.html', {'message': message, 
															   'email': email})
	else:
		return render(request, 'password_reset.html', {})

def change_password(request, token):
	if request.method == 'POST':
		form = forms.ChangePassword(request.POST)
		if request.POST['password'] == request.POST['passwordConfirm']:
			if form.is_valid():
				cd = form.cleaned_data
				new_password = cd['password']
				try:
					token_match = ResetLink.objects.get(token=token, active=True)
				except ResetLink.DoesNotExist:
					token_match = False
				if token_match:
					user_id = token_match.user.id
					updated_user = Auth_User.objects.get(id=user_id)
					updated_user.set_password(new_password)
					updated_user.save()
					token_match.active = False
					token_match.save()
					message = "Your password has been successfully updated."
					return render(request, 'message.html', {'message': message})
				else:
					message = "Sorry, this link has expired."	
					return render(request, 'message.html', {'message': message})
			else:
				message = "Invalid submission. Stop trying to hack the site."
				return render(request, 'change_password.html', {'message': message})
		else:
			message = "Sorry, passwords do not match."
			return render(request, 'change_password.html', {'message': message})

	# Limits access to only people with a valid url
	else:
		try:
			token_match = ResetLink.objects.get(token=token, active=True)
		except ResetLink.DoesNotExist:
			token_match = False
		if token_match:
			twenty_four_hours = timedelta(hours=24)
			now = datetime.utcnow().replace(tzinfo=utc)
			difference = now - token_match.timestamp
			if difference < twenty_four_hours:
				return render(request, 'change_password.html', {})
			else:
				token_match.active = False
				token_match.save()
		message = "Sorry, this link has expired."	
		return render(request, 'message.html', {'message': message})

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
	#print dir(map)

	r = requests.post(url, data=json.dumps({'map':map}), headers=headers)

	#print r.headers
	#print r.url
	#print r.status_code
	#print r.encoding
	#print r.json
	#print r.request
	#print r.text

	python_response = json.loads(r.text)
	#print python_response['url']

	# $ is the symbol for jquery.
	#$.post('http://zombie-attack.aws.af.cm/uploadMap/12345', { map: map });
	
	return render(request, 'guest.html', {'url':python_response['url']})	

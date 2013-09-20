from django.shortcuts import render, render_to_response


def home(request):
	return render(request, 'home.html', {})

def login(request):
	return render(request, 'login.html', {})
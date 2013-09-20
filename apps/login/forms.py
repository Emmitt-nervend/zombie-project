from django import forms


class CreateZombieUserForm(forms.Form):
	firstName = forms.CharField()
	lastName = forms.CharField()
	userName = forms.CharField()
	email = forms.EmailField()
	password = forms.CharField()
	passwordConfirm = forms.CharField()


class Login(forms.Form):
	userName = forms.CharField()
	password = forms.CharField()
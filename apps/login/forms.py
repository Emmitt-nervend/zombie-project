from django import forms


class CreateZombieUserForm(forms.Form):
	firstName = forms.CharField()
	lastName = forms.CharField()
	userName = forms.CharField()
	email = forms.EmailField()
	password = forms.CharField()
	passwordConfirm = forms.CharField()
	designer = forms.BooleanField(required=False)


class Login(forms.Form):
	userName = forms.CharField()
	password = forms.CharField()


class PasswordReset(forms.Form):
	email = forms.CharField()
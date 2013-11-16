from django.contrib.auth.models import User
from django.db import models
from json_field import JSONField
import django_filepicker


class ZombieUser(models.Model):
	id = models.AutoField(primary_key=True)
	user = models.OneToOneField(User)
	games_won = models.IntegerField(null=True, blank=True)
	games_lost = models.IntegerField(null=True, blank=True)
	account_type = models.IntegerField(null=True, blank=True)
	maps = models.ManyToManyField('Map', null=True, blank=True)
	profile_pic = models.CharField(max_length=100, null=True, blank=True)

	def __unicode__(self):
		return unicode(self.user)


class Map(models.Model):
	id = models.AutoField(primary_key=True)
	title = models.CharField(max_length=60)
	url = models.CharField(max_length=500, null=True, blank=True)
	owner = models.ForeignKey(User, related_name='owners_maps')
	width = models.IntegerField()
	height = models.IntegerField()
	x = models.IntegerField()
	y = models.IntegerField()
	data = JSONField()
	events = models.CharField(max_length=1000)
	environment = models.CharField(max_length=100)

	def __unicode__(self):
		return unicode(self.id)


class ResetLink(models.Model):
	id = models.AutoField(primary_key=True)
	token = models.CharField(max_length=30)
	user = models.ForeignKey(User)
	timestamp = models.DateTimeField()
	active = models.BooleanField(default=True)

	def __unicode__(self):
		return unicode(self.user)
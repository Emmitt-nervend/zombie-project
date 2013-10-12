from django.contrib.auth.models import User
from django.db import models
from json_field import JSONField


class ZombieUser(models.Model):
	id = models.AutoField(primary_key=True)
	user = models.OneToOneField(User)
	gamesWon = models.IntegerField(null=True, blank=True)
	gamesLost = models.IntegerField(null=True, blank=True)
	accountType = models.IntegerField(null=True, blank=True)
	maps = models.ManyToManyField('Map', null=True, blank=True)

	def __unicode__(self):
		return unicode(self.user)

class Map(models.Model):
	id = models.AutoField(primary_key=True)
	title = models.CharField(max_length=60)
	owner = models.ForeignKey('ZombieUser', related_name='owners_maps')
	width = models.IntegerField()
	height = models.IntegerField()
	x = models.IntegerField()
	y = models.IntegerField()
	data = JSONField()
	events = models.CharField(max_length=1000)
	environment = models.CharField(max_length=100)

	def __unicode__(self):
		return unicode(self.title)
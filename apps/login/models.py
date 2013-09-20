from django.db import models
from django.contrib.auth.models import User


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
	name = models.CharField(max_length=60)
	owner = models.ForeignKey('ZombieUser', related_name='map_owner')

	def __unicode__(self):
		return unicode(self.name)




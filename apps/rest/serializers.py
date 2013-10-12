from django.contrib.auth.models import User
from rest_framework import serializers
from zombie.apps.login.models import Map, ZombieUser


class AuthUserSerializer(serializers.ModelSerializer):

	class Meta:
		fields = ('id', 'username', 'email')
		model = User


class ZombieUserSerializer(serializers.ModelSerializer):

	class Meta:
		fields = ('id', 'user', 'gamesWon', 'gamesLost', 'accountType', 'maps')
		model = ZombieUser


class MapSerializer(serializers.ModelSerializer):

	class Meta:
		fields = ('id', 'title', 'owner', 'width', 'height', 'x', 'y', 'data', 'events', 'environment')
		model = Map
from django.contrib.auth.models import User
from rest_framework import serializers
from zombie.apps.login.models import Map, ZombieUser


class AuthUserSerializer(serializers.ModelSerializer):

	class Meta:
		fields = ('id', 'username', 'email', 'first_name', 'last_name', 'is_staff', 'is_active')
		model = User


class ZombieUserSerializer(serializers.ModelSerializer):

	class Meta:
		fields = ('id', 'user', 'games_won', 'games_lost', 'account_type', 'maps', 'profile_pic')
		model = ZombieUser


class MapSerializer(serializers.ModelSerializer):

	class Meta:
		fields = ('id', 'title', 'owner', 'width', 'height', 'x', 'y', 'data', 'events', 'env')
		model = Map
from django.contrib.auth.models import User

from rest_framework import generics
from rest_framework.response import Response

from zombie.apps.login.models import ZombieUser, Map
from zombie.apps.rest.serializers import AuthUserSerializer, ZombieUserSerializer, MapSerializer


class AuthUserList(generics.ListAPIView):
	queryset = User.objects.all()
	serializer_class = AuthUserSerializer


class AuthUserDetail(generics.RetrieveUpdateDestroyAPIView):
	queryset = User.objects.all()
	serializer_class = AuthUserSerializer


class ZombieUserList(generics.ListAPIView):
	queryset = ZombieUser.objects.all()
	serializer_class = ZombieUserSerializer


class ZombieUserDetail(generics.RetrieveUpdateDestroyAPIView):
	queryset = ZombieUser.objects.all()
	serializer_class = ZombieUserSerializer


class MapList(generics.ListAPIView):
	queryset = Map.objects.all()
	serializer_class = MapSerializer


class MapDetail(generics.RetrieveUpdateDestroyAPIView):
	queryset = Map.objects.all()
	serializer_class = MapSerializer
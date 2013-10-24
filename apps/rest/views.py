import json

from django.contrib.auth import authenticate
from django.contrib.auth.models import User

from rest_framework import generics
from rest_framework import permissions
from rest_framework import status
from rest_framework.response import Response

from zombie.apps.login.models import ZombieUser, Map
from zombie.apps.rest.serializers import AuthUserSerializer, ZombieUserSerializer, MapSerializer


class AuthUserList(generics.ListAPIView):
	queryset = User.objects.all()
	serializer_class = AuthUserSerializer
	permission_classes = (permissions.IsAuthenticatedOrReadOnly,)


class AuthUserDetail(generics.RetrieveUpdateDestroyAPIView):
	queryset = User.objects.all()
	serializer_class = AuthUserSerializer
	permission_classes = (permissions.IsAuthenticated,)


class ZombieUserList(generics.ListAPIView):
	queryset = ZombieUser.objects.all()
	serializer_class = ZombieUserSerializer
	permission_classes = (permissions.IsAuthenticated,)


class ZombieUserDetail(generics.RetrieveUpdateDestroyAPIView):
	queryset = ZombieUser.objects.all()
	serializer_class = ZombieUserSerializer
	permission_classes = (permissions.IsAuthenticated,)


class MapList(generics.ListAPIView):
	queryset = Map.objects.all()
	serializer_class = MapSerializer
	permission_classes = (permissions.IsAuthenticated,)


class MapListByUser(generics.ListAPIView):
	permission_classes = (permissions.IsAuthenticated,)
	serializer_class = MapSerializer

	def get(self, request, user_id):
		maps = Map.objects.filter(owner=user_id)
		mapsFinal = [{'id': map_item.id,
					  'title': map_item.title,
					  'url': map_item.url} for map_item in maps]
		return Response(mapsFinal)


class MapDetail(generics.RetrieveUpdateDestroyAPIView):
	queryset = Map.objects.all()
	serializer_class = MapSerializer
	permission_classes = (permissions.IsAuthenticated,)


class ChangePassword(generics.GenericAPIView):
	permission_classes = (permissions.IsAuthenticated,)
	def get(self, request):
		user = User.objects.get(id=request.user.id)
		authentication = authenticate(username=request.user, password=request.GET["current_password"])
		if authentication:
			if request.GET["new_password"] == request.GET["confirm_new_password"]:
				user.set_password(request.GET["new_password"])
				user.save()
				return Response("Password changed successfully", status=status.HTTP_200_OK)
			else:
				return Response("Passwords do not match", status=status.HTTP_406_NOT_ACCEPTABLE)
		else:
			return Response("Incorrect password", status=status.HTTP_406_NOT_ACCEPTABLE)

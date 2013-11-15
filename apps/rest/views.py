import json
import requests

from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from django.core.mail import send_mail

from rest_framework import generics
from rest_framework import permissions
from rest_framework import status
from rest_framework.response import Response

from zombie.apps.login.models import ZombieUser, Map
from zombie.apps.rest.serializers import AuthUserSerializer, ZombieUserSerializer, MapSerializer

from django.shortcuts import render, render_to_response


class AuthUserList(generics.ListAPIView):
	queryset = User.objects.all()
	serializer_class = AuthUserSerializer
	permission_classes = (permissions.IsAuthenticated,)


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
	def post(self, request):
		user = User.objects.get(id=request.user.id)
		authentication = authenticate(username=request.user, password=request.POST["current_password"])
		if authentication:
			if request.POST["new_password"] == request.POST["confirm_new_password"]:
				user.set_password(request.POST["new_password"])
				user.save()
				return Response("Password changed successfully", status=status.HTTP_200_OK)
			else:
				return Response("Passwords do not match", status=status.HTTP_406_NOT_ACCEPTABLE)
		else:
			return Response("Incorrect password", status=status.HTTP_406_NOT_ACCEPTABLE)


class AdminRequest(generics.GenericAPIView):
	permission_classes = (permissions.IsAuthenticated,)
	def get(self, request):
		user = User.objects.get(id = request.user.id)
		print("about to send mail")
		print(user)
		send_mail('Admin Request', 
			'Hello, ' + str(user.username) + ' Would like to become an admin, please review his/her status and respond accordingly', 
			'zombieattack51@gmail.com',
			['russ.max783@gmail.com'], fail_silently=False)
		print("Sent mail")
		message = "Request has been sent, Check back later for results"
		return Response(message, status=status.HTTP_200_OK)


class SaveMap(generics.GenericAPIView):
	permission_classes = (permissions.IsAuthenticated,)
	def post(self, request):
		url = 'http://zombie-attack.aws.af.cm/uploadMap/ae8c7e77-4e02-4d95-a63a-603b44cadf87'
		headers = {'content-type': 'application/json'}
		map_dict = json.loads(request.POST['map'])
		json_map = json.dumps({'map':map_dict})
		r = requests.post(url, data=json_map, headers=headers)
		response_dict = json.loads(r.text)
		if r.status_code is 200:
			response = {}
			response['message'] = 'success'
			response['url'] = response_dict['url']
			return Response(response, status=status.HTTP_200_OK)
		else:
			return Response('Unkown error, you suck!', status=status.HTTP_406_NOT_ACCEPTABLE)


def api(request):
	return render(request, "api.html", {})



from django.conf.urls import patterns, url
from zombie.apps.rest import views

urlpatterns = patterns('',
	url(r'^zombie-users$', views.ZombieUserList.as_view()),
	url(r'^zombie-users/(?P<pk>[0-9]+)$', views.ZombieUserDetail.as_view()),
	url(r'^auth/users$', views.AuthUserList.as_view()),
	url(r'^auth/users/(?P<pk>[0-9]+)$', views.AuthUserDetail.as_view()),
	url(r'^maps$', views.MapList.as_view()),
	url(r'^maps/(?P<pk>[0-9]+)$', views.MapDetail.as_view()),
	url(r'^maps/by-user/(?P<user_id>[0-9]+)$', views.MapListByUser.as_view()),
	url(r'^change-password$', views.ChangePassword.as_view()),
	url(r'^upload$', views.UploadFile.as_view()),
	url(r'^api$', views.api, name='api'),
)
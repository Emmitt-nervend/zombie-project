from django.conf.urls import patterns, include, url
from zombie.apps.login.views import home

from django.contrib import admin
admin.autodiscover()

urlpatterns = patterns('',
    url(r'^$', 'zombie.apps.login.views.home', name='home'),
    url(r'^play/$', 'zombie.apps.login.views.playoption', name='playoption'),
    url(r'^sign-up/$', 'zombie.apps.login.views.signUp', name='sign-up'),
    url(r'^success/$', 'zombie.apps.login.views.success', name='success'),
    url(r'^web/$', 'zombie.apps.login.views.web', name='web'),
    url(r'^rest/', include('zombie.apps.rest.urls', namespace='rest')),
    url(r'^admin/', include(admin.site.urls)),
    url(r'^guest/', 'zombie.apps.login.views.guest'),
)

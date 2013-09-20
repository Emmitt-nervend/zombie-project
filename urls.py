from django.conf.urls import patterns, include, url
from zombie.apps.login.views import home

from django.contrib import admin
admin.autodiscover()

urlpatterns = patterns('',
    url(r'^$', 'zombie.apps.login.views.home', name='home'),
    url(r'^sign-up/$', 'zombie.apps.login.views.signUp', name='sign-up'),
    url(r'^admin/', include(admin.site.urls)),
)
